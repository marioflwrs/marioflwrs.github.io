import * as THREE from 'three';

// The single source of truth for the journey. Each section owns: where its island
// sits, the camera knot the flight passes through, the look target, and an accent color.
//
// Camera knots are threaded into a CatmullRomCurve3 (see systems/CameraPath.ts) and
// sampled by the journey's curve parameter. Knots are evenly spaced in curve parameter,
// so each section's natural parameter is `sectionParam(i)` = i/(n-1).
export interface SectionDef {
  id: 'hero' | 'about' | 'projects' | 'contact';
  label: string;
  anchor: THREE.Vector3; // island center
  camera: THREE.Vector3; // camera path knot near the island
  look: THREE.Vector3; // look target at this knot
  accent: number;
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'hero',
    label: 'Intro',
    anchor: new THREE.Vector3(0, 0, 0),
    camera: new THREE.Vector3(0, 1.6, 9),
    look: new THREE.Vector3(0, 0.4, 0),
    accent: 0xffd9a0,
  },
  {
    id: 'about',
    label: 'About',
    anchor: new THREE.Vector3(-7, -1.5, -24),
    camera: new THREE.Vector3(-3.5, 1.2, -14),
    look: new THREE.Vector3(-7, -1.0, -24),
    accent: 0x8fd4ff,
  },
  {
    id: 'projects',
    label: 'Projects',
    anchor: new THREE.Vector3(7, 1.5, -48),
    camera: new THREE.Vector3(2.5, 3.0, -36),
    look: new THREE.Vector3(7, 1.0, -49),
    accent: 0xffb066,
  },
  {
    id: 'contact',
    label: 'Contact',
    anchor: new THREE.Vector3(-3, -1, -72),
    camera: new THREE.Vector3(-2.5, 1.4, -60),
    look: new THREE.Vector3(-3, -0.3, -73),
    accent: 0xc9a0ff,
  },
];

// The curve parameter at which section `i` sits. Knots are evenly spaced, so a section's
// resting `t` is i/(n-1): {0, ⅓, ⅔, 1} for four sections.
export function sectionParam(index: number): number {
  return SECTIONS.length <= 1 ? 0 : index / (SECTIONS.length - 1);
}
