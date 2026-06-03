import * as THREE from 'three';
import { Sizes } from './Sizes';
import { Loop } from './Loop';

// Owns the renderer, scene, camera, clock, and the render loop. Generic plumbing —
// it knows nothing about Skylands content. `dispose()` tears everything down and is
// safe to call more than once (React 19 StrictMode mounts effects twice in dev).
export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly sizes: Sizes;
  readonly loop: Loop;

  private readonly offResize: () => void;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.sizes = new Sizes();

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, this.sizes.aspect, 0.1, 400);
    this.camera.position.set(0, 1.5, 9);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.loop = new Loop();
    this.offResize = this.sizes.on(this.resize);
    this.resize();
  }

  private readonly resize = (): void => {
    this.camera.fov = this.sizes.aspect < 1 ? 65 : 50;
    this.camera.aspect = this.sizes.aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
  };

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  start(): void {
    this.loop.start();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.loop.dispose();
    this.offResize();
    this.sizes.dispose();
    this.renderer.dispose();
  }
}
