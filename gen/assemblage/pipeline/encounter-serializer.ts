/**
 * Encounter Serializer — DDL encounters → Runtime encounter JSON
 *
 * Converts DDL encounter definitions into the runtime JSON format
 * consumed by the MnemonicEngine's encounter system.
 *
 * Output is written to data/encounters/{regionId}.json.
 */

import type { EncounterDdl, EncounterPoolDdl } from '../../schemas/ddl-encounters.ts';
import type {
  RuntimeEncounter,
  RuntimeEncounterEnemy,
  RuntimeEncounterPool,
} from './runtime-types.ts';

/**
 * Serialize a single DDL encounter to runtime format.
 */
export function serializeEncounter(encounter: EncounterDdl): RuntimeEncounter {
  const enemies: RuntimeEncounterEnemy[] = encounter.enemies.map((e) => ({
    enemyId: e.enemyId,
    count: e.count,
    position: e.position ?? 'front',
  }));

  return {
    id: encounter.id,
    name: encounter.name,
    type: encounter.type,
    enemies,
    ...(encounter.background ? { background: encounter.background } : {}),
    ...(encounter.music ? { music: encounter.music } : {}),
    ...(encounter.chain ? { chainNext: encounter.chain.next } : {}),
    rewards: encounter.rewards ?? { xp: 0, gold: 0 },
    escapeAllowed: encounter.escapeAllowed,
  };
}

/**
 * Serialize a DDL encounter pool to runtime format.
 */
export function serializeEncounterPool(
  pool: EncounterPoolDdl,
  encounters: EncounterDdl[],
): { pool: RuntimeEncounterPool; encounters: RuntimeEncounter[] } {
  const runtimeEncounters = encounters
    .filter((e) => pool.encounters.includes(e.id))
    .map(serializeEncounter);

  const runtimePool: RuntimeEncounterPool = {
    regionId: pool.regionId,
    encounters: pool.encounters,
    stepsBetween: pool.stepsBetween,
    levelRange: pool.levelRange,
  };

  return { pool: runtimePool, encounters: runtimeEncounters };
}

/**
 * Resolve an encounter chain by following chain.next links.
 *
 * Given a starting encounter ID, follows the chain to produce
 * an ordered sequence of encounter IDs. Handles missing encounters
 * gracefully by terminating the chain.
 *
 * @returns Array of encounter IDs in chain order, starting with the given ID.
 */
export function resolveEncounterChain(
  encounterId: string,
  encounters: Map<string, EncounterDdl>,
): string[] {
  const chain: string[] = [];
  const visited = new Set<string>();
  let currentId: string | undefined = encounterId;

  while (currentId) {
    // Guard against cycles
    if (visited.has(currentId)) {
      break;
    }

    const encounter = encounters.get(currentId);
    if (!encounter) {
      // If the first encounter doesn't exist, return empty chain
      // If a later encounter doesn't exist, terminate gracefully
      break;
    }

    chain.push(currentId);
    visited.add(currentId);
    currentId = encounter.chain?.next;
  }

  return chain;
}

/**
 * Select a random encounter from a pool using uniform random distribution.
 *
 * @returns The selected encounter ID, or undefined if the pool is empty.
 */
export function selectRandomEncounter(pool: RuntimeEncounterPool): string | undefined {
  if (pool.encounters.length === 0) {
    return undefined;
  }
  const index = Math.floor(Math.random() * pool.encounters.length);
  return pool.encounters[index];
}
