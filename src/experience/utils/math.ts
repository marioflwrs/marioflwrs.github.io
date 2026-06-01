// Small allocation-free math helpers shared across the experience.

export function clamp(x: number, min: number, max: number): number {
  return x < min ? min : x > max ? max : x;
}

export function clamp01(x: number): number {
  return clamp(x, 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function inverseLerp(a: number, b: number, x: number): number {
  return a === b ? 0 : (x - a) / (b - a);
}

export function mapRange(x: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return lerp(outMin, outMax, clamp01(inverseLerp(inMin, inMax, x)));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01(inverseLerp(edge0, edge1, x));
  return t * t * (3 - 2 * t);
}

// Frame-rate-independent damping (exponential approach). `lambda` ~ smoothing speed.
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
