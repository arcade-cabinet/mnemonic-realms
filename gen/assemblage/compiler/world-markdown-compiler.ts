/**
 * World Markdown Compiler
 *
 * Reads the docs/world/ hierarchy → produces JSON DDL files that feed the
 * existing pipeline (world-loader → region-composer → TMX serializer).
 *
 * This eliminates the JSON DDL maintenance layer. The markdown IS the DDL.
 *
 * Input:
 *   docs/world/index.md              → WorldDefinition
 *   docs/world/{region}/index.md     → RegionDefinition (partial)
 *   docs/world/{region}/{location}.md → AnchorDefinition + mapLayout
 *
 * Output:
 *   gen/ddl/world.json               → WorldFile (name, properties, region refs)
 *   gen/ddl/regions/{region}.json     → Full RegionDefinition with anchors
 *
 * Architecture:
 *   Markdown → table-parser → intermediate types → DDL assembly → JSON files
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import {
  extractSection,
  parseCoordinate,
  parseCoordinateRange,
  parseFrontmatterFromMarkdown,
  parseList,
  parseLink,
  parseSize,
  parseTableUnderHeading,
  type Coordinate,
  type MarkdownLink,
  type TableRow,
} from './table-parser';
import type {
  AnchorDefinition,
  AnchorEvent,
  AnchorNpc,
  AnchorType,
  ConnectiveTissueRules,
  EncounterConfig,
  RegionConnection,
  RegionDefinition,
  TownDefinition,
  TownService,
  TownServiceType,
  WorldDefinition,
} from '../composer/world-ddl';
import type { WorldSlot } from '../composer/world-template';
import type { MapLayout } from '../composer/anchor-composer';

// ─────────────────────────────────────────────────────
// Intermediate parsed types (before DDL assembly)
// ─────────────────────────────────────────────────────

interface ParsedWorld {
  title: string;
  regionIds: string[];
  regionConnections: RegionConnection[];
}

interface ParsedRegion {
  id: string;
  title: string;
  ring: string;
  act: string;
  startVibrancy: number[];
  biomes: string[];
  palette: string;
  encounters?: { enemies: string[]; levelRange: [number, number] };
  connections: Record<string, string>;
  locations: ParsedLocationRef[];
  internalConnections: { from: string; to: string; direction: string }[];
}

interface ParsedLocationRef {
  id: string;
  name: string;
  biome: string;
  size: string;
  vibrancy: number;
  direction: string;
}

interface ParsedLocation {
  id: string;
  type: string;
  biome: string;
  size: [number, number];
  vibrancy: number;
  palette: string;
  music?: string;
  worldSlots: ParsedWorldSlot[];
  assemblages: ParsedAssemblageRef[];
  buildings: ParsedBuilding[];
  npcs: ParsedNpc[];
  events: ParsedEvent[];
  transitions: ParsedTransition[];
  resonanceStones: ParsedResonanceStone[];
  treasureChests: ParsedTreasureChest[];
  enemyZones: ParsedEnemyZone[];
}

interface ParsedWorldSlot {
  id: string;
  template: string;
  keeper?: string;
  shopType?: string;
}

interface ParsedAssemblageRef {
  ref: string;
  position?: [number, number];
  edge?: string;
  meta?: Record<string, unknown>;
}

interface ParsedBuilding {
  name: string;
  position: Coordinate;
  size: { width: number; height: number };
  assemblageRef?: string;
  description: string;
}

interface ParsedNpc {
  name: string;
  position: Coordinate;
  movement: string;
  graphic: string;
  quests: string[];
}

interface ParsedEvent {
  id: string;
  position: Coordinate;
  type: string;
  trigger: string;
  quest: string;
  description: string;
}

interface ParsedTransition {
  from: Coordinate;
  direction: string;
  toMap: string;
  destination: Coordinate;
  condition: string;
}

interface ParsedResonanceStone {
  id: string;
  position: Coordinate;
  fragments: string;
  notes: string;
}

interface ParsedTreasureChest {
  id: string;
  position: Coordinate;
  contents: string;
  condition: string;
}

interface ParsedEnemyZone {
  zone: string;
  bounds: { from: Coordinate; to: Coordinate };
  enemies: string;
  levelRange: string;
  encounterRate: string;
}

// ─────────────────────────────────────────────────────
// Compilation result
// ─────────────────────────────────────────────────────

export interface CompilationResult {
  world: WorldDefinition;
  regions: RegionDefinition[];
  warnings: string[];
  stats: {
    regionsCompiled: number;
    locationsCompiled: number;
    totalAnchors: number;
    totalNpcs: number;
    totalEvents: number;
    totalTransitions: number;
  };
}

// ─────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────

/**
 * Compile the entire docs/world/ hierarchy into DDL.
 *
 * @param worldRoot Path to docs/world/ directory
 * @returns Compiled world definition + all region definitions
 */
