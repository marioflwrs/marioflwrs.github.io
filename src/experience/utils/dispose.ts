import * as THREE from 'three';

// Recursively dispose geometries, materials, and their textures under an object,
// then detach it from its parent. Safe to call once during teardown.
export function disposeObject(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as Partial<THREE.Mesh> & THREE.Object3D;
    const geometry = (mesh as THREE.Mesh).geometry as THREE.BufferGeometry | undefined;
    if (geometry && typeof geometry.dispose === 'function') geometry.dispose();

    const material = (mesh as THREE.Mesh).material as
      | THREE.Material
      | THREE.Material[]
      | undefined;
    if (Array.isArray(material)) material.forEach(disposeMaterial);
    else if (material) disposeMaterial(material);
  });
  root.parent?.remove(root);
}

function disposeMaterial(material: THREE.Material): void {
  const record = material as unknown as Record<string, unknown>;
  for (const value of Object.values(record)) {
    if (value && (value as THREE.Texture).isTexture) {
      (value as THREE.Texture).dispose();
    }
  }
  material.dispose();
}

// A tiny registry so subsystems can register arbitrary teardown callbacks and the
// Engine can flush them all at once (idempotent).
export class Disposer {
  private callbacks: Array<() => void> = [];

  add(cb: () => void): void {
    this.callbacks.push(cb);
  }

  flush(): void {
    for (const cb of this.callbacks.splice(0)) cb();
  }
}
