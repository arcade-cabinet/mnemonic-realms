import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { XMLParser } from 'fast-xml-parser';

// --- Parsed TSX types ---

export interface ParsedTsx {
  name: string;
  tileWidth: number;
  tileHeight: number;
  tileCount: number;
  columns: number;
  /** Path to source file that was parsed */
  sourcePath: string;
  /** 'grid' = regular tile grid, 'collection' = individual images per tile */
  kind: 'grid' | 'collection';
  /** Grid tileset: single image for the whole sheet */
  image?: TsxImage;
  /** Per-tile data (animations, collision, probability, individual images) */
  tiles: Map<number, TileData>;
  /** Wang set definitions for auto-tiling */
  wangSets: WangSet[];
}

export interface TsxImage {
  source: string;
  /** Resolved absolute path to the image file */
  resolvedPath: string;
  width: number;
  height: number;
}

export interface TileData {
  id: number;
  probability?: number;
  /** Individual image (collection tilesets only) */
  image?: TsxImage;
  /** Animation frames */
  animation?: AnimationFrame[];
  /** Collision shapes */
  collision?: CollisionShape[];
}

export interface AnimationFrame {
  tileId: number;
  duration: number;
}

export interface CollisionShape {
  type: 'rectangle' | 'polygon';
  x: number;
  y: number;
  width?: number;
  height?: number;
  /** Polygon points as [x, y] pairs */
  points?: [number, number][];
}

export interface WangSet {
  name: string;
  type: 'corner' | 'edge' | 'mixed';
  colors: WangColor[];
  tiles: WangTile[];
}

export interface WangColor {
  /** 1-based index in the wangset */
  index: number;
  name: string;
  color: string;
  probability: number;
}

export interface WangTile {
  tileId: number;
  /** 8-value wangid: [top-right corner, right edge, bottom-right corner, bottom edge, bottom-left corner, left edge, top-left corner, top edge] */
  wangId: number[];
}

// --- Parser ---

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => {
    // These elements can appear multiple times under their parent
    return ['tile', 'wangset', 'wangcolor', 'wangtile', 'frame', 'object'].includes(name);
  },
});

/**
 * Parse a Tiled TSX file into structured data.
 *
 * Handles all three TSX patterns:
 * - Grid tilesets (single image, optional Wang sets for auto-tiling)
 * - Animation tilesets (grid with per-tile frame sequences)
 * - Object/collection tilesets (columns=0, individual images per tile with collision)
 */
export async function parseTsx(tsxPath: string): Promise<ParsedTsx> {
  const xml = await readFile(tsxPath, 'utf-8');
  const parsed = xmlParser.parse(xml);
  const ts = parsed.tileset;

  if (!ts) {
    throw new Error(`No <tileset> element found in ${tsxPath}`);
  }

  const tsxDir = dirname(tsxPath);
  const columns = int(ts['@_columns']);
  const kind: 'grid' | 'collection' = columns === 0 ? 'collection' : 'grid';

  const result: ParsedTsx = {
    name: ts['@_name'],
    tileWidth: int(ts['@_tilewidth']),
    tileHeight: int(ts['@_tileheight']),
    tileCount: int(ts['@_tilecount']),
    columns,
    sourcePath: tsxPath,
    kind,
    tiles: new Map(),
    wangSets: [],
  };

  // Grid tileset: single top-level <image>
  if (ts.image && !Array.isArray(ts.image)) {
    result.image = parseImage(ts.image, tsxDir);
  }

  // Parse tile elements
  const tiles: RawTile[] = toArray(ts.tile);
  for (const raw of tiles) {
    const id = int(raw['@_id']);
    const tile: TileData = { id };

    // Probability
    if (raw['@_probability'] !== undefined) {
      tile.probability = float(raw['@_probability']);
    }

    // Per-tile image (collection tilesets)
    if (raw.image) {
      tile.image = parseImage(raw.image, tsxDir);
    }

    // Animation frames
    if (raw.animation?.frame) {
      const frames: RawFrame[] = toArray(raw.animation.frame);
      tile.animation = frames.map((f) => ({
        tileId: int(f['@_tileid']),
        duration: int(f['@_duration']),
      }));
    }

    // Collision objectgroup
    if (raw.objectgroup?.object) {
      const objects: RawObject[] = toArray(raw.objectgroup.object);
      tile.collision = objects.map(parseCollisionObject);
    }

    result.tiles.set(id, tile);
  }

  // Parse Wang sets
  if (ts.wangsets?.wangset) {
    const wangsets: RawWangSet[] = toArray(ts.wangsets.wangset);
    for (const ws of wangsets) {
      const colors: WangColor[] = toArray(ws.wangcolor).map((wc, i) => ({
        index: i + 1, // wangcolors are 1-indexed
        name: wc['@_name'],
        color: wc['@_color'],
        probability: float(wc['@_probability'] ?? '1'),
      }));

      const wangTiles: WangTile[] = toArray(ws.wangtile).map((wt) => ({
        tileId: int(wt['@_tileid']),
        wangId: wt['@_wangid'].split(',').map(Number),
      }));

      result.wangSets.push({
        name: ws['@_name'],
        type: ws['@_type'] as WangSet['type'],
        colors,
        tiles: wangTiles,
      });
    }
  }

  return result;
}