export function compileWorld(worldRoot: string): CompilationResult {
  const warnings: string[] = [];
  const stats = {
    regionsCompiled: 0,
    locationsCompiled: 0,
    totalAnchors: 0,
    totalNpcs: 0,
    totalEvents: 0,
    totalTransitions: 0,
  };

  // 1. Parse world index
  const worldIndexPath = join(worldRoot, 'index.md');
  if (!existsSync(worldIndexPath)) {
    throw new Error(`World index not found: ${worldIndexPath}`);
  }
  const parsedWorld = parseWorldIndex(readFileSync(worldIndexPath, 'utf-8'));

  // 2. Parse each region
  const regions: RegionDefinition[] = [];
  for (const regionId of parsedWorld.regionIds) {
    const regionDir = join(worldRoot, regionId);
    const regionIndexPath = join(regionDir, 'index.md');

    if (!existsSync(regionIndexPath)) {
      warnings.push(`Region index not found: ${regionIndexPath}`);
      continue;
    }

    const parsedRegion = parseRegionIndex(
      readFileSync(regionIndexPath, 'utf-8'),
      regionId,
    );

    // 3. Parse each location in the region
    // Use the order from the Locations table (not filesystem alphabetical)
    const anchors: AnchorDefinition[] = [];
    const locationFiles = readdirSync(regionDir)
      .filter((f) => f.endsWith('.md') && f !== 'index.md');

    // Sort by the order they appear in the region's Locations table
    const locationOrder = parsedRegion.locations.map((l) => l.id);
    locationFiles.sort((a, b) => {
      const aId = basename(a, '.md');
      const bId = basename(b, '.md');
      const aIdx = locationOrder.indexOf(aId);
      const bIdx = locationOrder.indexOf(bId);
      // Known locations first in table order, unknown ones at the end
      if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });

    for (const file of locationFiles) {
      const locationPath = join(regionDir, file);
      const locationId = basename(file, '.md');

      try {
        const parsedLocation = parseLocation(
          readFileSync(locationPath, 'utf-8'),
          locationId,
        );
        const anchor = locationToAnchor(parsedLocation, parsedRegion, warnings);
        anchors.push(anchor);

        stats.locationsCompiled++;
        stats.totalNpcs += parsedLocation.npcs.length;
        stats.totalEvents += parsedLocation.events.length;
        stats.totalTransitions += parsedLocation.transitions.length;
      } catch (err) {
        warnings.push(`Failed to parse ${locationPath}: ${(err as Error).message}`);
      }
    }

    stats.totalAnchors += anchors.length;

    // 4. Assemble region definition
    const region = assembleRegion(parsedRegion, anchors, warnings);
    regions.push(region);
    stats.regionsCompiled++;
  }

  // 5. Assemble world definition
  // startAnchor: use frontmatter if provided, else first anchor of first region
  const startAnchor = regions[0]?.anchors[0]?.id ?? 'everwick';
  const world: WorldDefinition = {
    name: parsedWorld.title,
    properties: {
      startRegion: parsedWorld.regionIds[0] ?? 'settled-lands',
      startAnchor,
      vibrancySystem: true,
    },
    regions,
    regionConnections: parsedWorld.regionConnections,
  };

  return { world, regions, warnings, stats };
}

/**
 * Compile and write JSON DDL files to disk.
 *
 * @param worldRoot Path to docs/world/ directory
 * @param ddlRoot Path to gen/ddl/ directory
 */
export function compileAndWriteWorld(worldRoot: string, ddlRoot: string): CompilationResult {
  const result = compileWorld(worldRoot);

  // Write world.json
  const worldFile = {
    name: result.world.name,
    properties: result.world.properties,
    regions: result.regions.map((r) => r.id),
    regionConnections: result.world.regionConnections,
  };
  writeFileSync(join(ddlRoot, 'world.json'), JSON.stringify(worldFile, null, 2) + '\n', 'utf-8');

  // Write region JSON files
  const regionsDir = join(ddlRoot, 'regions');
  mkdirSync(regionsDir, { recursive: true });
  for (const region of result.regions) {
    writeFileSync(
      join(regionsDir, `${region.id}.json`),
      JSON.stringify(region, null, 2) + '\n',
      'utf-8',
    );
  }

  return result;
}

