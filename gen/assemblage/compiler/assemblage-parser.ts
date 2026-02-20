/**
 * Assemblage Markdown Parser
 *
 * Reads assemblage catalog markdown files (gen/assemblage/catalog/**\/*.md)
 * and produces AssemblageDefinition objects for the pipeline.
 *
 * Supports two tile grid formats:
 * 1. Markdown tables: | terrain:ground.dirt | 0 |
 * 2. Code blocks:     ground.dirt   0
 *
 * File structure:
 *   YAML frontmatter (id, size, palette, composes?, objectRef?, variants?)
 *   ## Layers → ### layerName subsections with tile grids
 *   ## Collision → tile grid of 0/1
 *   ## Visuals → bullet list of visual objects
 *   ## Objects → bullet list of event objects
 *   ## Anchors → bullet list of anchor points
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type {
  Anchor,
  AssemblageDefinition,
  AssemblageObject,
  CollisionStamp,
  SemanticTile,
  TileStamp,
  VisualObject,
} from '../types';
import {
  type MarkdownLink,
  parseCoordinate,
  parseFrontmatterFromMarkdown,
  parseLink,
} from './table-parser';

// --- Public types ---

export interface CompositionRef {
  ref: MarkdownLink;
  at: [number, number];
}

export interface VariantDef {
  id: string;
  description: string;
}

/** Parsed assemblage with metadata beyond AssemblageDefinition */
export interface ParsedAssemblage {
  definition: AssemblageDefinition;
  /** Palette name from frontmatter */
  palette: string;
  /** Source file path */
  filePath: string;
  /** Single visual object ref for building organisms */
  objectRef?: string;
  /** Composition references (markdown links to other assemblages) */
  composes?: CompositionRef[];
  /** Color/style variants for molecules */
  variants?: VariantDef[];
}

// --- Main entry points ---

/**
 * Parse a single assemblage markdown file into a ParsedAssemblage.
 */
export function parseAssemblageFile(filePath: string): ParsedAssemblage {
  const markdown = fs.readFileSync(filePath, 'utf-8');
  return parseAssemblageMarkdown(markdown, filePath);
}

/**
 * Parse assemblage markdown content (useful for testing without filesystem).
 */
export function parseAssemblageMarkdown(
  markdown: string,
  filePath: string = '<inline>',
): ParsedAssemblage {
  const { data, body } = parseFrontmatterFromMarkdown(quoteMarkdownLinks(markdown));

  // --- Frontmatter ---
  const id = String(data.id ?? path.basename(filePath, '.md'));
  const sizeArr = data.size as [number, number] | undefined;
  const palette = String(data.palette ?? 'unknown');
  const objectRef = data.objectRef ? String(data.objectRef) : undefined;

  // Parse composes array
  const composes = parseComposesFromFrontmatter(data.composes);

  // Parse variants array
  const variants = parseVariantsFromFrontmatter(data.variants);

  // --- Extract description from first paragraph ---
  const description = extractDescription(body);

  // --- Layers ---
  const layers = parseLayers(body);

  // --- Collision ---
  const collision = parseCollisionSection(body);

  // --- Visuals ---
  const visuals = parseVisualsSection(body);

  // --- Objects ---
  const objects = parseObjectsSection(body);

  // --- Anchors ---
  const anchors = parseAnchorsSection(body);

  // --- Determine size ---
  let width = sizeArr ? sizeArr[0] : 0;
  let height = sizeArr ? sizeArr[1] : 0;

  // If frontmatter doesn't specify size, infer from largest layer
  if (width === 0 || height === 0) {
    for (const stamp of Object.values(layers)) {
      if (stamp.width > width) width = stamp.width;
      if (stamp.height > height) height = stamp.height;
    }
    if (collision) {
      if (collision.width > width) width = collision.width;
      if (collision.height > height) height = collision.height;
    }
  }

  const definition: AssemblageDefinition = {
    id,
    description,
    width,
    height,
    layers,
    ...(collision ? { collision } : {}),
    ...(visuals && visuals.length > 0 ? { visuals } : {}),
    ...(objects && objects.length > 0 ? { objects } : {}),
    ...(anchors && anchors.length > 0 ? { anchors } : {}),
  };

  return {
    definition,
    palette,
    filePath,
    ...(objectRef ? { objectRef } : {}),
    ...(composes && composes.length > 0 ? { composes } : {}),
    ...(variants && variants.length > 0 ? { variants } : {}),
  };
}

/**
 * Load all assemblage markdown files from a catalog directory.
 * Returns a Map keyed by assemblage ID.
 */
