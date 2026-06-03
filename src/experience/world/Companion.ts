import * as THREE from 'three';

const TRAIL_LENGTH = 6;

// Double-blink state machine timings (seconds).
const BLINK_CLOSE_DUR = 0.08;   // c1 / c2 — eye closing
const BLINK_OPEN_DUR  = 0.12;   // o1 / o2 — eye opening
const BLINK_GAP_DUR   = 0.30;   // gap  — pause between the two blinks
const BLINK_MIN_IDLE  = 3.0;    // minimum idle wait before next double-blink
const BLINK_MAX_IDLE  = 8.0;    // maximum idle wait before next double-blink
const EYE_CLOSE_SCALE = 0.05;   // target scale.y while closed
const EYE_SQUINT_Z    = 0.32;   // rotation.z magnitude for the >< squint

// Orbital + gaze state machine constants.
const ORBIT_RADIUS    = 0.7;                         // world units
const ORBIT_SPEED     = (Math.PI * 2) / 12;          // 1 revolution per 12 s
const GAZE_TURN_DUR   = 0.6;                         // seconds to rotate head
const GAZE_PANEL_DUR  = 2.0;                         // seconds spent "reading" panel
const GAZE_CAMERA_MIN = 4.0;                         // min seconds looking at camera
const GAZE_CAMERA_MAX = 8.0;                         // max seconds looking at camera

type BlinkState = 'idle' | 'c1' | 'o1' | 'gap' | 'c2' | 'o2';
type GazeState  = 'camera' | 'to_panel' | 'panel' | 'to_camera';