// ─────────────────────────────────────────────────────
// World index parser
// ─────────────────────────────────────────────────────

function parseWorldIndex(markdown: string): ParsedWorld {
  const { data, body } = parseFrontmatterFromMarkdown(markdown);

  const title = (data.title as string) ?? 'Mnemonic Realms';
  const regionIds = (data.regions as string[]) ?? [];

  // Parse region connections from the Inter-Zone Connections section
  // or from frontmatter if present
  const regionConnections: RegionConnection[] = [];
  if (data.regionConnections) {
    const conns = data.regionConnections as Array<Record<string, unknown>>;
    for (const conn of conns) {
      regionConnections.push({
        from: conn.from as string,
        to: conn.to as string,
        connectionType: (conn.connectionType as RegionConnection['connectionType']) ?? 'gate',
        condition: conn.condition as string | undefined,
        direction: conn.direction as RegionConnection['direction'],
      });
    }
  } else {
    // Infer connections from region order: each region connects to the next
    for (let i = 0; i < regionIds.length - 1; i++) {
      regionConnections.push({
        from: regionIds[i],
        to: regionIds[i + 1],
        connectionType: 'gate',
        condition: i === 0 ? 'MQ-07+' : 'MQ-11+',
        direction: 'south',
      });
    }
  }

  return { title, regionIds, regionConnections };
}

// ─────────────────────────────────────────────────────
// Region index parser
// ─────────────────────────────────────────────────────

