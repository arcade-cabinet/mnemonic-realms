/**
 * Act Script Markdown → Scene DDL JSON Parser
 *
 * Reads docs/story/act{N}-script.md and generates scene DDL entries matching
 * the SceneDdlSchema. Extracts everything possible from the markdown:
 *
 * - Scene identity (number, name, summary)
 * - Location → mapId + subLocation + spawnPosition
 * - Trigger description → SceneTrigger object
 * - Characters → NPC stubs
 * - Narrative context, time of day, emotional beat
 * - Dialogue → system messages as effects, NPC dialogue refs
 * - Player actions → playerInstructions
 * - Tutorial integration → mechanicTaught
 * - Rewards/consequences → effects (items, companions, vibrancy, quests)
 *
 * Fields that CANNOT be derived from markdown (assemblage placements, event
 * positions, exact NPC positions) are left as empty arrays. These are filled
 * in during the scene-building workflow.
 */

import { readFileSync } from 'node:fs';
import type { SceneDdl } from '../../schemas/ddl-scenes.ts';

// ---------------------------------------------------------------------------
// Known map name → ID mappings
// ---------------------------------------------------------------------------

const MAP_NAME_TO_ID: Record<string, string> = {
  // Settled Lands
  everwick: 'everwick',
  'village hub': 'everwick',
  heartfield: 'heartfield',
  ambergrove: 'ambergrove',
  millbrook: 'millbrook',
  sunridge: 'sunridge',
  // Depths
  'memory cellar': 'depths-l1',
  'depths l1': 'depths-l1',
  'depths l2': 'depths-l2',
  'depths l3': 'depths-l3',
  'depths l4': 'depths-l4',
  'depths l5': 'depths-l5',
  depths: 'depths-l1',
  'the depths': 'depths-l1',
  'the deepest memory': 'depths-l5',
  'level 5': 'depths-l5',
  // Frontier
  'shimmer marsh': 'shimmer-marsh',
  'hollow ridge': 'hollow-ridge',
  flickerveil: 'flickerveil',
  'resonance fields': 'resonance-fields',
  // Sketch Realm
  'luminous wastes': 'luminous-wastes',
  'undrawn peaks': 'undrawn-peaks',
  'half-drawn forest': 'half-drawn-forest',
  // Preserver Fortress
  'preserver fortress': 'fortress-f1',
  'fortress floor 1': 'fortress-f1',
  'fortress floor 2': 'fortress-f2',
  'fortress floor 3': 'fortress-f3',
  'gallery of moments': 'fortress-f1',
  'archive of perfection': 'fortress-f2',
  'archive of echoes': 'fortress-f2',
  'first memory chamber': 'fortress-f3',
  'throne of memory': 'fortress-f3',
  'preserver fortress gate': 'fortress-f1',
  // Child worlds
  "lira's workshop": 'lira-workshop',
  "hana's workshop": 'hana-workshop',
  // Special
  everywhere: 'all-maps',
  'the edge': 'luminous-wastes',
};

// ---------------------------------------------------------------------------
// Location string parser
// ---------------------------------------------------------------------------

interface ParsedLocation {
  mapId: string;
  subLocation: string | undefined;
  spawnPosition: string | undefined;
  rawMapName: string;
}

/**
 * Parse a location string from the act script.
 *
 * Examples:
 *   "Everwick — Elder's House (18, 10)" → { mapId: 'everwick', subLocation: "Elder's House", spawnPosition: "18,10" }
 *   "Heartfield (Settled Lands — south of Everwick)" → { mapId: 'heartfield', subLocation: undefined }
 *   "Heartfield — Stagnation Clearing (35, 30)" → { mapId: 'heartfield', subLocation: "Stagnation Clearing", spawnPosition: "35,30" }
 *   "Sunridge — The Threshold (20, 2), transitioning to Hollow Ridge" → { mapId: 'sunridge', subLocation: "The Threshold", spawnPosition: "20,2" }
 */
