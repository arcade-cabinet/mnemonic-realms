import type { SemanticTile } from '../types.ts';
import {
  type NeighborContext,
  type TilesetPalette,
  resolveAutoTile,
  resolveFixedTile,
  resolveObject,
} from '../tileset/palette-builder.ts';
import type { MapCanvas } from './canvas.ts';

/**
 * Serialize a composed MapCanvas + TilesetPalette into TMX XML.
 *
 * 1. Resolves all semantic tiles to global tile IDs using the palette
 * 2. Tracks which tilesets are actually used
 * 3. Emits only used tileset references
 * 4. Generates CSV layer data, collision layer, and object groups
 */
export function serializeToTmx(
  canvas: MapCanvas,
  palette: TilesetPalette,
  mapId: string,
): string {
  // Resolve all semantic tiles to global IDs across all layers
  const resolvedLayers = new Map<string, number[]>();
  const usedTilesetIndices = new Set<number>();

  for (const layerName of canvas.layerOrder) {
    const semanticLayer = canvas.layers.get(layerName)!;
    const resolved = new Array<number>(canvas.width * canvas.height);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = y * canvas.width + x;
        const tile = semanticLayer[idx];
        const gid = resolveTile(tile, palette, canvas, layerName, x, y);
        resolved[idx] = gid;
        if (gid > 0) {
          trackUsedTileset(gid, palette, usedTilesetIndices);
        }
      }
    }

    resolvedLayers.set(layerName, resolved);
  }

  // Pre-resolve visual objects to track their tilesets
  const resolvedVisuals: { gid: number; x: number; y: number; width: number; height: number }[] = [];
  for (const vis of canvas.visuals) {
    const objDef = resolveObject(palette, vis.objectRef);
    trackUsedTileset(objDef.gid, palette, usedTilesetIndices);
    resolvedVisuals.push({
      gid: objDef.gid,
      x: vis.x * canvas.tileWidth,
      // TMX objects use bottom-left origin for gid objects
      y: vis.y * canvas.tileHeight + objDef.height,
      width: objDef.width,
      height: objDef.height,
    });
  }

  // Build TMX XML
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    `<map version="1.10" tiledversion="1.11.2" orientation="orthogonal" ` +
    `renderorder="right-down" width="${canvas.width}" height="${canvas.height}" ` +
    `tilewidth="${canvas.tileWidth}" tileheight="${canvas.tileHeight}" ` +
    `infinite="0" nextlayerid="${canvas.layerOrder.length + 2}" ` +
    `nextobjectid="${canvas.objects.length + 1}">`,
  );

  // Tileset references (only used ones)
  const sortedTilesets = [...usedTilesetIndices]
    .sort((a, b) => palette.tilesets[a].firstGid - palette.tilesets[b].firstGid);
  for (const idx of sortedTilesets) {
    const ts = palette.tilesets[idx];
    lines.push(` <tileset firstgid="${ts.firstGid}" source="${ts.tsxRelPath}"/>`);
  }

  // Tile layers
  let layerId = 1;
  for (const layerName of canvas.layerOrder) {
    const resolved = resolvedLayers.get(layerName)!;
    lines.push(` <layer id="${layerId}" name="${layerName}" width="${canvas.width}" height="${canvas.height}">`);
    lines.push('  <data encoding="csv">');
    lines.push(encodeCsv(resolved, canvas.width));
    lines.push('  </data>');
    lines.push(' </layer>');
    layerId++;
  }

  // Visual objects layer (buildings, trees, props with gids)
  if (resolvedVisuals.length > 0) {
    lines.push(` <objectgroup id="${layerId}" name="Objects">`);
    let objId = 1;
    for (const vis of resolvedVisuals) {
      lines.push(
        `  <object id="${objId}" gid="${vis.gid}" ` +
        `x="${vis.x}" y="${vis.y}" width="${vis.width}" height="${vis.height}"/>`,
      );
      objId++;
    }
    lines.push(' </objectgroup>');
    layerId++;
  }

  // Collision layer (encoded as a special tile layer with collision tile = 1)
  // RPG-JS reads collision from object groups, so we emit collision as an object layer
  if (canvas.collision.some((c) => c === 1)) {
    lines.push(` <objectgroup id="${layerId}" name="Collision">`);
    // Merge adjacent collision tiles into rectangles for efficiency
    const rects = mergeCollisionRects(canvas.collision, canvas.width, canvas.height);
    let objId = canvas.objects.length + 1;
    for (const rect of rects) {
      lines.push(
        `  <object id="${objId}" x="${rect.x * canvas.tileWidth}" ` +
        `y="${rect.y * canvas.tileHeight}" ` +
        `width="${rect.w * canvas.tileWidth}" height="${rect.h * canvas.tileHeight}"/>`,
      );
      objId++;
    }
    lines.push(' </objectgroup>');
    layerId++;
  }

  // Event object group
  if (canvas.objects.length > 0) {
    lines.push(` <objectgroup id="${layerId}" name="Events">`);
    let objId = 1;
    for (const obj of canvas.objects) {
      const props = obj.properties ?? {};
      const px = obj.x * canvas.tileWidth;
      const py = obj.y * canvas.tileHeight;
      const pw = (obj.width ?? 1) * canvas.tileWidth;
      const ph = (obj.height ?? 1) * canvas.tileHeight;

      lines.push(
        `  <object id="${objId}" name="${escapeXml(obj.name)}" ` +
        `type="${obj.type}" x="${px}" y="${py}" width="${pw}" height="${ph}">`,
      );
      if (Object.keys(props).length > 0) {
        lines.push('   <properties>');
        for (const [key, val] of Object.entries(props)) {
          const type = typeof val === 'boolean' ? 'bool' : typeof val === 'number' ? 'int' : 'string';
          lines.push(`    <property name="${escapeXml(key)}" type="${type}" value="${escapeXml(String(val))}"/>`);
        }
        lines.push('   </properties>');
      }
      lines.push('  </object>');
      objId++;
    }
    lines.push(' </objectgroup>');
  }

  lines.push('</map>');
  return lines.join('\n');
}