export function loadCatalog(catalogDir: string): Map<string, ParsedAssemblage> {
  const catalog = new Map<string, ParsedAssemblage>();
  const files = findMarkdownFiles(catalogDir);

  for (const filePath of files) {
    const parsed = parseAssemblageFile(filePath);
    catalog.set(parsed.definition.id, parsed);
  }

  return catalog;
}

/**
 * Recursively find all .md files in a directory.
 */
function findMarkdownFiles(dir: string): string[] {
  const results: string[] = [];

  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

// --- YAML pre-processing ---

/**
 * Quote markdown links in YAML frontmatter to prevent YAML parse errors.
 * [text](path) looks like a YAML array followed by garbage, so we wrap them in quotes.
 * Only processes the frontmatter section (between --- delimiters).
 */
function quoteMarkdownLinks(markdown: string): string {
  const trimmed = markdown.trimStart();
  if (!trimmed.startsWith('---')) return markdown;

  const endIdx = trimmed.indexOf('---', 3);
  if (endIdx < 0) return markdown;

  const frontmatter = trimmed.slice(0, endIdx + 3);
  const rest = trimmed.slice(endIdx + 3);

  // Quote any unquoted markdown link patterns: [text](path)
  const fixed = frontmatter.replace(/:\s+(\[[^\]]+\]\([^)]+\))/g, ': "$1"');

  return fixed + rest;
}

// --- Frontmatter helpers ---

function parseComposesFromFrontmatter(raw: unknown): CompositionRef[] | undefined {
  if (!Array.isArray(raw)) return undefined;

  const refs: CompositionRef[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue;
    const obj = item as Record<string, unknown>;

    // ref can be a markdown link string: [door-frame](../molecules/door-frame.md)
    const refStr = String(obj.ref ?? '');
    const link = parseLink(refStr);
    if (!link) continue;

    // at is [x, y] array
    const at = obj.at as [number, number] | undefined;
    if (!at || !Array.isArray(at) || at.length < 2) continue;

    refs.push({ ref: link, at: [at[0], at[1]] });
  }

  return refs.length > 0 ? refs : undefined;
}

function parseVariantsFromFrontmatter(raw: unknown): VariantDef[] | undefined {
  if (!Array.isArray(raw)) return undefined;

  const variants: VariantDef[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue;
    const obj = item as Record<string, unknown>;
    if (obj.id) {
      variants.push({
        id: String(obj.id),
        description: String(obj.description ?? ''),
      });
    }
  }

  return variants.length > 0 ? variants : undefined;
}

// --- Description extraction ---