function parseLocation(raw: string): ParsedLocation {
  // Strip trailing context like ", transitioning to ...", ", then credits"
  let cleaned = raw.replace(/,\s*then\s+.+$/, '').trim();
  // Strip dimension specs like "(40x40 tiles)" or "(20x25 tiles, single room)"
  cleaned = cleaned.replace(/\(\s*\d+x\d+\s*tiles?[^)]*\)/gi, '').trim();
  // Strip descriptive parens like "(Sketch zone)" "(accessed via ...)" "(exterior)"
  // NOTE: "exterior"/"interior" appear in source markdown act scripts, not our code terminology
  cleaned = cleaned.replace(/\(\s*(?:Sketch|accessed|at|exterior|interior)[^)]*\)/gi, '').trim();
  // Separator: em-dash (—), en-dash (–), or spaced double-hyphen ( -- )
  // NOT a single hyphen, which can appear in names like "Half-Drawn"
  const SEP = /\s*(?:—|–|\s-{1,2}\s)\s*/;

  // Try to match: MapName — SubLocation (x, y)
  const fullMatch = cleaned.match(
    new RegExp(`^(.+?)${SEP.source}(.+?)\\s*\\((\\d+)\\s*,\\s*(\\d+)\\)`),
  );
  if (fullMatch) {
    const mapName = fullMatch[1].trim();
    const subLoc = fullMatch[2].trim();
    const x = fullMatch[3];
    const y = fullMatch[4];
    return {
      mapId: resolveMapId(mapName),
      subLocation: subLoc,
      spawnPosition: `${x},${y}`,
      rawMapName: mapName,
    };
  }

  // Try: MapName — SubLocation (no coordinates)
  const dashMatch = cleaned.match(new RegExp(`^(.+?)${SEP.source}(.+?)$`));
  if (dashMatch) {
    const mapName = dashMatch[1].trim();
    const subLoc = dashMatch[2].trim().replace(/\s*\(.*\)$/, '');
    // Check if subLoc has coordinates
    const coordInSub = dashMatch[2].match(/\((\d+)\s*,\s*(\d+)\)/);
    return {
      mapId: resolveMapId(mapName),
      subLocation: subLoc || undefined,
      spawnPosition: coordInSub ? `${coordInSub[1]},${coordInSub[2]}` : undefined,
      rawMapName: mapName,
    };
  }

  // Try: MapName (coordinates)
  const simpleCoord = cleaned.match(/^(.+?)\s*\((\d+)\s*,\s*(\d+)\)/);
  if (simpleCoord) {
    return {
      mapId: resolveMapId(simpleCoord[1].trim()),
      subLocation: undefined,
      spawnPosition: `${simpleCoord[2]},${simpleCoord[3]}`,
      rawMapName: simpleCoord[1].trim(),
    };
  }

  // Try: MapName (description in parens)
  const parenDesc = cleaned.match(/^(.+?)\s*\((.+)\)$/);
  if (parenDesc) {
    return {
      mapId: resolveMapId(parenDesc[1].trim()),
      subLocation: undefined,
      spawnPosition: undefined,
      rawMapName: parenDesc[1].trim(),
    };
  }

  // Plain map name
  const plain = cleaned.replace(/[,;].*$/, '').trim();
  return {
    mapId: resolveMapId(plain),
    subLocation: undefined,
    spawnPosition: undefined,
    rawMapName: plain,
  };
}

