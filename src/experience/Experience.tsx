import { useEffect, useRef } from 'react';
import { Engine } from './core/Engine';
import { World } from './world/World';
import { ScrollRig } from './systems/ScrollRig';
import { Picking } from './systems/Picking';
import type { ScrollController } from './systems/ScrollController';

interface ExperienceProps {
  controller: ScrollController;
}

// React's only job in the 3D layer: mount a canvas, stand up the engine + world, and
// drive the camera from the shared ScrollController. Everything else lives in plain
// modules. Teardown is StrictMode-safe (dev double-mount): every listener/RAF/GPU
// resource is released in the effect cleanup.
export default function Experience({ controller }: ExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: Engine;
    try {
      engine = new Engine(canvas);
    } catch {
      // No WebGL — the DOM overlay still carries all content. Bail quietly.
      canvas.style.display = 'none';
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const world = new World(engine.scene, reduceMotion);
    const rig = new ScrollRig(engine.camera, engine.sizes.aspect < 1);
    const picking = new Picking(canvas, engine.camera, world.pickTargets);

    const offUpdate = engine.loop.add((dt) => {
      controller.update(dt);
      rig.update(controller.t);
      world.update(dt, controller.t, engine.camera);
      engine.render();
    });

    engine.start();

    return () => {
      offUpdate();
      picking.dispose();
      world.dispose();
      engine.dispose();
    };
  }, [controller]);

  return <canvas ref={canvasRef} className="skylands-canvas" aria-hidden="true" />;
}
