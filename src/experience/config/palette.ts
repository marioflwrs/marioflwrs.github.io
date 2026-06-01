import * as THREE from 'three';
import { clamp01, inverseLerp } from '../utils/math';
import { lerpColor } from '../utils/lerp';

// A "mood" is the full atmospheric state at a moment in the journey: sky gradient,
// fog, sun, and ambient level. Scroll progress t∈[0,1] interpolates between the
// keyframes below (dawn → midday → golden hour → dusk).
export interface Mood {
  skyTop: THREE.Color;
  skyBottom: THREE.Color;
  fog: THREE.Color;
  fogNear: number;
  fogFar: number;
  sun: THREE.Color;
  sunIntensity: number;
  sunPosition: THREE.Vector3;
  ambient: THREE.Color;
  ambientIntensity: number;
}

interface MoodStop {
  t: number;
  mood: Mood;
}

function color(hex: number): THREE.Color {
  return new THREE.Color(hex);
}

// Keyframes — keep these readable; they are the heart of the world's look.
export const MOOD_STOPS: MoodStop[] = [
  {
    t: 0.0, // Dawn — cool sky warming at the horizon
    mood: {
      skyTop: color(0x2a3a66),
      skyBottom: color(0xf4a86b),
      fog: color(0xe9b48b),
      fogNear: 18,
      fogFar: 120,
      sun: color(0xffd9a0),
      sunIntensity: 1.1,
      sunPosition: new THREE.Vector3(-30, 12, -40),
      ambient: color(0x6a7bb0),
      ambientIntensity: 0.55,
    },
  },
  {
    t: 0.34, // Midday — bright and open
    mood: {
      skyTop: color(0x4aa6e6),
      skyBottom: color(0xcfeaff),
      fog: color(0xd8eefc),
      fogNear: 24,
      fogFar: 150,
      sun: color(0xfff6e0),
      sunIntensity: 1.35,
      sunPosition: new THREE.Vector3(10, 40, -30),
      ambient: color(0xbcd6ec),
      ambientIntensity: 0.7,
    },
  },
  {
    t: 0.68, // Golden hour — saturated amber, long light
    mood: {
      skyTop: color(0x46406e),
      skyBottom: color(0xffb066),
      fog: color(0xffb273),
      fogNear: 16,
      fogFar: 110,
      sun: color(0xffb05a),
      sunIntensity: 1.4,
      sunPosition: new THREE.Vector3(36, 8, -20),
      ambient: color(0x8a6f9a),
      ambientIntensity: 0.6,
    },
  },
  {
    t: 1.0, // Dusk — indigo and first stars, lighthouse glow
    mood: {
      skyTop: color(0x10132e),
      skyBottom: color(0x6a3a7a),
      fog: color(0x3a2a55),
      fogNear: 14,
      fogFar: 95,
      sun: color(0xff8f66),
      sunIntensity: 0.7,
      sunPosition: new THREE.Vector3(28, -2, -18),
      ambient: color(0x3a3f7a),
      ambientIntensity: 0.5,
    },
  },
];

// Allocate a blank mood to use as a reusable scratch target (avoid per-frame allocs).
export function createMood(): Mood {
  return {
    skyTop: new THREE.Color(),
    skyBottom: new THREE.Color(),
    fog: new THREE.Color(),
    fogNear: 0,
    fogFar: 0,
    sun: new THREE.Color(),
    sunIntensity: 0,
    sunPosition: new THREE.Vector3(),
    ambient: new THREE.Color(),
    ambientIntensity: 0,
  };
}

// Sample the keyframes at t into `out` (in place). Colors are eased via lerpColor.
export function sampleMood(t: number, out: Mood): Mood {
  const clamped = clamp01(t);
  let a = MOOD_STOPS[0];
  let b = MOOD_STOPS[MOOD_STOPS.length - 1];
  for (let i = 0; i < MOOD_STOPS.length - 1; i++) {
    if (clamped >= MOOD_STOPS[i].t && clamped <= MOOD_STOPS[i + 1].t) {
      a = MOOD_STOPS[i];
      b = MOOD_STOPS[i + 1];
      break;
    }
  }
  const k = inverseLerp(a.t, b.t, clamped);

  out.skyTop.copy(a.mood.skyTop);
  lerpColor(out.skyTop, b.mood.skyTop, k);
  out.skyBottom.copy(a.mood.skyBottom);
  lerpColor(out.skyBottom, b.mood.skyBottom, k);
  out.fog.copy(a.mood.fog);
  lerpColor(out.fog, b.mood.fog, k);
  out.sun.copy(a.mood.sun);
  lerpColor(out.sun, b.mood.sun, k);
  out.ambient.copy(a.mood.ambient);
  lerpColor(out.ambient, b.mood.ambient, k);

  out.fogNear = a.mood.fogNear + (b.mood.fogNear - a.mood.fogNear) * k;
  out.fogFar = a.mood.fogFar + (b.mood.fogFar - a.mood.fogFar) * k;
  out.sunIntensity = a.mood.sunIntensity + (b.mood.sunIntensity - a.mood.sunIntensity) * k;
  out.ambientIntensity =
    a.mood.ambientIntensity + (b.mood.ambientIntensity - a.mood.ambientIntensity) * k;
  out.sunPosition.copy(a.mood.sunPosition).lerp(b.mood.sunPosition, k);

  return out;
}
