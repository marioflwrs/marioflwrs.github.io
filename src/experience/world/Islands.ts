import * as THREE from 'three';
import { SECTIONS } from '../config/sections';

const PROJECT_ISLET_COUNT = 3;
const TREES_PER_ISLAND = 4;

// Per-section island palettes (indexed by sectionIndex % ISLAND_PALETTES.length).
// Dawn → Midday → Golden Hour → Dusk — mirrors the time-of-day scroll ramp.
interface IslandPalette {
  grass: number;
  rock: number;
}
const ISLAND_PALETTES: IslandPalette[] = [
  { grass: 0x7ec850, rock: 0x8a7050 }, // hero      (dawn)        — warm green / sandy
  { grass: 0x90d965, rock: 0x7090a0 }, // about     (midday)      — bright green / blue-grey slate
  { grass: 0xa0c84a, rock: 0xa06040 }, // projects  (golden hour) — amber-green / terracotta
  { grass: 0x6a8f5e, rock: 0x6a5a7a }, // contact   (dusk)        — muted sage / cool purple-grey
];

// Per-island float / tilt data.
interface IslandData {
  group: THREE.Group;
  phase: number;
  baseY: number; // anchor y — preserved so the animation offset adds to it rather than replacing it
}

// Deterministic pseudo-random so the layout is stable between reloads.
function rng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Builds the floating islands for every section (plus a small archipelago of project
// islets), with instanced low-poly trees shared across all islands. Each island has
// its own palette-tinted materials and an independent float/tilt phase.
// The whole group also bobs as one so the instanced (world-space) trees stay close
// to their islands; per-island tilt amplitude is kept small for the same reason.
export class Islands {
  readonly group = new THREE.Group();
  readonly pickTargets: THREE.Object3D[] = [];

  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: THREE.Material[] = [];
  private readonly treeMatrix = new THREE.Matrix4();
  private readonly treePos = new THREE.Vector3();
  private readonly treeQuat = new THREE.Quaternion();
  private readonly treeScale = new THREE.Vector3();

  // Per-island independent float/tilt state.
  private readonly islandData: Array<IslandData> = [];

  private trunkMesh!: THREE.InstancedMesh;
  private canopyMesh!: THREE.InstancedMesh;

  private trunkMat!: THREE.MeshStandardMaterial;
  private canopyMat!: THREE.MeshStandardMaterial;

  constructor() {
    this.buildSharedMaterials();
    this.buildInstancedTrees();

    const treeSlots: Array<{ position: THREE.Vector3; scale: number }> = [];

    SECTIONS.forEach((section, index) => {
      const palette = ISLAND_PALETTES[index % ISLAND_PALETTES.length];
      if (section.id === 'projects') {
        this.buildArchipelago(section.anchor, index, palette, treeSlots);
      } else {
        const radius = section.id === 'hero' ? 3.0 : 2.4;
        const island = this.buildIsland(radius, index * 97 + 13, palette);
        island.position.copy(section.anchor);
        this.group.add(island);
        this.islandData.push({ group: island, phase: Math.random() * Math.PI * 2, baseY: island.position.y });
        this.scatterTrees(island, radius, index * 53 + 7, treeSlots);
      }
    });

    this.applyTreeInstances(treeSlots);
  }

  // Builds trunk and canopy materials (shared across all islands).
  // Grass and rock materials are per-island — created in buildIsland().
  private buildSharedMaterials(): void {
    this.trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4326, flatShading: true, roughness: 1 });
    this.canopyMat = new THREE.MeshStandardMaterial({ color: 0x4f9d3a, flatShading: true, roughness: 0.85 });
    this.materials.push(this.trunkMat, this.canopyMat);
  }

  private buildIsland(radius: number, seed: number, palette: IslandPalette): THREE.Group {
    const group = new THREE.Group();
    const random = rng(seed);

    // Per-island materials — pushed to this.materials for disposal.
    const grassMat = new THREE.MeshStandardMaterial({ color: palette.grass, flatShading: true, roughness: 0.9 });
    const rockMat  = new THREE.MeshStandardMaterial({ color: palette.rock,  flatShading: true, roughness: 1   });
    this.materials.push(grassMat, rockMat);

    const grassGeo = new THREE.CylinderGeometry(radius, radius * 0.92, 0.7, 9);
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y = 0;
    this.geometries.push(grassGeo);

    const rockGeo = new THREE.ConeGeometry(radius * 0.95, 2.4 + random() * 1.2, 9);
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.y = -1.5;
    rock.rotation.y = random() * Math.PI;
    this.geometries.push(rockGeo);

    group.add(grass, rock);
    return group;
  }

  private buildArchipelago(
    anchor: THREE.Vector3,
    sectionIndex: number,
    palette: IslandPalette,
    treeSlots: Array<{ position: THREE.Vector3; scale: number }>,
  ): void {
    const random = rng(sectionIndex * 131 + 29);
    for (let i = 0; i < PROJECT_ISLET_COUNT; i++) {
      const radius = 1.4 + random() * 0.5;
      const islet = this.buildIsland(radius, sectionIndex * 200 + i * 17, palette);
      const angle = (i / PROJECT_ISLET_COUNT) * Math.PI * 2;
      const spread = 4.5;
      islet.position.set(
        anchor.x + Math.cos(angle) * spread,
        anchor.y + (random() - 0.5) * 2.2,
        anchor.z + Math.sin(angle) * spread * 0.6,
      );
      islet.userData.projectIndex = i;
      this.pickTargets.push(islet);
      this.group.add(islet);
      this.islandData.push({ group: islet, phase: Math.random() * Math.PI * 2, baseY: islet.position.y });
      this.scatterTrees(islet, radius, sectionIndex * 311 + i * 19, treeSlots);
    }
  }

  private scatterTrees(
    island: THREE.Group,
    radius: number,
    seed: number,
    treeSlots: Array<{ position: THREE.Vector3; scale: number }>,
  ): void {
    const random = rng(seed);
    for (let i = 0; i < TREES_PER_ISLAND; i++) {
      const a = random() * Math.PI * 2;
      const r = Math.sqrt(random()) * radius * 0.7;
      const local = new THREE.Vector3(Math.cos(a) * r, 0.35, Math.sin(a) * r);
      local.add(island.position);
      treeSlots.push({ position: local, scale: 0.7 + random() * 0.6 });
    }
  }

  private buildInstancedTrees(): void {
    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.7, 5);
    trunkGeo.translate(0, 0.35, 0);
    const canopyGeo = new THREE.ConeGeometry(0.5, 1.1, 6);
    canopyGeo.translate(0, 1.15, 0);
    this.geometries.push(trunkGeo, canopyGeo);
    // Capacity is filled in applyTreeInstances; sized generously here.
    const capacity = SECTIONS.length * (TREES_PER_ISLAND + PROJECT_ISLET_COUNT * TREES_PER_ISLAND);
    this.trunkMesh = new THREE.InstancedMesh(trunkGeo, this.trunkMat, capacity);
    this.canopyMesh = new THREE.InstancedMesh(canopyGeo, this.canopyMat, capacity);
    this.trunkMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    this.canopyMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    this.group.add(this.trunkMesh, this.canopyMesh);
  }

  private applyTreeInstances(treeSlots: Array<{ position: THREE.Vector3; scale: number }>): void {
    const count = Math.min(treeSlots.length, this.trunkMesh.count);
    for (let i = 0; i < count; i++) {
      const slot = treeSlots[i];
      this.treePos.copy(slot.position);
      this.treeQuat.identity();
      this.treeScale.setScalar(slot.scale);
      this.treeMatrix.compose(this.treePos, this.treeQuat, this.treeScale);
      this.trunkMesh.setMatrixAt(i, this.treeMatrix);
      this.canopyMesh.setMatrixAt(i, this.treeMatrix);
    }
    this.trunkMesh.count = count;
    this.canopyMesh.count = count;
    this.trunkMesh.instanceMatrix.needsUpdate = true;
    this.canopyMesh.instanceMatrix.needsUpdate = true;
  }

  // The whole group bobs gently as one unit so instanced (world-space) trees stay
  // close to their islands. Each island also has an independent float + gentle tilt
  // driven by its own phase offset. Amplitudes are intentionally small so the
  // world-space instanced trees do not visibly detach from the tops.
  // `motion` (0..1) scales idle animation for reduced-motion.
  update(_dt: number, elapsed: number, motion: number): void {
    // Group-level bob (keeps instanced trees roughly in sync).
    this.group.position.y = Math.sin(elapsed * 0.45) * 0.22 * motion;

    // Per-island independent float — rotation removed to prevent instanced trees
    // (placed in world space) from visibly detaching when the island surface tilts.
    for (const { group, phase, baseY } of this.islandData) {
      group.position.y = baseY + Math.sin(elapsed * 0.62 + phase) * 0.06 * motion;
    }
  }

  dispose(): void {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
    this.trunkMesh.dispose();
    this.canopyMesh.dispose();
  }
}