/**
 * Parse all TSX files in a directory tree.
 * Returns a map of tileset name -> ParsedTsx.
 */
export async function parseTsxDirectory(dir: string): Promise<Map<string, ParsedTsx>> {
  const { glob } = await import('node:fs');
  const { promisify } = await import('node:util');
  const globP = promisify(glob);

  // Find all .tsx files recursively
  const files = await globP(resolve(dir, '**/*.tsx'));
  const results = new Map<string, ParsedTsx>();

  for (const file of files) {
    const parsed = await parseTsx(file);
    results.set(parsed.name, parsed);
  }

  return results;
}

// --- Helpers ---

function parseImage(raw: RawImage, baseDir: string): TsxImage {
  const source = raw['@_source'];
  return {
    source,
    resolvedPath: resolve(baseDir, source),
    width: int(raw['@_width']),
    height: int(raw['@_height']),
  };
}

function parseCollisionObject(raw: RawObject): CollisionShape {
  if (raw.polygon) {
    // Polygon collision
    const pointStr: string = raw.polygon['@_points'];
    const points: [number, number][] = pointStr.split(' ').map((p) => {
      const [x, y] = p.split(',').map(Number);
      return [x, y];
    });
    return {
      type: 'polygon',
      x: float(raw['@_x'] ?? '0'),
      y: float(raw['@_y'] ?? '0'),
      points,
    };
  }

  // Rectangle collision (has width/height, no child polygon)
  return {
    type: 'rectangle',
    x: float(raw['@_x'] ?? '0'),
    y: float(raw['@_y'] ?? '0'),
    width: float(raw['@_width'] ?? '0'),
    height: float(raw['@_height'] ?? '0'),
  };
}

function int(v: string | number | undefined): number {
  return typeof v === 'number' ? v : Number.parseInt(String(v), 10);
}

function float(v: string | number | undefined): number {
  return typeof v === 'number' ? v : Number.parseFloat(String(v));
}

function toArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

// --- Raw XML shape types ---

interface RawImage {
  '@_source': string;
  '@_width': string;
  '@_height': string;
}

interface RawFrame {
  '@_tileid': string;
  '@_duration': string;
}

interface RawObject {
  '@_id': string;
  '@_x'?: string;
  '@_y'?: string;
  '@_width'?: string;
  '@_height'?: string;
  polygon?: { '@_points': string };
}

interface RawTile {
  '@_id': string;
  '@_probability'?: string;
  image?: RawImage;
  animation?: { frame: RawFrame | RawFrame[] };
  objectgroup?: { object: RawObject | RawObject[] };
}

interface RawWangSet {
  '@_name': string;
  '@_type': string;
  wangcolor: RawWangColor | RawWangColor[];
  wangtile: RawWangTile | RawWangTile[];
}

interface RawWangColor {
  '@_name': string;
  '@_color': string;
  '@_probability'?: string;
}

interface RawWangTile {
  '@_tileid': string;
  '@_wangid': string;
}
