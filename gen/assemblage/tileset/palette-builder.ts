import { resolve } from 'node:path';
import { type ParsedTsx, type WangSet, type WangTile, parseTsx } from './tsx-parser.ts';

// --- Palette types ---

/**
 * A TilesetPalette maps semantic tile names to actual tile IDs,
 * with auto-tiling support via Wang sets.
 *
 * Used by the map canvas to resolve semantic tiles into TMX tile data.
 */
export interface TilesetPalette {
  /** Human-readable palette name (e.g., 'village-premium') */
  name: string;
  /** Loaded tilesets with firstgid assignments */
  tilesets: PaletteTileset[];
  /** Semantic name → terrain mapping for auto-tiling */
  terrains: Map<string, TerrainDef>;
  /** Semantic name → fixed tile ID for non-auto-tiled tiles */
  fixedTiles: Map<string, number>;
  /** Object name → tile ID for object collection tilesets */
  objects: Map<string, ObjectDef>;
}

export interface PaletteTileset {
  /** firstgid in TMX (1-based, auto-assigned during palette building) */
  firstGid: number;
  /** Parsed TSX data */
  tsx: ParsedTsx;
  /** Relative path from TMX output dir to TSX file */
  tsxRelPath: string;
}

export interface TerrainDef {
  /** Which palette tileset this terrain belongs to */
  tileset: PaletteTileset;
  /** Wang set within the tileset */
  wangSet: WangSet;
  /** Wang color index (1-based) for this terrain */
  colorIndex: number;
  /** Wang color name (from TSX) */
  colorName: string;
}

export interface ObjectDef {
  /** Global tile ID (firstgid + local id) */
  gid: number;
  /** Tile width in pixels */
  width: number;
  /** Tile height in pixels */
  height: number;
  /** Source image path */
  imagePath: string;
  /** Has collision data? */
  hasCollision: boolean;
}

// --- Palette builder ---

export interface PaletteSpec {
  /** Palette name */
  name: string;
  /** Base directory for TSX file paths */
  tsxBaseDir: string;
  /** TSX files to include, in order. Paths relative to tsxBaseDir. */
  tsxFiles: string[];
  /**
   * Relative path from where the TMX will be output to the TSX base dir.
   * Used for the TSX source references in generated TMX files.
   * Example: '../../../assets/tilesets/exteriors/premium/Tiled/Tilesets'
   */
  tmxToTsxRelDir: string;
  /**
   * Semantic terrain mappings.
   * Key: semantic name (e.g., 'ground.grass')
   * Value: { tilesetName, wangSetName, colorName }
   */
  terrains: Record<string, { tilesetName: string; wangSetName: string; colorName: string }>;
  /**
   * Fixed tile mappings (non-auto-tiled).
   * Key: semantic name
   * Value: { tilesetName, localTileId }
   */
  fixed?: Record<string, { tilesetName: string; localTileId: number }>;
  /**
   * Object mappings from object collection tilesets.
   * Key: semantic name (e.g., 'building.house-red')
   * Value: { tilesetName, localTileId }
   */
  objects?: Record<string, { tilesetName: string; localTileId: number }>;
}

/**
 * Build a TilesetPalette from a spec.
 * Parses all referenced TSX files, assigns firstgids, and resolves mappings.
 */
export async function buildPalette(spec: PaletteSpec): Promise<TilesetPalette> {
  // Parse all TSX files and assign firstgids
  const tilesets: PaletteTileset[] = [];
  const tilesetsByName = new Map<string, PaletteTileset>();
  let nextGid = 1;

  for (const tsxFile of spec.tsxFiles) {
    const fullPath = resolve(spec.tsxBaseDir, tsxFile);
    const tsx = await parseTsx(fullPath);
    const entry: PaletteTileset = {
      firstGid: nextGid,
      tsx,
      tsxRelPath: spec.tmxToTsxRelDir + '/' + tsxFile,
    };
    tilesets.push(entry);
    tilesetsByName.set(tsx.name, entry);
    nextGid += tsx.tileCount;
  }

  // Resolve terrain mappings
  const terrains = new Map<string, TerrainDef>();
  for (const [semantic, ref] of Object.entries(spec.terrains)) {
    const ts = tilesetsByName.get(ref.tilesetName);
    if (!ts) {
      throw new Error(
        `Palette '${spec.name}': terrain '${semantic}' references unknown tileset '${ref.tilesetName}'`,
      );
    }
    const wangSet = ts.tsx.wangSets.find((ws) => ws.name === ref.wangSetName);
    if (!wangSet) {
      throw new Error(
        `Palette '${spec.name}': terrain '${semantic}' references unknown wang set '${ref.wangSetName}' in tileset '${ref.tilesetName}'`,
      );
    }
    const color = wangSet.colors.find((c) => c.name === ref.colorName);
    if (!color) {
      throw new Error(
        `Palette '${spec.name}': terrain '${semantic}' references unknown color '${ref.colorName}' in wang set '${ref.wangSetName}'`,
      );
    }
    terrains.set(semantic, {
      tileset: ts,
      wangSet,
      colorIndex: color.index,
      colorName: color.name,
    });
  }

  // Resolve fixed tile mappings
  const fixedTiles = new Map<string, number>();
  if (spec.fixed) {
    for (const [semantic, ref] of Object.entries(spec.fixed)) {
      const ts = tilesetsByName.get(ref.tilesetName);
      if (!ts) {
        throw new Error(
          `Palette '${spec.name}': fixed tile '${semantic}' references unknown tileset '${ref.tilesetName}'`,
        );
      }
      fixedTiles.set(semantic, ts.firstGid + ref.localTileId);
    }
  }

  // Resolve object mappings
  const objects = new Map<string, ObjectDef>();
  if (spec.objects) {
    for (const [semantic, ref] of Object.entries(spec.objects)) {
      const ts = tilesetsByName.get(ref.tilesetName);
      if (!ts) {
        throw new Error(
          `Palette '${spec.name}': object '${semantic}' references unknown tileset '${ref.tilesetName}'`,
        );
      }
      const tileData = ts.tsx.tiles.get(ref.localTileId);
      objects.set(semantic, {
        gid: ts.firstGid + ref.localTileId,
        width: tileData?.image?.width ?? ts.tsx.tileWidth,
        height: tileData?.image?.height ?? ts.tsx.tileHeight,
        imagePath: tileData?.image?.source ?? '',
        hasCollision: (tileData?.collision?.length ?? 0) > 0,
      });
    }
  }

  return { name: spec.name, tilesets, terrains, fixedTiles, objects };
}

