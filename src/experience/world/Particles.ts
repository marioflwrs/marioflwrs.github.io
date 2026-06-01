import * as THREE from 'three';
import type { Mood } from '../config/palette';

const PARTICLE_COUNT = 260;
const FIELD = new THREE.Vector3(60, 30, 110);

// Soft drifting motes (pollen by day, fireflies at dusk). One THREE.Points cloud
// spanning the journey volume; positions loop, color/opacity follow the mood.
export class Particles {
  readonly points: THREE.Points;

  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.PointsMaterial;
  private readonly velocities: Float32Array;
  private readonly positions: Float32Array;

  constructor() {
    this.positions = new Float32Array(PARTICLE_COUNT * 3);
    this.velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      this.positions[i3] = (Math.random() - 0.5) * FIELD.x;
      this.positions[i3 + 1] = (Math.random() - 0.5) * FIELD.y;
      this.positions[i3 + 2] = -Math.random() * FIELD.z + 10;
      this.velocities[i3] = (Math.random() - 0.5) * 0.3;
      this.velocities[i3 + 1] = 0.2 + Math.random() * 0.4;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    this.material = new THREE.PointsMaterial({
      color: 0xfff0c0,
      size: 0.14,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  update(dt: number, mood: Mood, moodT: number, motion: number): void {
    const hx = FIELD.x * 0.5;
    const hy = FIELD.y * 0.5;
    const step = dt * motion;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      this.positions[i3] += this.velocities[i3] * step;
      this.positions[i3 + 1] += this.velocities[i3 + 1] * step;
      this.positions[i3 + 2] += this.velocities[i3 + 2] * step;
      // Wrap on every axis so the cloud stays inside FIELD over long sessions.
      if (this.positions[i3] > hx) this.positions[i3] = -hx;
      else if (this.positions[i3] < -hx) this.positions[i3] = hx;
      if (this.positions[i3 + 1] > hy) this.positions[i3 + 1] = -hy;
      if (this.positions[i3 + 2] > 10) this.positions[i3 + 2] = 10 - FIELD.z;
      else if (this.positions[i3 + 2] < 10 - FIELD.z) this.positions[i3 + 2] = 10;
    }
    this.geometry.attributes.position.needsUpdate = true;

    // Warm pollen by day → brighter firefly glow at dusk.
    this.material.color.copy(mood.sun);
    this.material.opacity = 0.5 + moodT * 0.4;
    this.material.size = 0.12 + moodT * 0.08;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
