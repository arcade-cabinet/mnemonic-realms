/**
 * TMX Reference Map Parser
 *
 * Parses professional reference TMX maps (Farm Shore, Village Bridge,
 * WeaponSeller_1, House_1, etc.) into structured archetype data.
 *
 * These reference maps ship with the premium tileset packs and represent
 * professionally-composed layouts. The parser extracts their structure so
 * the composer can use them as building blocks — atoms and molecules in
 * our compositional hierarchy.
 *
 * Architecture level: QUARKS → ATOMS
 * Input: raw TMX XML
 * Output: ParsedTmx with layers, objects, tilesets, dimensions
 */
import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { XMLParser } from 'fast-xml-parser';

// --- Parsed TMX types ---

export interface ParsedTmx {
  /** Source file path */
  sourcePath: string;
  /** Map dimensions in tiles */
  width: number;
  height: number;
  /** Tile dimensions in pixels */
  tileWidth: number;
  tileHeight: number;
  /** Referenced tilesets with their firstgid offsets */
  tilesets: TmxTilesetRef[];
  /** Tile layers (Ground, Road, Walls, etc.) */
  layers: TmxLayer[];
  /** Object groups (Windows, Objects, Carpets, etc.) */
  objectGroups: TmxObjectGroup[];
}

export interface TmxTilesetRef {
  /** First global tile ID for this tileset */
  firstGid: number;
  /** TSX file path (relative to TMX) */
  source: string;
  /** Resolved absolute path */
  resolvedPath: string;
  /** Tileset name extracted from filename */
  name: string;
}

export interface TmxLayer {
  /** Layer ID */
  id: number;
  /** Layer name (e.g., 'Ground', 'Road', 'Walls') */
  name: string;
  /** Tile data as flat array of GIDs. 0 = empty. */
  data: number[];
  /** Layer dimensions (usually same as map) */
  width: number;
  height: number;
}

export interface TmxObjectGroup {
  /** Group ID */
  id: number;
  /** Group name (e.g., 'Objects', 'Windows', 'Carpets') */
  name: string;
  /** Objects in this group */
  objects: TmxObject[];
}

export interface TmxObject {
  /** Object ID */
  id: number;
  /** GID referencing a tile from a tileset (for tile objects) */
  gid?: number;
  /** Position in pixels */
  x: number;
  y: number;
  /** Size in pixels */
  width?: number;
  height?: number;
  /** Object name (if set) */
  name?: string;
  /** Object type (if set) */
  type?: string;
  /** Custom properties */
  properties?: Record<string, string | number | boolean>;
}

// --- Parser ---

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => ['tileset', 'layer', 'objectgroup', 'object', 'property'].includes(name),
});

/**
 * Parse a TMX map file into structured data.
 *
 * Handles CSV-encoded tile data (the standard for these reference maps).
 * Extracts all tile layers, object groups, and tileset references.
 */
export async function parseTmx(tmxPath: string): Promise<ParsedTmx> {
  const xml = await readFile(tmxPath, 'utf-8');
  const parsed = xmlParser.parse(xml);
  const map = parsed.map;

  if (!map) {
    throw new Error(`No <map> element found in ${tmxPath}`);
  }

  const tmxDir = dirname(tmxPath);

  // Parse tileset references
  const tilesets: TmxTilesetRef[] = toArray(map.tileset).map((ts: RawTileset) => {
    const source = ts['@_source'];
    const resolvedPath = resolve(tmxDir, source);
    const name = basename(source, '.tsx');
    return {
      firstGid: int(ts['@_firstgid']),
      source,
      resolvedPath,
      name,
    };
  });

  // Sort by firstGid for lookup
  tilesets.sort((a, b) => a.firstGid - b.firstGid);

  // Parse tile layers
  const layers: TmxLayer[] = toArray(map.layer).map((layer: RawLayer) => {
    const data = parseCSVData(layer.data);
    return {
      id: int(layer['@_id']),
      name: layer['@_name'],
      data,
      width: int(layer['@_width']),
      height: int(layer['@_height']),
    };
  });

  // Parse object groups
  const objectGroups: TmxObjectGroup[] = toArray(map.objectgroup).map((group: RawObjectGroup) => ({
    id: int(group['@_id']),
    name: group['@_name'],
    objects: toArray(group.object).map(parseObject),
  }));

  return {
    sourcePath: tmxPath,
    width: int(map['@_width']),
    height: int(map['@_height']),
    tileWidth: int(map['@_tilewidth']),
    tileHeight: int(map['@_tileheight']),
    tilesets,
    layers,
    objectGroups,
  };
}

/**
 * Resolve which tileset a GID belongs to.
 * Returns the tileset ref and the local tile ID within that tileset.
 */