// --- Auto-tile resolver ---

/**
 * 8-neighbor context for auto-tiling.
 * Each value is true if the neighbor shares the same terrain type.
 * Order: top-left, top, top-right, left, right, bottom-left, bottom, bottom-right
 */
export type NeighborContext = [
  boolean, boolean, boolean,
  boolean,         boolean,
  boolean, boolean, boolean,
];

/**
 * Resolve the correct global tile ID for a terrain at a position,
 * given its neighboring terrain context.
 *
 * For Wang "mixed" sets, the wangid encodes both corners and edges:
 * Position order in wangid: [TR-corner, R-edge, BR-corner, B-edge, BL-corner, L-edge, TL-corner, T-edge]
 * Value = colorIndex if same terrain, 0 if different.
 */
export function resolveAutoTile(
  palette: TilesetPalette,
  terrainName: string,
  neighbors: NeighborContext,
): number {
  const terrain = palette.terrains.get(terrainName);
  if (!terrain) {
    throw new Error(`Unknown terrain '${terrainName}' in palette '${palette.name}'`);
  }

  const c = terrain.colorIndex;

  // Map NeighborContext [TL, T, TR, L, R, BL, B, BR] to wangid positions
  // Wangid order: [TR-corner, R-edge, BR-corner, B-edge, BL-corner, L-edge, TL-corner, T-edge]
  const [tl, t, tr, l, r, bl, b, br] = neighbors;

  // Corners only count if both adjacent edges are same terrain
  const wangId = [
    t && r && tr ? c : 0, // TR corner
    r ? c : 0,            // R edge
    b && r && br ? c : 0, // BR corner
    b ? c : 0,            // B edge
    b && l && bl ? c : 0, // BL corner
    l ? c : 0,            // L edge
    t && l && tl ? c : 0, // TL corner
    t ? c : 0,            // T edge
  ];

  // Find matching wangtile
  const match = terrain.wangSet.tiles.find((wt) => wangIdEquals(wt.wangId, wangId));

  if (match) {
    return terrain.tileset.firstGid + match.tileId;
  }

  // Fallback: find the "center" tile (all neighbors same terrain)
  const fullWangId = [c, c, c, c, c, c, c, c];
  const fallback = terrain.wangSet.tiles.find((wt) => wangIdEquals(wt.wangId, fullWangId));
  if (fallback) {
    return terrain.tileset.firstGid + fallback.tileId;
  }

  // Last resort: first wangtile for this color
  const anyTile = terrain.wangSet.tiles.find((wt) =>
    wt.wangId.some((v) => v === c),
  );
  return anyTile
    ? terrain.tileset.firstGid + anyTile.tileId
    : terrain.tileset.firstGid;
}

/**
 * Resolve a fixed (non-auto-tiled) semantic tile to its global ID.
 */
export function resolveFixedTile(
  palette: TilesetPalette,
  name: string,
): number {
  const gid = palette.fixedTiles.get(name);
  if (gid === undefined) {
    throw new Error(`Unknown fixed tile '${name}' in palette '${palette.name}'`);
  }
  return gid;
}

/**
 * Resolve an object tile to its ObjectDef.
 */
export function resolveObject(
  palette: TilesetPalette,
  name: string,
): ObjectDef {
  const obj = palette.objects.get(name);
  if (!obj) {
    throw new Error(`Unknown object '${name}' in palette '${palette.name}'`);
  }
  return obj;
}

function wangIdEquals(a: number[], b: number[]): boolean {
  for (let i = 0; i < 8; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