function resolveMapId(name: string): string {
  // Normalize: lowercase, strip leading articles, strip dimension info
  const key = name
    .toLowerCase()
    .trim()
    .replace(/\s*\(.*?\)\s*$/, '') // Strip parenthetical info like "(40x40 tiles)"
    .replace(/\s*\d+x\d+.*$/, '') // Strip dimension specs
    .trim();

  if (MAP_NAME_TO_ID[key]) return MAP_NAME_TO_ID[key];

  // Strip leading "the"
  const withoutThe = key.replace(/^the\s+/, '');
  if (MAP_NAME_TO_ID[withoutThe]) return MAP_NAME_TO_ID[withoutThe];

  // Try first word only (for "Heartfield farms" etc.)
  const firstWord = key.split(/\s/)[0];
  if (MAP_NAME_TO_ID[firstWord]) return MAP_NAME_TO_ID[firstWord];

  // Try first word without "the"
  const firstWordNoThe = withoutThe.split(/\s/)[0];
  if (MAP_NAME_TO_ID[firstWordNoThe]) return MAP_NAME_TO_ID[firstWordNoThe];

  // Try joining with hyphen (for "Half-Drawn Forest" etc.)
  const hyphenated = withoutThe.replace(/\s+/g, '-');
  if (MAP_NAME_TO_ID[hyphenated]) return MAP_NAME_TO_ID[hyphenated];

  // Kebab-case as fallback
  return key
    .replace(/^the\s+/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// ---------------------------------------------------------------------------
// Trigger parser
// ---------------------------------------------------------------------------

interface ParsedTrigger {
  type: string;
  map: string;
  position?: string;
  condition?: string;
}

function parseTrigger(raw: string, mapId: string, position?: string): ParsedTrigger {
  const lower = raw.toLowerCase();

  if (lower.includes('game start') || lower.includes('opening')) {
    return { type: 'auto', map: mapId, condition: 'game-start' };
  }
  if ((lower.includes('enters') && lower.includes('tile')) || lower.includes('approaches')) {
    return { type: 'area-enter', map: mapId, position, condition: undefined };
  }
  if (
    lower.includes('enters') &&
    (lower.includes('map') || lower.includes('workshop') || lower.includes('house'))
  ) {
    return {
      type: 'map-enter',
      map: mapId,
      condition: lower.includes('first') ? 'first-visit' : undefined,
    };
  }
  if (lower.includes('exits') || lower.includes('via')) {
    return { type: 'map-enter', map: mapId, condition: 'first-visit' };
  }
  if (lower.includes('quest') || lower.includes('after')) {
    const questMatch = raw.match(/MQ-\d+|SQ-\d+/);
    return { type: 'quest-state', map: mapId, position, condition: questMatch?.[0] ?? undefined };
  }
  if (lower.includes('talk') || lower.includes('speak')) {
    return { type: 'npc-talk', map: mapId };
  }
  if (lower.includes('cutscene')) {
    return { type: 'cutscene', map: mapId };
  }

  // Default: area-enter if we have position, map-enter otherwise
  return position
    ? { type: 'area-enter', map: mapId, position }
    : { type: 'map-enter', map: mapId };
}

// ---------------------------------------------------------------------------
// Section extractors
// ---------------------------------------------------------------------------

interface SceneSection {
  heading: string;
  sceneNumber: number;
  sceneName: string;
  body: string;
}

/** Split the act markdown into individual scene sections */
function splitIntoScenes(markdown: string): SceneSection[] {
  const scenes: SceneSection[] = [];
  const lines = markdown.split('\n');
  let currentScene: SceneSection | null = null;
  const bodyLines: string[] = [];

  for (const line of lines) {
    const sceneMatch = line.match(/^##\s+Scene\s+(\d+)\s*:\s*(.+)$/);
    if (sceneMatch) {
      // Save previous scene
      if (currentScene) {
        currentScene.body = bodyLines.join('\n');
        scenes.push(currentScene);
        bodyLines.length = 0;
      }
      currentScene = {
        heading: line,
        sceneNumber: parseInt(sceneMatch[1], 10),
        sceneName: sceneMatch[2].trim(),
        body: '',
      };
    } else if (currentScene) {
      bodyLines.push(line);
    }
  }

  // Save last scene
  if (currentScene) {
    currentScene.body = bodyLines.join('\n');
    scenes.push(currentScene);
  }

  return scenes;
}

/** Extract a **Bold Label**: Value from the scene body */
function extractField(body: string, label: string): string | undefined {
  const regex = new RegExp(`\\*\\*${label}\\*\\*\\s*:\\s*(.+)`, 'i');
  const match = body.match(regex);
  return match ? match[1].trim() : undefined;
}

/** Extract a ### subsection body from the scene body */
function extractSubsection(body: string, heading: string): string | undefined {
  const lines = body.split('\n');
  let capturing = false;
  let capturedLevel = 0;
  const captured: string[] = [];

  for (const line of lines) {
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = hMatch[2].trim().toLowerCase();
      if (text.includes(heading.toLowerCase())) {
        capturing = true;
        capturedLevel = level;
        continue;
      }
      if (capturing && level <= capturedLevel) {
        break;
      }
    }
    if (capturing) {
      captured.push(line);
    }
  }

  const result = captured.join('\n').trim();
  return result || undefined;
}

/** Known metadata labels and non-NPC bold patterns to exclude from NPC extraction */
const METADATA_LABELS = new Set([
  // Markdown metadata fields
  'location',
  'trigger',
  'characters',
  'time of day',
  'system',
  'player',
  'mechanic taught',
  'mechanics taught',
  'item received',
  'item',
  'companion gained',
  'companion lost',
  'vibrancy',
  'vibrancy change',
  'quest activated',
  'quest completed',
  'quest updated',
  'level',
  'xp gained',
  'gold gained',
  'fragment lost',
  'key item',
  'total fragments',
  'emotional arc',
  'estimated playtime',
  'scenes',
  'visual',
  'music',
  'text',
  'duration',
  // Conditional labels that appear in dialogue choices
  'if broken',
  'if preserved',
  'either way',
  // Descriptive labels that aren't characters
  'dissolved memory echoes',
  'dissolved memory echo',
  'frozen npcs',
  'ridgewalker npcs',
  'frontier settlement npcs',
  'frozen festival npcs',
]);

/** Check if a name looks like a real NPC name vs a descriptive phrase */
function isLikelyNpcName(name: string): boolean {
  const lower = name.toLowerCase();
  // Skip metadata labels
  if (METADATA_LABELS.has(lower)) return false;
  // Skip names with "the" prefix (usually descriptions like "The Light")
  if (lower.startsWith('the ') && !lower.startsWith('the ')) return false;
  // Skip names that are too descriptive (contain common non-name words)
  const descriptiveWords = ['every', 'all', 'each', 'multiple', 'various', 'npcs', 'npc'];
  if (descriptiveWords.some((w) => lower.includes(w))) return false;
  // Skip zone/location names being used as labels
  const locationWords = ['forest', 'wastes', 'peaks', 'marsh', 'ridge', 'fields', 'depths'];
  if (locationWords.some((w) => lower === w || lower.endsWith(` ${w}`))) return false;
  // Must have at least one capital letter (real names are capitalized)
  if (!/[A-Z]/.test(name)) return false;
  return true;
}

/** Extract NPC names from Characters field and dialogue */
function extractNpcs(body: string, characters?: string): Array<{ npcId: string; name: string }> {
  const npcs: Map<string, string> = new Map();

  // From Characters field — only real character names
  if (characters) {
    const names = characters
      .split(/,\s*/)
      .map((n) => n.trim())
      .filter((n) => {
        const lower = n.toLowerCase();
        return (
          lower !== 'player' &&
          !lower.includes('procedural') &&
          !lower.includes('(') &&
          n.length > 1 &&
          n.length < 40 &&
          isLikelyNpcName(n)
        );
      });
    for (const name of names) {
      const id = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      npcs.set(id, name);
    }
  }

  // From dialogue lines: **NpcName**: text
  // Only match lines that look like actual dialogue (speaker followed by dialogue text)
  const dialogueMatches = body.matchAll(/^\*\*([A-Z][a-zA-Z\s'-]+?)\*\*\s*(?:\(.*?\))?\s*:\s+\S/gm);
  for (const m of dialogueMatches) {
    const name = m[1].trim();
    if (!isLikelyNpcName(name)) continue;
    if (name.length > 30) continue;
    const id = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    if (!npcs.has(id)) {
      npcs.set(id, name);
    }
  }

  return Array.from(npcs.entries()).map(([npcId, name]) => ({ npcId, name }));
}

/** Extract system messages from > **SYSTEM**: lines */
function extractSystemMessages(body: string): string[] {
  const messages: string[] = [];
  const matches = body.matchAll(/>\s*\*\*SYSTEM(?:\s*[—–-]\s*[A-Z\s]+)?\*\*\s*:\s*(.+)/g);
  for (const m of matches) {
    messages.push(m[1].trim());
  }
  return messages;
}

/** Extract bullet list items from a subsection */
function extractBulletItems(section?: string): string[] {
  if (!section) return [];
  return section
    .split('\n')
    .filter((line) => line.match(/^\s*[-*]\s/))
    .map((line) => line.replace(/^\s*[-*]\s+/, '').trim());
}

/** Extract item references from rewards text */
function extractItemRefs(body: string): string[] {
  const items: string[] = [];
  // Match patterns like: MF-01, K-01, C-HP-01, W-DG-03
  const matches = body.matchAll(/\b([A-Z]{1,3}-[A-Z0-9]{1,3}(?:-\d+)?)\b/g);
  const seen = new Set<string>();
  for (const m of matches) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      items.push(m[1]);
    }
  }
  return items;
}

/** Extract quest references */
function extractQuestRefs(body: string): string[] {
  const quests: string[] = [];
  const matches = body.matchAll(/\b(MQ-\d+|SQ-\d+)\b/g);
  const seen = new Set<string>();
  for (const m of matches) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      quests.push(m[1]);
    }
  }
  return quests;
}

/** Extract effects from rewards/consequences */
function extractEffects(body: string): Array<{ type: string; params: Record<string, unknown> }> {
  const effects: Array<{ type: string; params: Record<string, unknown> }> = [];

  // System messages → system-message effects
  const sysMessages = extractSystemMessages(body);
  for (const msg of sysMessages) {
    effects.push({ type: 'system-message', params: { text: msg } });
  }

  // Item received patterns
  const itemGiveMatches = body.matchAll(/\*\*(?:Item received|Item)\*\*\s*:\s*(.+)/gi);
  for (const m of itemGiveMatches) {
    effects.push({ type: 'item-give', params: { description: m[1].trim() } });
  }

  // Companion gained
  const companionMatch = body.match(/\*\*Companion gained\*\*\s*:\s*(.+)/i);
  if (companionMatch) {
    const desc = companionMatch[1].trim();
    const nameMatch = desc.match(/^(\w+)/);
    effects.push({
      type: 'companion-join',
      params: { companionId: nameMatch?.[1].toLowerCase() ?? 'unknown', description: desc },
    });
  }

  // Companion lost
  const companionLeave = body.match(/\*\*Companion lost\*\*\s*:\s*(.+)/i);
  if (companionLeave) {
    effects.push({
      type: 'companion-leave',
      params: { description: companionLeave[1].trim() },
    });
  }

  // Vibrancy change
  const vibrancyMatch = body.match(/\*\*Vibrancy(?:\s+change)?\*\*\s*:\s*(.+)/i);
  if (vibrancyMatch) {
    effects.push({
      type: 'vibrancy-change',
      params: { description: vibrancyMatch[1].trim() },
    });
  }

  // Quest activated / completed / updated
  const questMatches = body.matchAll(/\*\*Quest (\w+)\*\*\s*:\s*(.+)/gi);
  for (const m of questMatches) {
    const action = m[1].toLowerCase();
    effects.push({
      type: 'quest-update',
      params: { action, description: m[2].trim() },
    });
  }

  // Look for "joins the party" in dialogue
  const joinMatches = body.matchAll(/(\w+)\s+joins the party.*?(?:\(([^)]+)\))?/gi);
  for (const m of joinMatches) {
    if (
      !effects.some(
        (e) => e.type === 'companion-join' && e.params.companionId === m[1].toLowerCase(),
      )
    ) {
      effects.push({
        type: 'companion-join',
        params: { companionId: m[1].toLowerCase(), class: m[2] ?? undefined },
      });
    }
  }

  return effects;
}

