// Tracks viewport size + capped pixel ratio and notifies listeners on resize.
export class Sizes {
  width = 1;
  height = 1;
  pixelRatio = 1;

  private listeners = new Set<() => void>();
  private readonly onResize = (): void => {
    this.measure();
    for (const cb of this.listeners) cb();
  };

  constructor() {
    this.measure();
    window.addEventListener('resize', this.onResize);
  }

  get aspect(): number {
    return this.width / this.height;
  }

  measure(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // Cap DPR — retina at full ratio is the biggest cheap perf win/loss.
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  }

  on(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.listeners.clear();
  }
}
