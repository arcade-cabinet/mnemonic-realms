/**
 * Visual Renderer — Build-Time Snapshots at Every Fractal Level
 *
 * Renders collision grids, town layouts, region maps, and world overviews
 * as PNG images WITHOUT the game engine. Pure data → pixels.
 *
 * Color coding:
 *   Walkable ground  = #4a7c4f (muted green)
 *   Blocked          = #3d3d3d (dark gray)
 *   Road             = #c4a86a (tan/dirt)
 *   Reserved/clear   = #6a8c6a (lighter green)
 *   Door transition  = #4a7cc4 (blue)
 *   NPC position     = #c48a4a (orange)
 *   Entry anchor     = #4ac4c4 (cyan)
 *   Unreachable      = #c44a4a (red — test failures)
 *
 * Output: gen/assemblage/testing/snapshots/{level}/{subject}.png
 *
 * Architecture level: TESTING (visual verification)
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { CollisionGrid, Point } from '../composer/path-router';

// --- Color Palette ---

/** RGBA colors (4 bytes each) */
const COLORS = {
  walkable: [74, 124, 79, 255] as const,
  blocked: [61, 61, 61, 255] as const,
  road: [196, 168, 106, 255] as const,
  reserved: [106, 140, 106, 255] as const,
  door: [74, 124, 196, 255] as const,
  npc: [196, 138, 74, 255] as const,
  entry: [74, 196, 196, 255] as const,
  unreachable: [196, 74, 74, 255] as const,
  building: [120, 90, 70, 255] as const,
  center: [196, 196, 74, 255] as const,
} as const;

type ColorName = keyof typeof COLORS;

// --- Render Context ---

export interface RenderOverlay {
  /** Position to overlay */
  position: Point;
  /** Color name from palette */
  color: ColorName;
  /** Size in tiles (default 1) */
  size?: number;
}

export interface RenderOptions {
  /** Scale factor — each tile becomes NxN pixels (default: 2) */
  scale?: number;
  /** Additional overlays (doors, NPCs, entries, etc.) */
  overlays?: RenderOverlay[];
  /** Tiles to mark as unreachable (from traversal test failures) */
  unreachableTiles?: Point[];
  /** Title text rendered as a simple banner (optional) */
  title?: string;
}

// --- PNG Encoder (minimal, dependency-free) ---

/**
 * Encode raw RGBA pixel data as a PNG file buffer.
 *
 * Minimal implementation — just enough for snapshot output.
 * No compression library needed: uses uncompressed DEFLATE blocks.
 */
function encodePNG(width: number, height: number, pixels: Uint8Array): Uint8Array {
  // PNG structure: signature + IHDR + IDAT(s) + IEND

  // --- IHDR ---
  const ihdr = new Uint8Array(13);
  const ihdrView = new DataView(ihdr.buffer);
  ihdrView.setUint32(0, width);
  ihdrView.setUint32(4, height);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // --- IDAT: raw pixel data with filter byte per row ---
  // Each row: filter byte (0 = None) + RGBA pixels
  const rowLen = 1 + width * 4;
  const rawData = new Uint8Array(rowLen * height);
  for (let y = 0; y < height; y++) {
    rawData[y * rowLen] = 0; // filter: None
    rawData.set(pixels.subarray(y * width * 4, (y + 1) * width * 4), y * rowLen + 1);
  }

  // DEFLATE: use uncompressed blocks (store)
  const deflated = deflateStore(rawData);

  // Assemble zlib stream: CMF + FLG + data + ADLER32
  const adler = adler32(rawData);
  const zlibStream = new Uint8Array(2 + deflated.length + 4);
  zlibStream[0] = 0x78; // CMF: deflate, window 32K
  zlibStream[1] = 0x01; // FLG: check bits
  zlibStream.set(deflated, 2);
  const adlerView = new DataView(zlibStream.buffer, 2 + deflated.length, 4);
  adlerView.setUint32(0, adler);

  // --- Assemble PNG ---
  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunks = [
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', zlibStream),
    makeChunk('IEND', new Uint8Array(0)),
  ];

  const totalLen = signature.length + chunks.reduce((sum, c) => sum + c.length, 0);
  const png = new Uint8Array(totalLen);
  let offset = 0;
  png.set(signature, offset);
  offset += signature.length;
  for (const chunk of chunks) {
    png.set(chunk, offset);
    offset += chunk.length;
  }

  return png;
}

function makeChunk(type: string, data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(4 + 4 + data.length + 4);
  const view = new DataView(chunk.buffer);

  // Length
  view.setUint32(0, data.length);

  // Type
  for (let i = 0; i < 4; i++) chunk[4 + i] = type.charCodeAt(i);

  // Data
  chunk.set(data, 8);

  // CRC32 over type + data
  const crc = crc32(chunk.subarray(4, 8 + data.length));
  view.setUint32(8 + data.length, crc);

  return chunk;
}

function deflateStore(data: Uint8Array): Uint8Array {
  // Split into 65535-byte blocks (max store block size)
  const maxBlock = 65535;
  const numBlocks = Math.ceil(data.length / maxBlock) || 1;
  const out = new Uint8Array(data.length + numBlocks * 5);
  let outPos = 0;

  for (let i = 0; i < numBlocks; i++) {
    const start = i * maxBlock;
    const end = Math.min(start + maxBlock, data.length);
    const len = end - start;
    const isLast = i === numBlocks - 1;

    out[outPos++] = isLast ? 0x01 : 0x00; // BFINAL + BTYPE=00 (store)
    out[outPos++] = len & 0xff;
    out[outPos++] = (len >> 8) & 0xff;
    out[outPos++] = ~len & 0xff;
    out[outPos++] = (~len >> 8) & 0xff;
    out.set(data.subarray(start, end), outPos);
    outPos += len;
  }

  return out.subarray(0, outPos);
}