/** Build quest changes from the body text */
function extractQuestChanges(body: string): Array<{ questId: string; action: string }> {
  const changes: Array<{ questId: string; action: string }> = [];
  const seen = new Set<string>();

  // Quest activated
  const activated = body.matchAll(
    /\*\*Quest activated\*\*\s*:\s*.*?"([^"]*)".*?\((MQ-\d+|SQ-\d+)\)/gi,
  );
  for (const m of activated) {
    const key = `${m[2]}-activate`;
    if (!seen.has(key)) {
      seen.add(key);
      changes.push({ questId: m[2], action: 'activate' });
    }
  }

  // Quest completed
  const completed = body.matchAll(
    /\*\*Quest completed\*\*\s*:\s*.*?"([^"]*)".*?\((MQ-\d+|SQ-\d+)\)/gi,
  );
  for (const m of completed) {
    const key = `${m[2]}-complete`;
    if (!seen.has(key)) {
      seen.add(key);
      changes.push({ questId: m[2], action: 'complete' });
    }
  }

  // Generic quest update mentions
  const questRefs = body.matchAll(/(MQ-\d+|SQ-\d+)/g);
  for (const m of questRefs) {
    // Only add if not already tracked
    const existingActions = changes.filter((c) => c.questId === m[1]);
    if (existingActions.length === 0 && !seen.has(`${m[1]}-ref`)) {
      seen.add(`${m[1]}-ref`);
      // Don't add — this is just a reference, not a change
    }
  }

  return changes;
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export interface ParseResult {
  act: string;
  scenes: SceneDdl[];
  warnings: string[];
}