// The Mote: a soft glowing orb with two eyes and a short trailing wisp. It floats
// just ahead of the camera along the direction of travel, leading the journey.
export class Companion {
  readonly group = new THREE.Group();

  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];

  private readonly body: THREE.Mesh;
  private readonly trail: THREE.Mesh[] = [];

  // Eyes stored as fields so the blink state machine can drive them each frame.
  private readonly eyeL: THREE.Mesh;
  private readonly eyeR: THREE.Mesh;

  private readonly forward = new THREE.Vector3();
  private readonly target = new THREE.Vector3();

  // Blink state machine (no per-frame allocation; plain number / string fields).
  private blinkClock = 0;
  private blinkState: BlinkState = 'idle';
  private nextBlink = BLINK_MIN_IDLE + Math.random() * (BLINK_MAX_IDLE - BLINK_MIN_IDLE);

  // Orbital + gaze state (all scratch objects declared here — zero per-frame alloc).
  private orbitAngle = 0;
  private readonly orbitAnchor = new THREE.Vector3();
  private readonly camRight    = new THREE.Vector3();
  private readonly camUp       = new THREE.Vector3();
  private readonly worldUp     = new THREE.Vector3(0, 1, 0);
  private gazeBlend  = 0;
  private gazeClock  = 0;
  private gazeState: GazeState  = 'camera';
  private nextGaze   = GAZE_CAMERA_MIN + Math.random() * (GAZE_CAMERA_MAX - GAZE_CAMERA_MIN);
  private readonly quatCamera  = new THREE.Quaternion();
  private readonly quatPanel   = new THREE.Quaternion();
  private readonly scratchObj  = new THREE.Object3D(); // NEVER added to scene

  constructor() {
    const bodyGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xff9ad8,
      emissive: 0xff5fb0,
      emissiveIntensity: 0.9,
      roughness: 0.4,
    });
    this.body = new THREE.Mesh(bodyGeo, bodyMat);
    this.geometries.push(bodyGeo);
    this.materials.push(bodyMat);

    const haloGeo = new THREE.SphereGeometry(0.5, 20, 20);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffc2e8,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    this.geometries.push(haloGeo);
    this.materials.push(haloMat);
    this.body.add(halo);

    const eyeGeo = new THREE.SphereGeometry(0.06, 10, 10);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2a1430 });
    this.geometries.push(eyeGeo);
    this.materials.push(eyeMat);

    this.eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    this.eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    this.eyeL.position.set(-0.11, 0.05, 0.28);
    this.eyeR.position.set(0.11, 0.05, 0.28);
    this.body.add(this.eyeL, this.eyeR);

    this.group.add(this.body);

    const trailGeo = new THREE.SphereGeometry(0.16, 10, 10);
    this.geometries.push(trailGeo);
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const trailMat = new THREE.MeshBasicMaterial({
        color: 0xffb0e0,
        transparent: true,
        opacity: 0.4 * (1 - i / TRAIL_LENGTH),
        depthWrite: false,
      });
      this.materials.push(trailMat);
      const dot = new THREE.Mesh(trailGeo, trailMat);
      dot.scale.setScalar(1 - i / (TRAIL_LENGTH + 2));
      this.group.add(dot);
      this.trail.push(dot);
    }

    // 3D body provides the ambient pink glow through the panel glass.
    // DOM MoteOverlay (z-index:10) sits on top as the crisp, blinking face.
    this.group.visible = true;
  }

  // Advance the >< double-blink state machine.
  // Blink fires regardless of `motion` — it is an expression, not idle animation.
  private updateBlink(dt: number): void {
    this.blinkClock += dt;

    // Lerp helpers — inline, no allocation.
    const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
    const alpha = (dur: number) => Math.min(this.blinkClock / dur, 1);

    switch (this.blinkState) {
      case 'idle': {
        if (this.blinkClock >= this.nextBlink) {
          this.blinkClock = 0;
          this.blinkState = 'c1';
        }
        break;
      }
      case 'c1': {
        // Close both eyes: scale.y → EYE_CLOSE_SCALE, rotation.z → ±EYE_SQUINT_Z
        const a = alpha(BLINK_CLOSE_DUR);
        this.eyeL.scale.y = lerpN(1, EYE_CLOSE_SCALE, a);
        this.eyeR.scale.y = lerpN(1, EYE_CLOSE_SCALE, a);
        this.eyeL.rotation.z = lerpN(0, EYE_SQUINT_Z, a);
        this.eyeR.rotation.z = lerpN(0, -EYE_SQUINT_Z, a);
        if (this.blinkClock >= BLINK_CLOSE_DUR) {
          this.blinkClock = 0;
          this.blinkState = 'o1';
        }
        break;
      }
      case 'o1': {
        // Open eyes back to normal.
        const a = alpha(BLINK_OPEN_DUR);
        this.eyeL.scale.y = lerpN(EYE_CLOSE_SCALE, 1, a);
        this.eyeR.scale.y = lerpN(EYE_CLOSE_SCALE, 1, a);
        this.eyeL.rotation.z = lerpN(EYE_SQUINT_Z, 0, a);
        this.eyeR.rotation.z = lerpN(-EYE_SQUINT_Z, 0, a);
        if (this.blinkClock >= BLINK_OPEN_DUR) {
          this.blinkClock = 0;
          this.blinkState = 'gap';
        }
        break;
      }
      case 'gap': {
        // Short pause between the two blinks — eyes fully open, do nothing.
        if (this.blinkClock >= BLINK_GAP_DUR) {
          this.blinkClock = 0;
          this.blinkState = 'c2';
        }
        break;
      }
      case 'c2': {
        const a = alpha(BLINK_CLOSE_DUR);
        this.eyeL.scale.y = lerpN(1, EYE_CLOSE_SCALE, a);
        this.eyeR.scale.y = lerpN(1, EYE_CLOSE_SCALE, a);
        this.eyeL.rotation.z = lerpN(0, EYE_SQUINT_Z, a);
        this.eyeR.rotation.z = lerpN(0, -EYE_SQUINT_Z, a);
        if (this.blinkClock >= BLINK_CLOSE_DUR) {
          this.blinkClock = 0;
          this.blinkState = 'o2';
        }
        break;
      }
      case 'o2': {
        const a = alpha(BLINK_OPEN_DUR);
        this.eyeL.scale.y = lerpN(EYE_CLOSE_SCALE, 1, a);
        this.eyeR.scale.y = lerpN(EYE_CLOSE_SCALE, 1, a);
        this.eyeL.rotation.z = lerpN(EYE_SQUINT_Z, 0, a);
        this.eyeR.rotation.z = lerpN(-EYE_SQUINT_Z, 0, a);
        if (this.blinkClock >= BLINK_OPEN_DUR) {
          // Reset to idle with a fresh random wait.
          this.eyeL.scale.y = 1;
          this.eyeR.scale.y = 1;
          this.eyeL.rotation.z = 0;
          this.eyeR.rotation.z = 0;
          this.blinkClock = 0;
          this.blinkState = 'idle';
          this.nextBlink = BLINK_MIN_IDLE + Math.random() * (BLINK_MAX_IDLE - BLINK_MIN_IDLE);
        }
        break;
      }
    }
  }

  // Advance the gaze state machine (camera ↔ panel).
  private updateGaze(dt: number): void {
    this.gazeClock += dt;

    switch (this.gazeState) {
      case 'camera':
        if (this.gazeClock >= this.nextGaze) {
          this.gazeClock = 0;
          this.gazeState = 'to_panel';
        }
        break;
      case 'to_panel':
        this.gazeBlend = Math.min(this.gazeClock / GAZE_TURN_DUR, 1);
        if (this.gazeClock >= GAZE_TURN_DUR) {
          this.gazeBlend = 1;
          this.gazeClock = 0;
          this.gazeState = 'panel';
        }
        break;
      case 'panel':
        if (this.gazeClock >= GAZE_PANEL_DUR) {
          this.gazeClock = 0;
          this.gazeState = 'to_camera';
        }
        break;
      case 'to_camera':
        this.gazeBlend = 1 - Math.min(this.gazeClock / GAZE_TURN_DUR, 1);
        if (this.gazeClock >= GAZE_TURN_DUR) {
          this.gazeBlend = 0;
          this.gazeClock = 0;
          this.gazeState = 'camera';
          this.nextGaze = GAZE_CAMERA_MIN + Math.random() * (GAZE_CAMERA_MAX - GAZE_CAMERA_MIN);
        }
        break;
    }
  }

  // `camera` provides position + travel direction; the Mote orbits in the camera-facing
  // plane and alternates gaze between the camera and the panel behind it.
  // `motion` (0..1) scales idle bob for reduced-motion (it still follows the camera).
  update(dt: number, elapsed: number, camera: THREE.PerspectiveCamera, motion: number): void {
    // 1. Double-blink — always fires, independent of motion preference.
    this.updateBlink(dt);

    // 2. Gaze — always runs, independent of motion preference.
    this.updateGaze(dt);

    // 3. Orbital target in the camera-facing plane.
    this.orbitAngle += ORBIT_SPEED * dt;
    camera.getWorldDirection(this.forward);

    // Camera-facing plane basis vectors (no allocation — reuse class fields).
    this.camRight.crossVectors(this.forward, this.worldUp).normalize();
    this.camUp.crossVectors(this.camRight, this.forward).normalize();

    // Orbit anchor: same depth the Mote sat at before (4.2 units ahead of camera).
    this.orbitAnchor.copy(camera.position).addScaledVector(this.forward, 4.2);

    // Orbital circle (camera-facing plane) + gentle Y-bob layered on top.
    this.target
      .copy(this.orbitAnchor)
      .addScaledVector(this.camRight, Math.cos(this.orbitAngle) * ORBIT_RADIUS)
      .addScaledVector(this.camUp,   Math.sin(this.orbitAngle) * ORBIT_RADIUS);
    this.target.y += Math.sin(elapsed * 1.4) * 0.18 * motion;

    // 4. Ease body toward the orbital target.
    this.body.position.lerp(this.target, Math.min(dt * 3.5, 1));

    // 5. Quaternion slerp for gaze (camera ↔ panel).
    //    scratchObj is never added to the scene; used only for lookAt quaternion math.
    this.scratchObj.position.copy(this.body.position);
    this.scratchObj.up.set(0, 1, 0);

    this.scratchObj.lookAt(camera.position);
    this.quatCamera.copy(this.scratchObj.quaternion);

    this.scratchObj.lookAt(this.orbitAnchor);
    this.quatPanel.copy(this.scratchObj.quaternion);

    this.body.quaternion.slerpQuaternions(this.quatCamera, this.quatPanel, this.gazeBlend);

    // 6. Trail: each dot eases toward the one ahead of it.
    let leader = this.body.position;
    for (const dot of this.trail) {
      dot.position.lerp(leader, Math.min(dt * 6, 1));
      leader = dot.position;
    }
  }

  dispose(): void {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
  }
}
