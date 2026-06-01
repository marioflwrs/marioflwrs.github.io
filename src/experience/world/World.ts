import * as THREE from 'three';
import { Sky } from './Sky';
import { Islands } from './Islands';
import { Companion } from './Companion';
import { Particles } from './Particles';
import { createMood, sampleMood, type Mood } from '../config/palette';

// Assembles and owns every world entity (sky, islands, companion, particles) plus the
// scene lighting and fog. `update` samples the mood for the current scroll progress and
// fans it out to all atmosphere-driven pieces. Reuses a single scratch Mood — no
// per-frame allocations.
export class World {
  readonly sky = new Sky();
  readonly islands = new Islands();
  readonly companion = new Companion();
  readonly particles = new Particles();

  private readonly ambient: THREE.AmbientLight;
  private readonly sun: THREE.DirectionalLight;
  private readonly fog: THREE.Fog;
  private readonly mood: Mood = createMood();
  private readonly scene: THREE.Scene;
  private readonly motion: number;

  private elapsed = 0;

  constructor(scene: THREE.Scene, reduceMotion = false) {
    this.scene = scene;
    this.motion = reduceMotion ? 0 : 1;
    this.ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.sun = new THREE.DirectionalLight(0xffffff, 1.2);

    this.fog = new THREE.Fog(0xe9b48b, 18, 120);
    this.scene.fog = this.fog;

    this.scene.add(
      this.sky.mesh,
      this.islands.group,
      this.companion.group,
      this.particles.points,
      this.ambient,
      this.sun,
    );

    // Seed the atmosphere at the start of the journey.
    this.applyMood(0);
  }

  get pickTargets(): THREE.Object3D[] {
    return this.islands.pickTargets;
  }

  private applyMood(t: number): void {
    const mood = sampleMood(t, this.mood);

    this.sky.applyMood(mood);

    this.fog.color.copy(mood.fog);
    this.fog.near = mood.fogNear;
    this.fog.far = mood.fogFar;

    this.ambient.color.copy(mood.ambient);
    this.ambient.intensity = mood.ambientIntensity;

    this.sun.color.copy(mood.sun);
    this.sun.intensity = mood.sunIntensity;
    this.sun.position.copy(mood.sunPosition);
  }

  update(dt: number, t: number, camera: THREE.PerspectiveCamera): void {
    this.elapsed += dt * this.motion;
    this.applyMood(t);
    this.islands.update(dt, this.elapsed, this.motion);
    this.companion.update(dt, this.elapsed, camera, this.motion);
    this.particles.update(dt, this.mood, t, this.motion);
  }

  dispose(): void {
    this.scene.fog = null;
    this.scene.remove(
      this.sky.mesh,
      this.islands.group,
      this.companion.group,
      this.particles.points,
      this.ambient,
      this.sun,
    );
    this.sky.dispose();
    this.islands.dispose();
    this.companion.dispose();
    this.particles.dispose();
    this.ambient.dispose();
    this.sun.dispose();
  }
}