export function resolveGid(
  gid: number,
  tilesets: TmxTilesetRef[],
): { tileset: TmxTilesetRef; localId: number } | null {
  if (gid === 0) return null;

  // Strip flip flags (high bits)
  const tileId = gid & 0x1fffffff;

  // Find the tileset (last one where firstGid <= tileId)
  let matched: TmxTilesetRef | null = null;
  for (const ts of tilesets) {
    if (ts.firstGid <= tileId) {
      matched = ts;
    } else {
      break;
    }
  }

  if (!matched) return null;
  return { tileset: matched, localId: tileId - matched.firstGid };
}

/**
 * Extract the bounding box of non-empty tiles in a layer.
 * Useful for finding the actual content area of a reference map.
 */
export function getLayerBounds(
  layer: TmxLayer,
): { x: number; y: number; width: number; height: number } | null {
  let minX = layer.width;
  let minY = layer.height;
  let maxX = 0;
  let maxY = 0;
  let hasContent = false;

  for (let y = 0; y < layer.height; y++) {
    for (let x = 0; x < layer.width; x++) {
      if (layer.data[y * layer.width + x] !== 0) {
        hasContent = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!hasContent) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/**
 * Count non-empty tiles in a layer.
 */
export function countTiles(layer: TmxLayer): number {
  return layer.data.filter((gid) => gid !== 0).length;
}

/**
 * Get a summary of a parsed TMX for debugging/logging.
 */
export function tmxSummary(tmx: ParsedTmx): string {
  const lines: string[] = [
    `${basename(tmx.sourcePath)} — ${tmx.width}x${tmx.height} @ ${tmx.tileWidth}px`,
    `Tilesets: ${tmx.tilesets.map((t) => t.name).join(', ')}`,
    `Layers:`,
  ];

  for (const layer of tmx.layers) {
    const tiles = countTiles(layer);
    const bounds = getLayerBounds(layer);
    lines.push(
      `  ${layer.name}: ${tiles} tiles${bounds ? ` (bounds: ${bounds.x},${bounds.y} ${bounds.width}x${bounds.height})` : ' (empty)'}`,
    );
  }

  const totalObjects = tmx.objectGroups.reduce((sum, g) => sum + g.objects.length, 0);
  lines.push(`Object groups: ${tmx.objectGroups.length} (${totalObjects} objects total)`);
  for (const group of tmx.objectGroups) {
    lines.push(`  ${group.name}: ${group.objects.length} objects`);
  }

  return lines.join('\n');
}

// --- Helpers ---

function parseCSVData(raw: string | { '#text': string }): number[] {
  const csv = typeof raw === 'string' ? raw : raw['#text'];
  return csv
    .trim()
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number);
}

function parseObject(raw: RawObject): TmxObject {
  const obj: TmxObject = {
    id: int(raw['@_id']),
    x: float(raw['@_x']),
    y: float(raw['@_y']),
  };

  if (raw['@_gid'] !== undefined) obj.gid = int(raw['@_gid']);
  if (raw['@_width'] !== undefined) obj.width = float(raw['@_width']);
  if (raw['@_height'] !== undefined) obj.height = float(raw['@_height']);
  if (raw['@_name'] !== undefined) obj.name = raw['@_name'];
  if (raw['@_type'] !== undefined) obj.type = raw['@_type'];

  // Parse custom properties
  if (raw.properties?.property) {
    obj.properties = {};
    for (const prop of toArray(raw.properties.property)) {
      const name = prop['@_name'];
      const type = prop['@_type'] || 'string';
      const value = prop['@_value'] ?? prop['#text'] ?? '';
      if (type === 'bool') {
        obj.properties[name] = value === 'true';
      } else if (type === 'int' || type === 'float') {
        obj.properties[name] = Number(value);
      } else {
        obj.properties[name] = String(value);
      }
    }
  }

  return obj;
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

// --- Raw XML types ---

interface RawTileset {
  '@_firstgid': string;
  '@_source': string;
}

interface RawLayer {
  '@_id': string;
  '@_name': string;
  '@_width': string;
  '@_height': string;
  data: string | { '#text': string };
}

interface RawObjectGroup {
  '@_id': string;
  '@_name': string;
  object?: RawObject | RawObject[];
}

interface RawObject {
  '@_id': string;
  '@_gid'?: string;
  '@_x': string;
  '@_y': string;
  '@_width'?: string;
  '@_height'?: string;
  '@_name'?: string;
  '@_type'?: string;
  properties?: { property: RawProperty | RawProperty[] };
}

interface RawProperty {
  '@_name': string;
  '@_type'?: string;
  '@_value'?: string;
  '#text'?: string;
}
