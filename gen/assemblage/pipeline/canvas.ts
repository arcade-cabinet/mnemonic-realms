import type {
  AssemblageDefinition,
  AssemblageObject,
  EventHook,
  MapComposition,
  PathSegment,
  PlacedAssemblage,
  SemanticTile,
} from '../types.ts';

/**
 * Multi-layer map canvas.
 *
 * Assemblages are stamped onto named layers. Transparent tiles (0) don't
 * overwrite existing tiles. Paths are drawn as terrain strips. The canvas
 * tracks collision data and objects separately from tile layers.
 *
 * After composition, the canvas is passed to the TMX serializer.
 */
export class MapCanvas {
  readonly width: number;
  readonly height: number;
  readonly tileWidth: number;
  readonly tileHeight: number;

  /** Named tile layers. Each is a flat array of SemanticTile (row-major). */
  readonly layers: Map<string, SemanticTile[]>;
  /** Layer render order (bottom to top) */
  readonly layerOrder: string[];
  /** Collision grid: 1 = blocked, 0 = passable */
  readonly collision: (0 | 1)[];
  /** All placed objects */
  readonly objects: AssemblageObject[];
  /** All event hooks */
  readonly hooks: EventHook[];

  constructor(comp: Pick<MapComposition, 'width' | 'height' | 'tileWidth' | 'tileHeight' | 'layers'>) {
    this.width = comp.width;
    this.height = comp.height;
    this.tileWidth = comp.tileWidth;
    this.tileHeight = comp.tileHeight;
    this.layerOrder = [...comp.layers];
    this.layers = new Map();
    this.collision = new Array(comp.width * comp.height).fill(0);
    this.objects = [];
    this.hooks = [];

    for (const name of comp.layers) {
      this.layers.set(name, new Array(comp.width * comp.height).fill(0));
    }
  }

  /** Fill an entire layer with a single terrain type. */
  fillLayer(layerName: string, terrain: string): void {
    const layer = this.getLayer(layerName);
    const tile: SemanticTile = `terrain:${terrain}`;
    layer.fill(tile);
  }

  /**
   * Stamp an assemblage onto the canvas at the given position.
   * Transparent tiles (0) in the assemblage don't overwrite canvas tiles.
   */
  stamp(placement: PlacedAssemblage): void {
    const { assemblage, x, y } = placement;

    // Validate bounds
    if (x < 0 || y < 0 || x + assemblage.width > this.width || y + assemblage.height > this.height) {
      throw new Error(
        `Assemblage '${assemblage.id}' at (${x},${y}) exceeds canvas bounds ` +
        `(${assemblage.width}x${assemblage.height} on ${this.width}x${this.height})`,
      );
    }

    // Stamp tile layers
    for (const [layerName, stamp] of Object.entries(assemblage.layers)) {
      const layer = this.getLayer(layerName);
      for (let row = 0; row < stamp.height; row++) {
        for (let col = 0; col < stamp.width; col++) {
          const tile = stamp.tiles[row * stamp.width + col];
          if (tile !== 0) {
            const canvasIdx = (y + row) * this.width + (x + col);
            layer[canvasIdx] = tile;
          }
        }
      }
    }

    // Stamp collision
    if (assemblage.collision) {
      const c = assemblage.collision;
      for (let row = 0; row < c.height; row++) {
        for (let col = 0; col < c.width; col++) {
          const val = c.data[row * c.width + col];
          if (val === 1) {
            const canvasIdx = (y + row) * this.width + (x + col);
            this.collision[canvasIdx] = 1;
          }
        }
      }
    }

    // Add objects (offset positions by placement)
    if (assemblage.objects) {
      for (const obj of assemblage.objects) {
        this.objects.push({
          ...obj,
          name: `${assemblage.id}_${obj.name}`,
          x: obj.x + x,
          y: obj.y + y,
        });
      }
    }

    // Add hooks (prefix object names)
    if (assemblage.hooks) {
      for (const hook of assemblage.hooks) {
        this.hooks.push({
          ...hook,
          objectName: `${assemblage.id}_${hook.objectName}`,
        });
      }
    }
  }

  /**
   * Draw a path (road, river, etc.) on the canvas.
   * Paths are drawn as terrain strips of the specified width between waypoints.
   */
  drawPath(path: PathSegment): void {
    const layer = this.getLayer(path.layer);
    const terrain: SemanticTile = `terrain:${path.terrain}`;

    for (let i = 0; i < path.points.length - 1; i++) {
      const from = path.points[i];
      const to = path.points[i + 1];
      this.drawLineSegment(layer, terrain, from, to, path.width);
    }
  }

  /** Set a single tile on a layer. */
  setTile(layerName: string, x: number, y: number, tile: SemanticTile): void {
    const layer = this.getLayer(layerName);
    layer[y * this.width + x] = tile;
  }

  /** Get a single tile from a layer. */
  getTile(layerName: string, x: number, y: number): SemanticTile {
    const layer = this.getLayer(layerName);
    return layer[y * this.width + x];
  }

  /** Set collision at a position. */
  setCollision(x: number, y: number, blocked: boolean): void {
    this.collision[y * this.width + x] = blocked ? 1 : 0;
  }

  /** Add a standalone object (not from an assemblage). */
  addObject(obj: AssemblageObject): void {
    this.objects.push(obj);
  }

  /** Add a standalone hook. */
  addHook(hook: EventHook): void {
    this.hooks.push(hook);
  }

  // --- Internal helpers ---

  private getLayer(name: string): SemanticTile[] {
    const layer = this.layers.get(name);
    if (!layer) {
      throw new Error(`Unknown layer '${name}'. Available: ${[...this.layers.keys()].join(', ')}`);
    }
    return layer;
  }

  private drawLineSegment(
    layer: SemanticTile[],
    terrain: SemanticTile,
    from: { x: number; y: number },
    to: { x: number; y: number },
    width: number,
  ): void {
    // Bresenham-style line rasterization with thickness
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    const sx = from.x < to.x ? 1 : -1;
    const sy = from.y < to.y ? 1 : -1;
    let err = dx - dy;
    let cx = from.x;
    let cy = from.y;

    const halfW = Math.floor(width / 2);

    while (true) {
      // Paint a square of tiles centered on (cx, cy)
      for (let oy = -halfW; oy < width - halfW; oy++) {
        for (let ox = -halfW; ox < width - halfW; ox++) {
          const px = cx + ox;
          const py = cy + oy;
          if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
            layer[py * this.width + px] = terrain;
          }
        }
      }

      if (cx === to.x && cy === to.y) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        cx += sx;
      }
      if (e2 < dx) {
        err += dx;
        cy += sy;
      }
    }
  }
}

/**
 * Compose a full map from a MapComposition definition.
 * Returns a populated MapCanvas ready for TMX serialization.
 */
export function composeMap(comp: MapComposition): MapCanvas {
  const canvas = new MapCanvas(comp);

  // Fill default ground
  canvas.fillLayer(comp.layers[0], comp.defaultGround);

  // Stamp assemblages in order
  for (const placement of comp.placements) {
    canvas.stamp(placement);
  }

  // Draw paths
  if (comp.paths) {
    for (const path of comp.paths) {
      canvas.drawPath(path);
    }
  }

  // Add map-level objects
  if (comp.objects) {
    for (const obj of comp.objects) {
      canvas.addObject(obj);
    }
  }

  // Add map-level hooks
  if (comp.hooks) {
    for (const hook of comp.hooks) {
      canvas.addHook(hook);
    }
  }

  return canvas;
}
