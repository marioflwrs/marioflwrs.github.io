import * as THREE from 'three';
import { CameraPath } from './CameraPath';

// Bridges scroll progress to the camera: positions it on the path and aims it at the
// look curve. Pure mapping — the caller smooths `t` before passing it in.
export class ScrollRig {
  private readonly path = new CameraPath();
  private readonly position = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    // Seed at t=0 so the first frame is framed correctly.
    this.update(0);
  }

  update(t: number): void {
    this.path.getPosition(t, this.position);
    this.path.getLook(t, this.look);
    this.camera.position.copy(this.position);
    this.camera.lookAt(this.look);
  }
}