// CRC32 lookup table
const crcTable: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function adler32(data: Uint8Array): number {
  let a = 1;
  let b = 0;
  for (let i = 0; i < data.length; i++) {
    a = (a + data[i]) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

// --- Rendering Functions ---

/**
 * Render a collision grid as an RGBA pixel buffer.
 */
export function renderGrid(
  grid: CollisionGrid,
  options?: RenderOptions,
): { width: number; height: number; pixels: Uint8Array } {
  const scale = options?.scale ?? 2;
  const pxW = grid.width * scale;
  const pxH = grid.height * scale;
  const pixels = new Uint8Array(pxW * pxH * 4);

  // Base render: collision grid values → colors
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const val = grid.data[y * grid.width + x];
      let color: readonly [number, number, number, number];

      switch (val) {
        case 0:
          color = COLORS.walkable;
          break;
        case 1:
          color = COLORS.blocked;
          break;
        case 2:
          color = COLORS.road;
          break;
        case 3:
          color = COLORS.reserved;
          break;
        default:
          color = COLORS.walkable;
      }

      // Write scaled pixels
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const px = x * scale + sx;
          const py = y * scale + sy;
          const idx = (py * pxW + px) * 4;
          pixels[idx] = color[0];
          pixels[idx + 1] = color[1];
          pixels[idx + 2] = color[2];
          pixels[idx + 3] = color[3];
        }
      }
    }
  }

  // Overlays
  if (options?.overlays) {
    for (const overlay of options.overlays) {
      const size = overlay.size ?? 1;
      const color = COLORS[overlay.color];
      for (let dy = 0; dy < size; dy++) {
        for (let dx = 0; dx < size; dx++) {
          paintScaledTile(
            pixels,
            pxW,
            overlay.position.x + dx,
            overlay.position.y + dy,
            scale,
            color,
          );
        }
      }
    }
  }

  // Unreachable tiles (mark in red)
  if (options?.unreachableTiles) {
    for (const tile of options.unreachableTiles) {
      paintScaledTile(pixels, pxW, tile.x, tile.y, scale, COLORS.unreachable);
    }
  }

  return { width: pxW, height: pxH, pixels };
}

function paintScaledTile(
  pixels: Uint8Array,
  pixelWidth: number,
  tileX: number,
  tileY: number,
  scale: number,
  color: readonly [number, number, number, number],
): void {
  for (let sy = 0; sy < scale; sy++) {
    for (let sx = 0; sx < scale; sx++) {
      const px = tileX * scale + sx;
      const py = tileY * scale + sy;
      const idx = (py * pixelWidth + px) * 4;
      if (idx >= 0 && idx + 3 < pixels.length) {
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
        pixels[idx + 3] = color[3];
      }
    }
  }
}

// --- High-Level Snapshot API ---

/**
 * Render a collision grid to PNG and write to disk.
 */
export function writeSnapshot(
  grid: CollisionGrid,
  outputPath: string,
  options?: RenderOptions,
): void {
  const { width, height, pixels } = renderGrid(grid, options);
  const png = encodePNG(width, height, pixels);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, png);
}

/**
 * Render a collision grid to a PNG buffer (for test assertions).
 */
export function renderToPNG(grid: CollisionGrid, options?: RenderOptions): Uint8Array {
  const { width, height, pixels } = renderGrid(grid, options);
  return encodePNG(width, height, pixels);
}

/**
 * Get the default snapshot directory.
 */
export function snapshotDir(level: string): string {
  return join('gen', 'assemblage', 'testing', 'snapshots', level);
}

/**
 * Convenience: render and save a snapshot for a given level/subject.
 */
export function saveSnapshot(
  grid: CollisionGrid,
  level: string,
  subject: string,
  options?: RenderOptions,
): string {
  const path = join(snapshotDir(level), `${subject}.png`);
  writeSnapshot(grid, path, options);
  return path;
}

// --- ASCII Renderer (for terminal/test output) ---

/**
 * Render a collision grid as ASCII art.
 * Useful for quick terminal inspection and test output.
 *
 *   . = walkable
 *   # = blocked
 *   = = road
 *   ~ = reserved
 *   D = door
 *   N = NPC
 *   > = entry
 */
export function renderASCII(
  grid: CollisionGrid,
  overlays?: {
    doors?: Point[];
    npcs?: Point[];
    entries?: Point[];
  },
): string {
  const overlayMap = new Map<string, string>();

  if (overlays?.doors) {
    for (const p of overlays.doors) overlayMap.set(`${p.x},${p.y}`, 'D');
  }
  if (overlays?.npcs) {
    for (const p of overlays.npcs) overlayMap.set(`${p.x},${p.y}`, 'N');
  }
  if (overlays?.entries) {
    for (const p of overlays.entries) overlayMap.set(`${p.x},${p.y}`, '>');
  }

  const lines: string[] = [];
  for (let y = 0; y < grid.height; y++) {
    let line = '';
    for (let x = 0; x < grid.width; x++) {
      const key = `${x},${y}`;
      if (overlayMap.has(key)) {
        line += overlayMap.get(key);
        continue;
      }

      const val = grid.data[y * grid.width + x];
      switch (val) {
        case 0:
          line += '.';
          break;
        case 1:
          line += '#';
          break;
        case 2:
          line += '=';
          break;
        case 3:
          line += '~';
          break;
        default:
          line += '?';
      }
    }
    lines.push(line);
  }

  return lines.join('\n');
}
