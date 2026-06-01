import * as THREE from 'three';
import type { Mood } from '../config/palette';

// A large back-side sphere with a vertical gradient shader. Not fog-affected, so the
// gradient always reads; the fog color is tuned to the sky bottom so the horizon blends.
export class Sky {
  readonly mesh: THREE.Mesh;
  private readonly material: THREE.ShaderMaterial;
  private readonly geometry: THREE.SphereGeometry;

  constructor() {
    this.geometry = new THREE.SphereGeometry(320, 32, 16);
    this.material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTop: { value: new THREE.Color(0x2a3a66) },
        uBottom: { value: new THREE.Color(0xf4a86b) },
        uExponent: { value: 0.75 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vWorldPosition;
        uniform vec3 uTop;
        uniform vec3 uBottom;
        uniform float uExponent;
        void main() {
          float h = normalize(vWorldPosition).y;
          float f = pow(clamp(h * 0.5 + 0.5, 0.0, 1.0), uExponent);
          gl_FragColor = vec4(mix(uBottom, uTop, f), 1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -1;
  }

  applyMood(mood: Mood): void {
    (this.material.uniforms.uTop.value as THREE.Color).copy(mood.skyTop);
    (this.material.uniforms.uBottom.value as THREE.Color).copy(mood.skyBottom);
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
