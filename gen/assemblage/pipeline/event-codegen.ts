import type { MapCanvas } from './canvas.ts';

/**
 * Generate TypeScript event files from a composed MapCanvas.
 *
 * Produces two files matching the existing RPG-JS pattern:
 * 1. Map class file (e.g., everwick.ts) — minimal, references TMX + events
 * 2. Events file (e.g., everwick-events.ts) — spawnMapEvents() with all NPCs and events
 */
export function generateMapClass(mapId: string, _tileSize: number): string {
  const className = toClassName(mapId);
  return `import { MapData, RpgMap, type RpgPlayer } from '@rpgjs/server';
import { spawnMapEvents } from './events/${mapId}-events';

@MapData({
  id: '${mapId}',
  file: require('./tmx/${mapId}.tmx'),
})
export class ${className}Map extends RpgMap {
  override onJoin(player: RpgPlayer) {
    spawnMapEvents(player, this);
  }
}
`;
}

/**
 * Generate the events file from canvas objects and hooks.
 */
export function generateEventsFile(_mapId: string, canvas: MapCanvas, tileSize: number): string {
  const lines: string[] = [];

  // Collect imports from hooks
  const imports = new Map<string, Set<string>>();
  imports.set('@rpgjs/server', new Set(['EventData', 'RpgEvent', 'type RpgMap', 'type RpgPlayer']));

  // Check if any NPC uses the dialogue system
  const hasDialogueNpcs = canvas.objects.some(
    (o) => o.type === 'npc' && (o.properties?.dialogueId || o.properties?.dialogue),
  );
  if (hasDialogueNpcs) {
    imports.set('../../systems/npc-interaction', new Set(['showDialogue']));
  }

  // Add hook imports
  for (const hook of canvas.hooks) {
    if (hook.importPath) {
      const existing = imports.get(hook.importPath) ?? new Set();
      existing.add(hook.eventClass);
      imports.set(hook.importPath, existing);
    }
  }

  // Emit imports
  for (const [path, names] of imports) {
    const sorted = [...names].sort();
    lines.push(`import { ${sorted.join(', ')} } from '${path}';`);
  }

  lines.push('');

  // Emit NPC factory (always needed if we have NPCs)
  const npcs = canvas.objects.filter((o) => o.type === 'npc');
  const events = canvas.objects.filter((o) => o.type !== 'npc' && o.type !== 'spawn');
  const hasNpcs = npcs.length > 0;
  const hasEvents = events.length > 0;

  if (hasNpcs) {
    lines.push(NPC_FACTORY);
    lines.push('');
  }
  if (hasEvents) {
    lines.push(EVENT_FACTORY);
    lines.push('');
  }

  // Emit spawnMapEvents
  lines.push(`export function spawnMapEvents(_player: RpgPlayer, map: RpgMap) {`);

  // NPCs
  if (hasNpcs) {
    lines.push('  // --- NPCs ---');
    lines.push('  map.createDynamicEvent([');
    for (const npc of npcs) {
      const px = npc.x * tileSize;
      const py = npc.y * tileSize;
      const graphic =
        npc.properties?.sprite ?? npc.properties?.graphic ?? `npc_${npc.name.replace(/-/g, '_')}`;
      const dialogueId = npc.properties?.dialogueId ?? npc.properties?.dialogue;

      lines.push(`    {`);
      lines.push(`      x: ${px},`);
      lines.push(`      y: ${py},`);

      if (dialogueId) {
        lines.push(
          `      event: makeNpc('${npc.name}', '${graphic}', (p) => showDialogue(p, '${dialogueId}')),`,
        );
      } else {
        const text = npc.properties?.text ?? `${npc.name} has nothing to say.`;
        lines.push(
          `      event: makeNpc('${npc.name}', '${graphic}', (p) => p.showText('${escapeTs(String(text))}')),`,
        );
      }

      lines.push(`    },`);
    }
    lines.push('  ]);');
    lines.push('');
  }

  // Events
  if (hasEvents) {
    lines.push('  // --- Events ---');
    lines.push('  map.createDynamicEvent([');
    for (const evt of events) {
      const px = evt.x * tileSize;
      const py = evt.y * tileSize;
      const hookDef = canvas.hooks.find((h) => h.objectName === evt.name);

      lines.push(`    {`);
      lines.push(`      x: ${px},`);
      lines.push(`      y: ${py},`);

      if (evt.type === 'transition') {
        const targetMap =
          evt.properties?.map ??
          evt.properties?.targetMap ??
          evt.properties?.targetWorld ??
          evt.properties?.targetRegion ??
          'unknown';
        const targetX = evt.properties?.x ?? evt.properties?.targetX ?? 0;
        const targetY = evt.properties?.y ?? evt.properties?.targetY ?? 0;
        lines.push(`      event: makeEvent('${evt.name}', (p) => {`);
        lines.push(
          `        p.changeMap('${targetMap}', { x: ${Number(targetX) * tileSize}, y: ${Number(targetY) * tileSize} });`,
        );
        lines.push(`      }),`);
      } else if (hookDef?.importPath) {
        // Use imported event class
        lines.push(`      event: ${hookDef.eventClass},`);
      } else if (hookDef?.config) {
        // Generate inline behavior
        lines.push(`      event: makeEvent('${evt.name}', (p) => {`);
        generateInlineBehavior(lines, hookDef.config, 8);
        lines.push(`      }),`);
      } else {
        // Default: show text
        const text = evt.properties?.text ?? `You examine the ${evt.name}.`;
        lines.push(`      event: makeEvent('${evt.name}', (p) => {`);
        lines.push(`        p.showText('${escapeTs(String(text))}');`);
        lines.push(`      }),`);
      }

      lines.push(`    },`);
    }
    lines.push('  ]);');
  }

  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// --- Helpers ---

const NPC_FACTORY = `function makeNpc(id: string, graphic: string, action: (player: RpgPlayer) => void | Promise<void>) {
  @EventData({ name: id, hitbox: { width: 16, height: 16 } })
  class Npc extends RpgEvent {
    onInit() {
      this.setGraphic(graphic);
    }
    async onAction(player: RpgPlayer) {
      await action(player);
    }
  }
  return Npc;
}`;

const EVENT_FACTORY = `function makeEvent(id: string, action: (player: RpgPlayer) => void | Promise<void>) {
  @EventData({ name: id, hitbox: { width: 16, height: 16 } })
  class Evt extends RpgEvent {
    onInit() {}
    async onAction(player: RpgPlayer) {
      await action(player);
    }
  }
  return Evt;
}`;

function generateInlineBehavior(
  lines: string[],
  config: Record<string, unknown>,
  indent: number,
): void {
  const pad = ' '.repeat(indent);
  if (config.condition && config.trueText && config.falseText) {
    lines.push(`${pad}if (p.getVariable('${config.condition}')) {`);
    lines.push(`${pad}  p.showText('${escapeTs(String(config.trueText))}');`);
    if (config.setVariable) {
      lines.push(`${pad}  p.setVariable('${config.setVariable}', true);`);
    }
    lines.push(`${pad}} else {`);
    lines.push(`${pad}  p.showText('${escapeTs(String(config.falseText))}');`);
    lines.push(`${pad}}`);
  } else if (config.text) {
    lines.push(`${pad}p.showText('${escapeTs(String(config.text))}');`);
  }
}

function toClassName(mapId: string): string {
  return mapId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

function escapeTs(str: string): string {
  return str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
}
