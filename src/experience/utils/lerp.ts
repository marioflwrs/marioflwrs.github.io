import * as THREE from 'three';
import { damp } from './math';

// In-place Vector3 lerp (no allocation).
export function lerpV3(out: THREE.Vector3, target: THREE.Vector3, t: number): THREE.Vector3 {
  out.x += (target.x - out.x) * t;
  out.y += (target.y - out.y) * t;
  out.z += (target.z - out.z) * t;
  return out;
}

// In-place, frame-rate-independent Vector3 damping toward a target.
export function dampV3(out: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number): THREE.Vector3 {
  out.x = damp(out.x, target.x, lambda, dt);
  out.y = damp(out.y, target.y, lambda, dt);
  out.z = damp(out.z, target.z, lambda, dt);
  return out;
}

// In-place Color lerp (no allocation).
export function lerpColor(out: THREE.Color, target: THREE.Color, t: number): THREE.Color {
  out.r += (target.r - out.r) * t;
  out.g += (target.g - out.g) * t;
  out.b += (target.b - out.b) * t;
  return out;
}
