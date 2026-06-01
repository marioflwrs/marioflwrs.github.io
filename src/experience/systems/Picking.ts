import * as THREE from 'three';

// Click-to-focus on project islets. Each pickable object carries
// `userData.projectIndex`. On click we raycast and dispatch a window CustomEvent
// (`skylands:project`) so the DOM overlay can react without coupling to Three.js.
export class Picking {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly canvas: HTMLCanvasElement;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly targets: THREE.Object3D[];

  constructor(
    canvas: HTMLCanvasElement,
    camera: THREE.PerspectiveCamera,
    targets: THREE.Object3D[],
  ) {
    this.canvas = canvas;
    this.camera = camera;
    this.targets = targets;
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hits = this.raycaster.intersectObjects(this.targets, true);
    if (hits.length === 0) return;

    let obj: THREE.Object3D | null = hits[0].object;
    while (obj && obj.userData.projectIndex === undefined) obj = obj.parent;
    if (!obj) return;

    window.dispatchEvent(
      new CustomEvent<number>('skylands:project', { detail: obj.userData.projectIndex as number }),
    );
  };

  dispose(): void {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
  }
}
