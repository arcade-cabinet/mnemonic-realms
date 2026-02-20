/**
 * AIPlayerConfig factories for different playtest strategies.
 */

import type { AIPlayerConfig } from '../../../engine/testing/ai-player.js';
import type { LoadedMap } from '../../../engine/world/loader.js';
import type { QuestChain } from '../../../engine/testing/behaviors/quest-following.js';
import { completionistStrategy } from '../../../engine/testing/strategies/completionist.js';
import { speedrunStrategy } from '../../../engine/testing/strategies/speedrun.js';
import { sideQuestFocusStrategy } from '../../../engine/testing/strategies/side-quest-focus.js';
import type { World } from 'koota';

function makeConfig(
  world: World,
  map: LoadedMap,
  strategy: typeof completionistStrategy,
  questChains?: QuestChain[],
): AIPlayerConfig {
  return {
    strategy,
    world,
    collisionGrid: map.collision,
    mapWidth: map.width,
    mapData: map,
    questChains,
  };
}

export function completionistConfig(
  world: World,
  map: LoadedMap,
  questChains?: QuestChain[],
): AIPlayerConfig {
  return makeConfig(world, map, completionistStrategy, questChains);
}

export function speedrunConfig(
  world: World,
  map: LoadedMap,
  questChains?: QuestChain[],
): AIPlayerConfig {
  return makeConfig(world, map, speedrunStrategy, questChains);
}

export function sideQuestConfig(
  world: World,
  map: LoadedMap,
  questChains?: QuestChain[],
): AIPlayerConfig {
  return makeConfig(world, map, sideQuestFocusStrategy, questChains);
}