/**
 * Parse an act script markdown file into scene DDL entries.
 *
 * @param markdownPath - Path to docs/story/act{N}-script.md
 * @param actNumber - Act number (1, 2, or 3)
 */
export function parseActScript(markdownPath: string, actNumber: number): ParseResult {
  const markdown = readFileSync(markdownPath, 'utf-8');
  const actId = `act${actNumber}` as 'act1' | 'act2' | 'act3';
  const sections = splitIntoScenes(markdown);
  const warnings: string[] = [];
  const scenes: SceneDdl[] = [];

  for (const section of sections) {
    const { sceneNumber, sceneName, body } = section;

    // Extract metadata fields
    const locationRaw = extractField(body, 'Location');
    const triggerRaw = extractField(body, 'Trigger');
    const charactersRaw = extractField(body, 'Characters');
    const timeOfDay = extractField(body, 'Time of day');

    // Parse location
    const location = locationRaw
      ? parseLocation(locationRaw)
      : {
          mapId: 'unknown',
          subLocation: undefined,
          spawnPosition: undefined,
          rawMapName: 'unknown',
        };

    if (location.mapId === 'unknown') {
      warnings.push(`Scene ${sceneNumber}: Could not resolve map ID from "${locationRaw}"`);
    }

    // Parse trigger
    const trigger = triggerRaw
      ? parseTrigger(triggerRaw, location.mapId, location.spawnPosition)
      : { type: 'auto', map: location.mapId };

    // Extract subsections
    const narrativeContext = extractSubsection(body, 'Narrative Context');
    const playerActionsSection = extractSubsection(body, 'Player Actions');
    const tutorialSection = extractSubsection(body, 'Tutorial Integration');
    const _rewardsSection = extractSubsection(body, 'Rewards');

    // Extract NPCs
    const npcs = extractNpcs(body, charactersRaw).map((npc) => ({
      ...npc,
      graphic: `npc_${npc.npcId.replace(/-/g, '_')}`,
      position: '0,0', // Placeholder — needs manual positioning
      movement: 'static' as const,
      dialogueRef: `dlg-${npc.npcId}-scene${sceneNumber}`,
    }));

    // Extract player instructions
    const playerInstructions = extractBulletItems(playerActionsSection);

    // Extract mechanic taught
    const mechanicTaught = tutorialSection
      ? extractField(tutorialSection, 'Mechanic(?:s)? taught')
      : undefined;

    // Extract effects and quest changes
    const effects = extractEffects(body);
    const questChanges = extractQuestChanges(body);

    // Extract cross-DDL pointers
    const questRefs = extractQuestRefs(body);
    const itemRefs = extractItemRefs(body);

    // Build scene ID
    const sceneSlug = sceneName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40);
    const id = `${actId}-scene${sceneNumber}-${sceneSlug}`;

    // Build summary from narrative context (first sentence or paragraph)
    const summary = narrativeContext
      ? narrativeContext
          .split('\n\n')[0]
          .replace(/^#+.*\n/, '')
          .trim()
          .slice(0, 200)
      : `Scene ${sceneNumber} of ${actId}: ${sceneName}`;

    // Level range from existing patterns or estimate
    const levelRange = estimateLevelRange(actNumber, sceneNumber);

    const scene: SceneDdl = {
      id,
      act: actId,
      sceneNumber,
      name: sceneName,
      summary,

      mapId: location.mapId,
      subLocation: location.subLocation,
      spawnPosition: location.spawnPosition,

      trigger: trigger as any,

      // Map contributions — empty, filled during scene building
      assemblages: [],
      paths: [],
      visuals: [],

      npcs,
      events: [],
      resonanceStones: [],
      treasureChests: [],

      effects,
      questChanges: questChanges as any,

      dialogueRefs: npcs.map((n) => n.dialogueRef!).filter(Boolean),
      questRefs: questRefs.length > 0 ? questRefs : undefined,
      itemRefs: itemRefs.length > 0 ? itemRefs : undefined,

      prerequisites: sceneNumber > 1 ? buildPrerequisites(actNumber, sceneNumber) : undefined,
      testCriteria: buildTestCriteria(questChanges, effects),
      playerInstructions: playerInstructions.length > 0 ? playerInstructions : undefined,

      narrativeContext: narrativeContext?.replace(/^#+.*\n/, '').trim(),
      timeOfDay,
      emotionalBeat: undefined, // Could be extracted from overview
      mechanicTaught,

      targetPath: `main/server/events/${actId}/scene${sceneNumber}-${sceneSlug}.ts`,
      levelRange,
    };

    scenes.push(scene);
  }

  return { act: actId, scenes, warnings };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function estimateLevelRange(act: number, scene: number): string {
  if (act === 1) {
    if (scene <= 2) return '1';
    if (scene <= 4) return '1-2';
    if (scene <= 6) return '2-5';
    if (scene <= 8) return '5-7';
    if (scene <= 10) return '7-9';
    return '9-10';
  }
  if (act === 2) {
    if (scene <= 3) return '10-12';
    if (scene <= 8) return '12-15';
    if (scene <= 14) return '15-18';
    return '18-20';
  }
  // Act 3
  if (scene <= 4) return '20-22';
  if (scene <= 8) return '22-25';
  return '25-30';
}

function buildPrerequisites(
  act: number,
  scene: number,
): { questFlags?: string[]; party?: string[]; level?: number } | undefined {
  // Basic prerequisite estimation based on act/scene progression
  if (act === 1) {
    if (scene >= 4) return { questFlags: ['MQ-01'], party: ['hana'] };
    if (scene >= 3) return { questFlags: ['MQ-01'] };
  }
  if (act === 2) {
    return { questFlags: ['MQ-04'], level: 10 };
  }
  if (act === 3) {
    return { questFlags: ['MQ-06'], level: 20 };
  }
  return undefined;
}

function buildTestCriteria(
  questChanges: Array<{ questId: string; action: string }>,
  effects: Array<{ type: string; params: Record<string, unknown> }>,
): { questFlags?: string[]; inventory?: string[] } | undefined {
  const flags = questChanges
    .filter((q) => q.action === 'activate' || q.action === 'complete')
    .map((q) => q.questId);

  const items = effects
    .filter((e) => e.type === 'item-give' && e.params.itemId)
    .map((e) => String(e.params.itemId));

  if (flags.length === 0 && items.length === 0) return undefined;

  return {
    questFlags: flags.length > 0 ? flags : undefined,
    inventory: items.length > 0 ? items : undefined,
  };
}
