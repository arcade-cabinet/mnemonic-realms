/**
 * Runtime JSON Serializer — MapCanvas → RuntimeMapData
 *
 * Converts a composed MapCanvas into the JSON format consumed by
 * the MnemonicEngine at load time. Unlike the TMX serializer, this
 * preserves semantic tile references (e.g., 'terrain:grass') rather
 * than resolving to numeric GIDs. GID resolution happens at runtime.
 *
 * Output is written to data/maps/{mapId}.json by the CLI emit-runtime command.
 */

import type { MapCanvas } from './canvas.ts';
import type {
  RuntimeMapData,
  RuntimeSpawnPoint,
  RuntimeTransition,
  RuntimeVibrancyArea,
} from './runtime-types.ts';

/**
 * Serialize a composed MapCanvas to runtime JSON format.
 *
 * Extracts spawn points and transitions from the objects array
 * for quick engine lookup, while keeping the full objects array
 * for event system wiring.
 */
export function serializeToRuntime(canvas: MapCanvas, mapId?: string): RuntimeMapData {
  // Copy layers as plain arrays
  const layers: Record<string, (string | 0)[]> = {};
  for (const layerName of canvas.layerOrder) {
    const semanticLayer = canvas.layers.get(layerName)!;
    layers[layerName] = [...semanticLayer];
  }

  // Extract spawn points from objects
  const spawnPoints: RuntimeSpawnPoint[] = canvas.objects
    .filter((o) => o.type === 'spawn')
    .map((o) => ({
      id: o.name,
      x: o.x,
      y: o.y,
    }));

  // Extract transitions from objects
  const transitions: RuntimeTransition[] = canvas.objects
    .filter((o) => o.type === 'transition')
    .map((o) => ({
      id: o.name,
      x: o.x,
      y: o.y,
      width: o.width ?? 1,
      height: o.height ?? 1,
      target: String(o.properties?.targetWorld ?? o.properties?.targetRegion ?? ''),
      type: String(o.properties?.transitionType ?? 'door'),
      ...(o.properties ? { properties: { ...o.properties } } : {}),
    }));

  // Extract vibrancy areas from trigger objects with vibrancy properties
  const vibrancyAreas: RuntimeVibrancyArea[] = canvas.objects
    .filter((o) => o.type === 'trigger' && o.properties?.vibrancyArea)
    .map((o) => ({
      id: o.name,
      x: o.x,
      y: o.y,
      width: o.width ?? 1,
      height: o.height ?? 1,
      initialState:
        (o.properties?.vibrancyState as 'forgotten' | 'partial' | 'remembered') ?? 'remembered',
      ...(o.properties?.unlockQuest ? { unlockQuest: String(o.properties.unlockQuest) } : {}),
    }));

  return {
    ...(mapId ? { id: mapId } : {}),
    width: canvas.width,
    height: canvas.height,
    tileWidth: canvas.tileWidth,
    tileHeight: canvas.tileHeight,
    layerOrder: [...canvas.layerOrder],
    layers,
    collision: [...canvas.collision],
    visuals: canvas.visuals.map((v) => ({
      objectRef: v.objectRef,
      x: v.x,
      y: v.y,
    })),
    objects: canvas.objects.map((o) => ({ ...o })),
    hooks: canvas.hooks.map((h) => ({ ...h })),
    spawnPoints,
    transitions,
    vibrancyAreas,
  };
}

export type { RuntimeMapData };