function extractDescription(body: string): string {
  const lines = body.split('\n');
  const paragraphLines: string[] = [];
  let foundHeading = false;

  for (const line of lines) {
    // Skip the # title heading
    if (!foundHeading && line.match(/^#\s+/)) {
      foundHeading = true;
      continue;
    }
    if (!foundHeading) continue;

    // Skip blank lines before the first paragraph
    if (paragraphLines.length === 0 && line.trim() === '') continue;

    // Stop at the next heading or blank line after paragraph content
    if (line.match(/^#{1,6}\s+/) || (paragraphLines.length > 0 && line.trim() === '')) {
      break;
    }

    paragraphLines.push(line.trim());
  }

  return paragraphLines.join(' ').trim() || 'No description';
}

// --- Level-aware section extraction ---

/**
 * Extract content under a level-2 heading (## Heading), ignoring level-3+ headings
 * with the same name. This prevents `### objects` (a layer name) from shadowing `## Objects`.
 */
function extractLevel2Section(body: string, headingText: string): string | null {
  const normalized = headingText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
  const lines = body.split('\n');
  let capturing = false;
  const captured: string[] = [];

  for (const line of lines) {
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = hMatch[2]
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();

      if (level === 2 && text === normalized) {
        capturing = true;
        continue;
      }

      if (capturing && level <= 2) {
        break;
      }
    }

    if (capturing) {
      captured.push(line);
    }
  }

  const result = captured.join('\n').trim();
  return result || null;
}

// --- Tile grid parsing ---

/**
 * Parse a tile grid from either markdown table or code block format.
 * Returns null if no valid grid found.
 */
export function parseTileGrid(section: string): TileStamp | null {
  // Try code block format first (more specific match)
  const codeBlock = extractCodeBlock(section);
  if (codeBlock) {
    return parseTileGridFromCodeBlock(codeBlock);
  }

  // Try markdown table format
  return parseTileGridFromTable(section);
}

/**
 * Extract content between ``` markers.
 */
function extractCodeBlock(section: string): string | null {
  const match = section.match(/```\s*\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

/**
 * Parse tile grid from code block format.
 * Lines are whitespace-separated tile names.
 */
function parseTileGridFromCodeBlock(content: string): TileStamp | null {
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return null;

  const rows: SemanticTile[][] = [];
  for (const line of lines) {
    const cells = line.split(/\s+/).map(normalizeTile);
    rows.push(cells);
  }

  const width = Math.max(...rows.map((r) => r.length));
  const height = rows.length;
  const tiles: SemanticTile[] = [];

  for (const row of rows) {
    for (let col = 0; col < width; col++) {
      tiles.push(col < row.length ? row[col] : 0);
    }
  }

  return { width, height, tiles };
}

/**
 * Parse tile grid from markdown table format.
 * Tables have empty headers and pipe-delimited cells.
 */
function parseTileGridFromTable(section: string): TileStamp | null {
  const lines = section.split('\n');
  const dataRows: SemanticTile[][] = [];
  let foundSeparator = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Must be a pipe-delimited line
    if (!trimmed.startsWith('|')) continue;

    // Check if this is the separator row (|---|---|...)
    if (trimmed.match(/^\|[\s-]+(\|[\s-]+)*\|$/)) {
      foundSeparator = true;
      continue;
    }

    // Skip the header row (before separator)
    if (!foundSeparator) continue;

    // Parse data cells
    const cells = trimmed
      .split('|')
      .slice(1, -1) // Remove leading/trailing empty from split
      .map((cell) => normalizeTile(cell.trim()));

    if (cells.length > 0) {
      dataRows.push(cells);
    }
  }

  if (dataRows.length === 0) return null;

  const width = Math.max(...dataRows.map((r) => r.length));
  const height = dataRows.length;
  const tiles: SemanticTile[] = [];

  for (const row of dataRows) {
    for (let col = 0; col < width; col++) {
      tiles.push(col < row.length ? row[col] : 0);
    }
  }

  return { width, height, tiles };
}

/**
 * Normalize a tile cell value to a SemanticTile.
 * - '0' or empty → 0
 * - Already prefixed (terrain:, object:, fixed:) → pass through
 * - Bare name → pass through (palette resolves it)
 */
function normalizeTile(cell: string): SemanticTile {
  const trimmed = cell.trim();
  if (trimmed === '0' || trimmed === '') return 0;
  return trimmed;
}

// --- Layer parsing ---

/**
 * Parse all layers from the ## Layers section.
 * Each ### subsection becomes a named layer with a tile grid.
 */
export function parseLayers(body: string): Record<string, TileStamp> {
  const layersSection = extractLevel2Section(body, 'Layers');
  if (!layersSection) return {};

  const layers: Record<string, TileStamp> = {};
  const lines = layersSection.split('\n');

  let currentLayerName: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+(.+)$/);

    if (headingMatch) {
      // Flush previous layer
      if (currentLayerName && currentLines.length > 0) {
        const grid = parseTileGrid(currentLines.join('\n'));
        if (grid) {
          layers[currentLayerName] = grid;
        }
      }

      // Start new layer — strip variant annotation like "(red variant)"
      const rawName = headingMatch[1].trim();
      currentLayerName = rawName.replace(/\s*\(.*\)$/, '').trim();
      currentLines = [];
      continue;
    }

    if (currentLayerName) {
      currentLines.push(line);
    }
  }

  // Flush last layer
  if (currentLayerName && currentLines.length > 0) {
    const grid = parseTileGrid(currentLines.join('\n'));
    if (grid) {
      layers[currentLayerName] = grid;
    }
  }

  return layers;
}

// --- Collision parsing ---

/**
 * Parse collision grid from ## Collision section.
 */
export function parseCollisionSection(body: string): CollisionStamp | null {
  const section = extractLevel2Section(body, 'Collision');
  if (!section) return null;

  const grid = parseTileGrid(section);
  if (!grid) return null;

  // Convert SemanticTile values to 0/1 collision flags
  const data: (0 | 1)[] = grid.tiles.map((t) => {
    if (t === 0) return 0;
    const val = parseInt(String(t), 10);
    return val === 1 ? 1 : 0;
  });

  return { width: grid.width, height: grid.height, data };
}

// --- Visuals parsing ---

/**
 * Parse visual objects from ## Visuals section.
 * Format: - **name**: `objectRef` at position (x, y), description
 */
export function parseVisualsSection(body: string): VisualObject[] {
  const section = extractLevel2Section(body, 'Visuals');
  if (!section) return [];

  const visuals: VisualObject[] = [];
  const lines = section.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) continue;

    // Match: - **name**: `objectRef` at position (x, y)
    // Or:    - **name**: object `objectRef` at position (x, y)
    const match = trimmed.match(
      /-\s+\*\*(\w+)\*\*:\s+(?:object\s+)?`?([^`\s,]+)`?\s+at\s+position\s+\((\d+)\s*,\s*(\d+)\)/i,
    );
    if (match) {
      visuals.push({
        objectRef: match[2],
        x: parseInt(match[3], 10),
        y: parseInt(match[4], 10),
      });
    }
  }

  return visuals;
}

// --- Objects parsing ---

/**
 * Parse event objects from ## Objects section.
 * Format: - **name**: position (x, y), type: TYPE[, properties/description]
 * Or:     - **objectRef**: position (x, y), type: TYPE, description: "..."
 */
export function parseObjectsSection(body: string): AssemblageObject[] {
  const section = extractLevel2Section(body, 'Objects');
  if (!section) return [];

  const objects: AssemblageObject[] = [];
  const lines = section.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) continue;

    const obj = parseObjectLine(trimmed);
    if (obj) {
      objects.push(obj);
    }
  }

  return objects;
}