function parseRegionIndex(markdown: string, regionId: string): ParsedRegion {
  const { data, body } = parseFrontmatterFromMarkdown(markdown);

  // Parse locations table
  const locationRows = parseTableUnderHeading(body, 'Locations');
  const locations: ParsedLocationRef[] = locationRows.map((row) => {
    const nameLink = parseLink(row.Location ?? row.location ?? '');
    const sizeSpec = parseSize(row['Size (16px tiles)'] ?? row.Size ?? '');
    return {
      id: nameLink?.path?.replace('.md', '').replace(/.*\//, '') ?? '',
      name: nameLink?.text ?? row.Location ?? '',
      biome: row.Biome ?? row.biome ?? '',
      size: row['Size (16px tiles)'] ?? row.Size ?? '',
      vibrancy: parseInt(row.Vibrancy ?? row.vibrancy ?? '50', 10),
      direction: row['Direction from Everwick'] ?? row.Direction ?? '',
    };
  });

  // Parse internal connections
  const connRows = parseTableUnderHeading(body, 'Internal Connections');
  const internalConnections = connRows.map((row) => ({
    from: row.From ?? '',
    to: row.To ?? '',
    direction: row.Direction ?? '',
  }));

  // Parse encounters from frontmatter
  const encountersData = data.encounters as Record<string, unknown> | undefined;
  const encounters = encountersData
    ? {
        enemies: (encountersData.enemies as string[]) ?? [],
        levelRange: (encountersData.levelRange as [number, number]) ?? [1, 5],
      }
    : undefined;

  // Parse connections from frontmatter
  const connectionsData = (data.connections as Record<string, string>) ?? {};

  return {
    id: regionId,
    title: (data.title as string) ?? regionId,
    ring: (data.ring as string) ?? 'inner',
    act: (data.act as string) ?? 'I',
    startVibrancy: Array.isArray(data.startVibrancy) ? data.startVibrancy : [50],
    biomes: (data.biomes as string[]) ?? [],
    palette: (data.palette as string) ?? 'village-premium',
    encounters,
    connections: connectionsData,
    locations,
    internalConnections,
  };
}

// ─────────────────────────────────────────────────────
// Location parser
// ─────────────────────────────────────────────────────

function parseLocation(markdown: string, locationId: string): ParsedLocation {
  const { data, body } = parseFrontmatterFromMarkdown(markdown);

  // Frontmatter fields
  const size = Array.isArray(data.size)
    ? (data.size as [number, number])
    : [60, 60] as [number, number];

  // Parse world slots from frontmatter
  const slotsData = data.worldSlots as Array<Record<string, unknown>> | undefined;
  const worldSlots: ParsedWorldSlot[] = (slotsData ?? []).map((i) => ({
    id: (i.id as string) ?? '',
    template: (i.template as string) ?? 'shop-single',
    keeper: i.keeper as string | undefined,
    shopType: i.shopType as string | undefined,
  }));

  // Parse assemblages from frontmatter
  const assemblagesData = (data.assemblages as Array<Record<string, unknown>>) ?? [];
  const assemblages: ParsedAssemblageRef[] = assemblagesData.map((a) => ({
    ref: (a.ref as string) ?? '',
    position: Array.isArray(a.position) ? a.position as [number, number] : undefined,
    edge: a.edge as string | undefined,
    meta: a.meta as Record<string, unknown> | undefined,
  }));

  // Parse body tables — try multiple heading names for resilience
  const buildings = parseBuildingsTable(body);
  const npcs = parseNpcsTable(body);
  const events = parseEventsTable(body);
  const transitions = parseTransitionsTable(body);
  const resonanceStones = parseResonanceStonesTable(body);
  const treasureChests = parseTreasureChestsTable(body);
  const enemyZones = parseEnemyZonesTable(body);

  return {
    id: (data.id as string) ?? locationId,
    type: (data.type as string) ?? 'overworld',
    biome: (data.biome as string) ?? 'grassland',
    size,
    vibrancy: (data.vibrancy as number) ?? 50,
    palette: (data.palette as string) ?? 'village-premium',
    music: data.music as string | undefined,
    worldSlots,
    assemblages,
    buildings,
    npcs,
    events,
    transitions,
    resonanceStones,
    treasureChests,
    enemyZones,
  };
}

// ─────────────────────────────────────────────────────
// Table parsers (location body sections)
// ─────────────────────────────────────────────────────

function parseBuildingsTable(body: string): ParsedBuilding[] {
  // Try multiple heading names
  const rows =
    parseTableUnderHeading(body, 'Buildings') ||
    parseTableUnderHeading(body, 'Key Areas');
  if (!rows.length) return [];

  return rows.map((row) => {
    const posStr = row['Position (x, y)'] ?? row.Position ?? '';
    const pos = parseCoordinate(posStr) ?? { x: 0, y: 0 };
    const sizeStr = row['Size (tiles)'] ?? row.Size ?? '';
    const sizeSpec = parseSize(sizeStr);
    const assembLink = parseLink(row.Assemblage ?? '');

    return {
      name: row.Building ?? row.Area ?? row.Name ?? '',
      position: pos,
      size: sizeSpec ?? { width: 4, height: 4 },
      assemblageRef: assembLink?.text ?? undefined,
      description: row.Description ?? '',
    };
  });
}

function parseNpcsTable(body: string): ParsedNpc[] {
  const rows = parseTableUnderHeading(body, 'NPCs');
  if (!rows.length) return [];

  return rows.map((row) => {
    const posStr = row.Position ?? '';
    const pos = parseCoordinate(posStr) ?? { x: 0, y: 0 };
    const graphic = (row.Graphic ?? '').replace(/`/g, '');
    const questStr = row['Linked Quests'] ?? row.Quests ?? '';

    return {
      name: row.NPC ?? row.Name ?? '',
      position: pos,
      movement: row.Movement ?? 'Static',
      graphic,
      quests: questStr === '--' || questStr === '' ? [] : parseList(questStr),
    };
  });
}

function parseEventsTable(body: string): ParsedEvent[] {
  const rows = parseTableUnderHeading(body, 'Events');
  if (!rows.length) return [];

  return rows.map((row) => {
    const posStr = row.Position ?? '';
    const pos = parseCoordinate(posStr) ?? { x: 0, y: 0 };

    return {
      id: row['Event ID'] ?? row.ID ?? '',
      position: pos,
      type: row.Type ?? 'action',
      trigger: row.Trigger ?? 'always',
      quest: row['Linked Quest'] ?? row.Quest ?? '',
      description: row.Description ?? '',
    };
  });
}

function parseTransitionsTable(body: string): ParsedTransition[] {
  const rows = parseTableUnderHeading(body, 'Transitions');
  if (!rows.length) return [];

  return rows.map((row) => {
    const fromStr = row.From ?? '';
    const from = parseCoordinate(fromStr) ?? { x: 0, y: 0 };
    const destStr = row['Destination Tile'] ?? row.Destination ?? '';
    const dest = parseCoordinate(destStr) ?? { x: 0, y: 0 };

    return {
      from,
      direction: row.Direction ?? '',
      toMap: (row['To Map'] ?? row.To ?? '').toLowerCase().replace(/\s+/g, '-'),
      destination: dest,
      condition: row.Condition ?? 'Always',
    };
  });
}

function parseResonanceStonesTable(body: string): ParsedResonanceStone[] {
  const rows = parseTableUnderHeading(body, 'Resonance Stones');
  if (!rows.length) return [];

  return rows.map((row) => {
    const posStr = row.Position ?? '';
    const pos = parseCoordinate(posStr) ?? { x: 0, y: 0 };

    return {
      id: row.ID ?? '',
      position: pos,
      fragments: row['Fragments Available'] ?? row.Fragments ?? row.Type ?? '',
      notes: row.Notes ?? '',
    };
  });
}

function parseTreasureChestsTable(body: string): ParsedTreasureChest[] {
  const rows = parseTableUnderHeading(body, 'Treasure Chests');
  if (!rows.length) return [];

  return rows.map((row) => {
    const posStr = row.Position ?? '';
    const pos = parseCoordinate(posStr) ?? { x: 0, y: 0 };

    return {
      id: row.ID ?? '',
      position: pos,
      contents: row.Contents ?? '',
      condition: row.Condition ?? 'always',
    };
  });
}

function parseEnemyZonesTable(body: string): ParsedEnemyZone[] {
  const rows = parseTableUnderHeading(body, 'Enemy Zones');
  if (!rows.length) return [];

  return rows.map((row) => {
    const boundsStr = row.Bounds ?? '';
    const bounds = parseCoordinateRange(boundsStr) ?? {
      from: { x: 0, y: 0 },
      to: { x: 10, y: 10 },
    };

    return {
      zone: row.Zone ?? '',
      bounds,
      enemies: row.Enemies ?? '',
      levelRange: row['Level Range'] ?? '',
      encounterRate: row['Encounter Rate'] ?? '',
    };
  });
}

// ─────────────────────────────────────────────────────
// DDL Assembly — parsed data → DDL types
// ─────────────────────────────────────────────────────

const BIOME_PALETTE_MAP: Record<string, string> = {
  village: 'village-premium',
  grassland: 'village-premium',
  forest: 'village-premium',
  riverside: 'village-premium',
  highland: 'village-premium',
  farmland: 'village-premium',
  wetland: 'frontier-seasons',
  seasonal: 'frontier-seasons',
  mountain: 'snow-mountain',
  dungeon: 'dungeon-depths',
  desert: 'desert-sketch',
  sketch: 'desert-sketch',
  wireframe: 'desert-sketch',
  fortress: 'fortress-castles',
  castle: 'fortress-castles',
};

const ACT_MAP: Record<string, number[]> = {
  I: [1],
  II: [2],
  III: [3],
  'I-II': [1, 2],
  'II-III': [2, 3],
};

const RING_DIFFICULTY: Record<string, 'easy' | 'medium' | 'hard' | 'extreme'> = {
  inner: 'easy',
  middle: 'medium',
  outer: 'hard',
  depths: 'hard',
};

const RING_PLAYTIME: Record<string, number> = {
  inner: 180,
  middle: 240,
  outer: 300,
  depths: 120,
};

/**
 * Map a town service type string from markdown to the DDL TownServiceType.
 */
function inferServiceType(shopType?: string, template?: string): TownServiceType {
  if (shopType === 'general') return 'general-store';
  if (shopType === 'weapons') return 'blacksmith';
  if (shopType === 'armor') return 'armor-shop';
  if (template === 'inn') return 'inn';
  if (template === 'residence') return 'elder-house';
  if (template === 'library') return 'library';
  return 'general-store';
}

function locationToAnchor(
  loc: ParsedLocation,
  region: ParsedRegion,
  warnings: string[],
): AnchorDefinition {
  // Determine anchor type from location type
  const typeMap: Record<string, AnchorType> = {
    village: 'town',
    town: 'town',
    overworld: 'town',
    hamlet: 'town',
    dungeon: 'dungeon',
    shrine: 'shrine',
    fortress: 'fortress',
    camp: 'camp',
    landmark: 'landmark',
    gate: 'gate',
  };
  const anchorType = typeMap[loc.type] ?? 'town';

  // Determine position within region from region's location table
  const locRef = region.locations.find((l) => l.id === loc.id);
  const position = inferPosition(locRef?.direction ?? 'center');

  // Build town definition if applicable
  const town = anchorType === 'town' ? buildTownDefinition(loc) : undefined;

  // Build NPCs
  const npcs: AnchorNpc[] = loc.npcs.map((n) => ({
    id: n.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    role: n.quests.length > 0 ? 'quest-giver' : 'ambient',
    placement: n.movement.toLowerCase().includes('static') ? 'center' : 'patrol',
  }));

  // Build events
  const events: AnchorEvent[] = loc.events.map((e) => ({
    id: e.id,
    trigger: e.type.toLowerCase().includes('auto')
      ? 'auto'
      : e.type.toLowerCase().includes('touch')
        ? 'touch'
        : 'action',
    quest: e.quest !== '--' && e.quest !== '' ? e.quest : undefined,
    repeat: e.trigger.toLowerCase().includes('always') ? 'always' : 'once',
    description: e.description,
  }));

  // Build world slots from parsed world slot definitions
  const worldSlots: WorldSlot[] = loc.worldSlots.map((i) => ({
    instanceId: i.id,
    transitionType: 'door' as const,
  }));

  // Build mapLayout from parsed data
  const mapLayout = buildMapLayout(loc, warnings);

  const anchor: AnchorDefinition & { mapLayout?: MapLayout } = {
    id: loc.id,
    name: locRef?.name ?? loc.id,
    type: anchorType,
    position,
    importance: anchorType === 'town' && loc.worldSlots.length > 0 ? 'major' : 'minor',
    town,
    quests: [...new Set(loc.npcs.flatMap((n) => n.quests))].filter(Boolean),
    npcs,
    events,
    worldSlots: worldSlots.length > 0 ? worldSlots : undefined,
    mapLayout,
  };

  return anchor;
}

function inferPosition(direction: string): AnchorDefinition['position'] {
  const d = direction.toLowerCase();
  if (d.includes('center') || d.includes('hub')) return 'start';
  if (d.includes('north')) return 'end';
  if (d.includes('south')) return 'middle';
  return 'side';
}

function buildTownDefinition(loc: ParsedLocation): TownDefinition {
  const services: TownService[] = loc.worldSlots
    .filter((i) => i.template !== 'residence')
    .map((i) => ({
      type: inferServiceType(i.shopType, i.template),
      keeperNpc: i.keeper,
      buildingName: loc.buildings.find((b) =>
        b.name.toLowerCase().includes(i.keeper ?? ''),
      )?.name,
    }));

  // Count houses (assemblages without world slot transitions)
  const houseCount = loc.assemblages.filter(
    (a) =>
      a.ref.startsWith('house-') &&
      !a.meta?.worldSlot,
  ).length;

  // Determine town size from map size
  const area = loc.size[0] * loc.size[1];
  const size =
    area <= 2500 ? 'hamlet' : area <= 5000 ? 'village' : area <= 8000 ? 'town' : 'city';

  return {
    size,
    mapSize: loc.size,
    services,
    houses: Math.max(houseCount, 1),
    centralFeature: loc.buildings.find((b) =>
      b.name.toLowerCase().includes('square') ||
      b.name.toLowerCase().includes('fountain') ||
      b.name.toLowerCase().includes('well'),
    )?.name,
  };
}

function buildMapLayout(loc: ParsedLocation, warnings: string[]): MapLayout {
  const [mapW, mapH] = loc.size;
  const palette = loc.palette;
  const defaultGround = BIOME_GROUND_MAP[loc.biome] ?? 'ground.grass';

  // Build buildings from assemblage refs
  const buildings = loc.assemblages
    .filter((a) => a.ref.startsWith('house-') && a.position)
    .map((a) => {
      const building = loc.buildings.find((b) => {
        const meta = a.meta as Record<string, string> | undefined;
        return meta?.name && b.name.includes(meta.name);
      });

      const worldSlotId = (a.meta as Record<string, string> | undefined)?.worldSlot;
      const slotDef = loc.worldSlots.find((i) => i.id === worldSlotId);

      // Infer objectRef from assemblage ref
      const objectRef = assembRefToObjectRef(a.ref);

      // Infer building size from the assemblage ref
      const refSize = inferBuildingSize(a.ref);

      return {
        id: loc.id + '-' + a.ref + '-' + (a.position?.[0] ?? 0),
        name: (a.meta as Record<string, string>)?.name ?? a.ref,
        objectRef,
        x: a.position![0] * 2, // frontmatter positions are conceptual; DDL uses doubled coords
        y: a.position![1] * 2,
        width: refSize.width,
        height: refSize.height,
        ...(worldSlotId
          ? {
              door: {
                x: Math.floor(refSize.width / 2),
                y: refSize.height - 1,
                targetWorld: worldSlotId,
              },
              keeperNpc: slotDef?.keeper,
              keeperSprite: slotDef?.keeper ? `npc_${slotDef.keeper}` : undefined,
              keeperDialogue: slotDef?.keeper
                ? `${slotDef.keeper}-${inferServiceType(slotDef.shopType, slotDef.template)}`
                : undefined,
            }
          : {}),
      };
    });

  // Build areas from non-building assemblages
  const areas = loc.assemblages
    .filter((a) => !a.ref.startsWith('house-') && !a.ref.startsWith('forest-') && a.position)
    .map((a) => {
      const refSize = inferAreaSize(a.ref);
      return {
        id: a.ref,
        name: (a.meta as Record<string, string>)?.name ?? a.ref,
        x: a.position![0] * 2,
        y: a.position![1] * 2,
        width: refSize.width,
        height: refSize.height,
        terrain: 'ground.light-grass',
      };
    });

  // Build transitions from parsed transitions table
  const transitions = loc.transitions.map((t) => ({
    id: `${loc.id}-${t.direction.toLowerCase()}-gate`,
    x: t.from.x,
    y: t.from.y,
    targetMap: t.toMap,
    targetX: t.destination.x,
    targetY: t.destination.y,
    condition: t.condition !== 'Always' && t.condition !== 'Always open'
      ? t.condition
      : undefined,
  }));

  // Build resonance stones
  const resonanceStones = loc.resonanceStones.map((rs) => ({
    id: rs.id,
    x: rs.position.x,
    y: rs.position.y,
    fragment: rs.fragments,
    hidden: rs.notes.toLowerCase().includes('hidden') ? true : undefined,
  }));

  // Build treasure chests
  const treasureChests = loc.treasureChests.map((ch) => {
    const itemMatch = ch.contents.match(/(.+?)\s*(?:\((.+?)\))?\s*(?:x(\d+))?$/);
    return {
      id: ch.id,
      x: ch.position.x,
      y: ch.position.y,
      item: itemMatch?.[2] ?? itemMatch?.[1] ?? ch.contents,
      quantity: parseInt(itemMatch?.[3] ?? '1', 10),
      condition: ch.condition !== 'always' && ch.condition !== '' ? ch.condition : undefined,
    };
  });

  // Build NPC spawns from parsed NPCs
  const npcSpawns = loc.npcs.map((n) => ({
    id: n.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    sprite: n.graphic,
    x: n.position.x,
    y: n.position.y,
    dialogue: n.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }));

  // Detect forest border from assemblages
  const forestBorderRef = loc.assemblages.find((a) => a.ref === 'forest-border');
  const forestBorder = forestBorderRef
    ? buildForestBorder(mapW, mapH, transitions)
    : undefined;

  // Infer player spawn: center of map or first transition entry
  const playerSpawn = { x: Math.floor(mapW / 2), y: Math.floor(mapH / 2) };

  return {
    biome: loc.biome,
    palette,
    defaultGround,
    music: loc.music,
    tileSize: 16,
    mapSize: loc.size,
    forestBorder,
    buildings: buildings.length > 0 ? buildings : undefined,
    areas: areas.length > 0 ? areas : undefined,
    npcSpawns: npcSpawns.length > 0 ? npcSpawns : undefined,
    transitions: transitions.length > 0 ? transitions : undefined,
    resonanceStones: resonanceStones.length > 0 ? resonanceStones : undefined,
    treasureChests: treasureChests.length > 0 ? treasureChests : undefined,
    playerSpawn,
  };
}

function buildForestBorder(
  mapW: number,
  mapH: number,
  transitions: { id: string; x: number; y: number }[],
): MapLayout['forestBorder'] {
  const depth = 4;
  const midX = Math.floor(mapW / 2);
  const midY = Math.floor(mapH / 2);
  const gateWidth = 6;

  return {
    depth,
    gates: {
      north: { start: midX - gateWidth / 2, end: midX + gateWidth / 2 },
      south: { start: midX - gateWidth / 2, end: midX + gateWidth / 2 },
      east: { start: midY - gateWidth / 2, end: midY + gateWidth / 2 },
      west: { start: midY - gateWidth / 2, end: midY + gateWidth / 2 },
    },
  };
}

const BIOME_GROUND_MAP: Record<string, string> = {
  village: 'ground.grass',
  grassland: 'ground.grass',
  forest: 'ground.dark-grass',
  riverside: 'ground.grass',
  highland: 'ground.grass',
  farmland: 'ground.grass',
  wetland: 'ground.swamp',
  mountain: 'ground.rock',
  dungeon: 'ground.stone',
  desert: 'ground.sand',
  sketch: 'ground.white',
  wireframe: 'ground.white',
  fortress: 'ground.stone',
};

function assembRefToObjectRef(ref: string): string {
  // house-red-small → house.red-small-1
  // house-blue-medium → house.blue-medium-1
  const match = ref.match(/^house-(\w+)-(\w+)(?:-(\d+))?$/);
  if (match) {
    return `house.${match[1]}-${match[2]}-${match[3] ?? '1'}`;
  }
  return ref;
}

function inferBuildingSize(ref: string): { width: number; height: number } {
  if (ref.includes('large')) return { width: 12, height: 9 };
  if (ref.includes('medium')) return { width: 10, height: 8 };
  return { width: 8, height: 6 };
}

function inferAreaSize(ref: string): { width: number; height: number } {
  const sizeMap: Record<string, { width: number; height: number }> = {
    'fountain-base': { width: 4, height: 4 },
    'training-ground': { width: 10, height: 8 },
    'memorial-garden': { width: 8, height: 6 },
    'lookout-hill': { width: 12, height: 10 },
    'forest-clearing': { width: 10, height: 10 },
    'farm-field': { width: 12, height: 15 },
    watermill: { width: 8, height: 10 },
    'road-intersection': { width: 6, height: 6 },
  };
  return sizeMap[ref] ?? { width: 8, height: 8 };
}

// ─────────────────────────────────────────────────────
// Region assembly
// ─────────────────────────────────────────────────────

function assembleRegion(
  parsed: ParsedRegion,
  anchors: AnchorDefinition[],
  warnings: string[],
): RegionDefinition {
  const acts = ACT_MAP[parsed.act] ?? [1];
  const difficulty = RING_DIFFICULTY[parsed.ring] ?? 'easy';
  const playTime = RING_PLAYTIME[parsed.ring] ?? 180;

  const encounters: EncounterConfig | undefined = parsed.encounters
    ? {
        enemies: parsed.encounters.enemies,
        levelRange: parsed.encounters.levelRange,
        averageStepsBetweenEncounters: 200,
      }
    : undefined;

  const tissue: ConnectiveTissueRules = {
    pathDensity: parsed.internalConnections.length > 4 ? 'dense' : 'moderate',
    safePathRatio: difficulty === 'easy' ? 0.6 : difficulty === 'medium' ? 0.4 : 0.2,
  };

  return {
    id: parsed.id,
    name: parsed.title,
    biome: parsed.biomes[0] ?? 'farmland',
    acts,
    playTimeMinutes: playTime,
    difficulty,
    ambientMusic: `bgm-overworld-${parsed.id}`,
    startVibrancy: parsed.startVibrancy[1] ?? parsed.startVibrancy[0] ?? 50,
    weather: { default: 'clear', dynamic: false },
    encounters,
    anchors,
    connectiveTissue: tissue,
  };
}

// ─────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────

/**
 * Validate compiled output for referential integrity.
 */
export function validateCompilation(result: CompilationResult): string[] {
  const errors: string[] = [];

  // Check all region IDs are unique
  const regionIds = new Set<string>();
  for (const region of result.regions) {
    if (regionIds.has(region.id)) {
      errors.push(`Duplicate region ID: ${region.id}`);
    }
    regionIds.add(region.id);
  }

  // Check all anchor IDs are unique across all regions
  const anchorIds = new Set<string>();
  for (const region of result.regions) {
    for (const anchor of region.anchors) {
      if (anchorIds.has(anchor.id)) {
        errors.push(`Duplicate anchor ID: ${anchor.id} (in region ${region.id})`);
      }
      anchorIds.add(anchor.id);
    }
  }

  // Check region connections reference valid regions
  for (const conn of result.world.regionConnections) {
    if (!regionIds.has(conn.from)) {
      errors.push(`Region connection references unknown region: ${conn.from}`);
    }
    if (!regionIds.has(conn.to)) {
      errors.push(`Region connection references unknown region: ${conn.to}`);
    }
  }

  // Check world slots reference valid instance IDs
  for (const region of result.regions) {
    for (const anchor of region.anchors) {
      if (anchor.worldSlots) {
        for (const slot of anchor.worldSlots) {
          // World instances are separate — just note if they seem to reference
          // the anchor's own location (would be circular)
          if (slot.instanceId === anchor.id) {
            errors.push(`Anchor ${anchor.id} has a world slot referencing itself`);
          }
        }
      }
    }
  }

  return errors;
}
