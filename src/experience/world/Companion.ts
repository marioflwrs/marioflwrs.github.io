import * as THREE from 'three';

const TRAIL_LENGTH = 6;

// The Mote: a soft glowing orb with two eyes and a short trailing wisp. It floats
// just ahead of the camera along the direction of travel, leading the journey.
export class Companion {
  readonly group = new THREE.Group();

  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];

  private readonly body: THREE.Mesh;
  private readonly trail: THREE.Mesh[] = [];

  private readonly forward = new THREE.Vector3();
  private readonly target = new THREE.Vector3();

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
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.11, 0.05, 0.28);
    eyeR.position.set(0.11, 0.05, 0.28);
    this.body.add(eyeL, eyeR);

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
  }

  // `camera` provides position + travel direction; the Mote leads slightly ahead.
  // `motion` (0..1) scales idle bob for reduced-motion (it still follows the camera).
  update(dt: number, elapsed: number, camera: THREE.PerspectiveCamera, motion: number): void {
    camera.getWorldDirection(this.forward);

    this.target.copy(camera.position);
    this.target.addScaledVector(this.forward, 4.2);
    this.target.x += this.forward.z * 1.1; // lead toward the inside of the turn
    this.target.y += Math.sin(elapsed * 1.4) * 0.18 * motion + 0.4;

    this.body.position.lerp(this.target, Math.min(dt * 3.5, 1));
    this.body.lookAt(camera.position.x, this.body.position.y, camera.position.z);

    // Trail: each dot eases toward the one ahead of it.
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