/**
 * Parse a single object bullet line.
 */
function parseObjectLine(line: string): AssemblageObject | null {
  // Match: - **name**: position (x, y), type: TYPE
  const match = line.match(
    /-\s+\*\*([^*]+)\*\*:\s+position\s+\((\d+)\s*,\s*(\d+)\)\s*,\s*type:\s*(\w[\w-]*)/i,
  );
  if (!match) return null;

  const name = match[1];
  const x = parseInt(match[2], 10);
  const y = parseInt(match[3], 10);
  const typeStr = match[4].toLowerCase();

  // Map string type to AssemblageObject type
  const type = mapObjectType(typeStr);

  // Extract optional properties/description
  const rest = line.slice(match[0].length);
  const properties = parseObjectProperties(rest);

  return {
    name,
    type,
    x,
    y,
    ...(Object.keys(properties).length > 0 ? { properties } : {}),
  };
}

/**
 * Map a type string to a valid AssemblageObject type.
 */
function mapObjectType(typeStr: string): 'npc' | 'chest' | 'transition' | 'trigger' | 'spawn' {
  switch (typeStr) {
    case 'npc':
    case 'npc-anchor':
      return 'npc';
    case 'chest':
    case 'treasure':
      return 'chest';
    case 'transition':
    case 'door':
      return 'transition';
    case 'spawn':
      return 'spawn';
    case 'trigger':
    case 'interaction':
    case 'decoration':
    default:
      return 'trigger';
  }
}

/**
 * Extract properties from the remainder of an object line.
 * Handles: description: "...", properties: { key, key }
 */
function parseObjectProperties(rest: string): Record<string, string> {
  const props: Record<string, string> = {};
  const trimmed = rest.trim().replace(/^,\s*/, '');

  // Extract description
  const descMatch = trimmed.match(/description:\s*"([^"]+)"/);
  if (descMatch) {
    props.description = descMatch[1];
  }

  // Extract target from "target: [link](path)" format
  const targetMatch = trimmed.match(/target:\s*\[([^\]]+)\]\(([^)]+)\)/);
  if (targetMatch) {
    props.targetText = targetMatch[1];
    props.targetPath = targetMatch[2];
  }

  // Extract inline properties like { targetMap, targetX, targetY }
  const propsMatch = trimmed.match(/properties:\s*\{([^}]+)\}/);
  if (propsMatch) {
    const propsList = propsMatch[1].split(',').map((p) => p.trim());
    for (const prop of propsList) {
      const kvMatch = prop.match(/(\w+)\s*:\s*(.+)/);
      if (kvMatch) {
        props[kvMatch[1]] = kvMatch[2].trim();
      } else {
        // Bare key names (like { targetMap, targetX, targetY }) → mark as slots
        props[prop] = '<slot>';
      }
    }
  }

  return props;
}

// --- Anchors parsing ---

/**
 * Parse anchor points from ## Anchors section.
 * Format: - **name**: position (x, y)[ -- description]
 */
export function parseAnchorsSection(body: string): Anchor[] {
  const section = extractLevel2Section(body, 'Anchors');
  if (!section) return [];

  const anchors: Anchor[] = [];
  const lines = section.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) continue;

    const match = trimmed.match(/-\s+\*\*([^*]+)\*\*:\s+position\s+\((\d+)\s*,\s*(\d+)\)/i);
    if (match) {
      anchors.push({
        name: match[1],
        x: parseInt(match[2], 10),
        y: parseInt(match[3], 10),
      });
    }
  }

  return anchors;
}
