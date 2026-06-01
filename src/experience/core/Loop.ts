export type UpdateFn = (dt: number) => void;

// A single requestAnimationFrame loop fanning a clamped delta-time to subscribers.
export class Loop {
  private rafId = 0;
  private last = 0;
  private running = false;
  private readonly callbacks = new Set<UpdateFn>();

  add(cb: UpdateFn): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private readonly tick = (now: number): void => {
    if (!this.running) return;
    // Clamp dt so a backgrounded tab doesn't produce a huge jump on return.
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    for (const cb of this.callbacks) cb(dt);
    this.rafId = requestAnimationFrame(this.tick);
  };

  dispose(): void {
    this.stop();
    this.callbacks.clear();
  }
}