// --- Tile resolution ---

function resolveTile(
  tile: SemanticTile,
  palette: TilesetPalette,
  canvas: MapCanvas,
  layerName: string,
  x: number,
  y: number,
): number {
  if (tile === 0) return 0;

  const str = tile as string;

  if (str.startsWith('terrain:')) {
    const terrainName = str.slice(8);
    const neighbors = getNeighborContext(canvas, layerName, x, y, terrainName);
    return resolveAutoTile(palette, terrainName, neighbors);
  }

  if (str.startsWith('fixed:')) {
    const name = str.slice(6);
    return resolveFixedTile(palette, name);
  }

  if (str.startsWith('object:')) {
    const name = str.slice(7);
    return resolveObject(palette, name).gid;
  }

  // Raw numeric GID (for direct tile references)
  const num = Number(str);
  if (!Number.isNaN(num)) return num;

  throw new Error(`Unrecognized semantic tile format: '${str}'`);
}

function getNeighborContext(
  canvas: MapCanvas,
  layerName: string,
  x: number,
  y: number,
  terrainName: string,
): NeighborContext {
  const layer = canvas.layers.get(layerName)!;
  const expected = `terrain:${terrainName}`;

  const check = (dx: number, dy: number): boolean => {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= canvas.width || ny < 0 || ny >= canvas.height) return false;
    return layer[ny * canvas.width + nx] === expected;
  };

  return [
    check(-1, -1), check(0, -1), check(1, -1),
    check(-1, 0),                check(1, 0),
    check(-1, 1),  check(0, 1),  check(1, 1),
  ];
}

// --- Tileset tracking ---

function trackUsedTileset(gid: number, palette: TilesetPalette, used: Set<number>): void {
  // Binary search for the tileset containing this gid
  const tilesets = palette.tilesets;
  let lo = 0;
  let hi = tilesets.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const ts = tilesets[mid];
    if (gid < ts.firstGid) {
      hi = mid - 1;
    } else if (gid >= ts.firstGid + ts.tsx.tileCount) {
      lo = mid + 1;
    } else {
      used.add(mid);
      return;
    }
  }
}

// --- CSV encoding ---

function encodeCsv(data: number[], width: number): string {
  const rows: string[] = [];
  for (let y = 0; y < data.length / width; y++) {
    const start = y * width;
    const row = data.slice(start, start + width).join(',');
    // Last row has no trailing comma, others do
    rows.push(row + (start + width < data.length ? ',' : ''));
  }
  return rows.join('\n');
}

// --- Collision rectangle merging ---

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function mergeCollisionRects(
  collision: (0 | 1)[],
  width: number,
  height: number,
): Rect[] {
  // Greedy row-based rectangle merging
  const visited = new Uint8Array(collision.length);
  const rects: Rect[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (collision[idx] !== 1 || visited[idx]) continue;

      // Expand right
      let w = 1;
      while (x + w < width && collision[idx + w] === 1 && !visited[idx + w]) {
        w++;
      }

      // Expand down
      let h = 1;
      let canExpand = true;
      while (y + h < height && canExpand) {
        for (let dx = 0; dx < w; dx++) {
          const belowIdx = (y + h) * width + (x + dx);
          if (collision[belowIdx] !== 1 || visited[belowIdx]) {
            canExpand = false;
            break;
          }
        }
        if (canExpand) h++;
      }

      // Mark visited
      for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
          visited[(y + dy) * width + (x + dx)] = 1;
        }
      }

      rects.push({ x, y, w, h });
    }
  }

  return rects;
}

// --- XML escaping ---

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
