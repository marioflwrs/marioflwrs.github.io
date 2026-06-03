import * as THREE from 'three';
import { SECTIONS } from '../config/sections';
import { clamp01 } from '../utils/math';

// Two Catmull-Rom curves threaded through the section knots: one for the camera
// position, one for the look target. Sampling both by scroll progress gives a smooth
// "flight" rather than a slideshow.
export class CameraPath {
  private readonly positionCurve: THREE.CatmullRomCurve3;
  private readonly lookCurve: THREE.CatmullRomCurve3;

  constructor(isPortrait: boolean) {
    const posKnots = SECTIONS.map((s) =>
      (isPortrait && s.cameraPortrait ? s.cameraPortrait : s.camera).clone(),
    );
    this.positionCurve = new THREE.CatmullRomCurve3(posKnots, false, 'catmullrom', 0.5);
    this.lookCurve = new THREE.CatmullRomCurve3(
      SECTIONS.map((s) => s.look.clone()),
      false,
      'catmullrom',
      0.5,
    );
  }

  getPosition(t: number, out: THREE.Vector3): THREE.Vector3 {
    return this.positionCurve.getPoint(clamp01(t), out);
  }

  getLook(t: number, out: THREE.Vector3): THREE.Vector3 {
    return this.lookCurve.getPoint(clamp01(t), out);
  }
}
