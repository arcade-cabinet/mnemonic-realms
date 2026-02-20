export type { EntityDescriptor, EntityType, LoadedMap } from './loader.js';
export { loadMapData } from './loader.js';
export { spawnEntities } from './spawner.js';
export type {
  TransitionEntity,
  TransitionPhase,
  TransitionResult,
  TransitionState,
  TransitionTarget,
  TransitionType,
} from './transition.js';
export {
  beginTransition,
  completeTransition,
  createTransitionState,
  findTransitionAtPosition,
  getSpawnPosition,
  onMapLoaded,
  updateCrossfade,
} from './transition.js';
