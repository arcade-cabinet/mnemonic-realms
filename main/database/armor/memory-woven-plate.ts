import { Armor } from '@rpgjs/database';

// Special Effect: DEF scales with total fragments broadcast (+1 DEF per 3 broadcasts, max +10).
// Tier: 3
@Armor({
  id: 'A-14',
  name: 'Memory-Woven Plate',
  description:
    'Plate armor woven with echoes of forgotten memories. Its defense strengthens with each fragment broadcast.',
  pdef: 35,
})
export default class MemoryWovenPlate {
  // Stat modifiers applied via @Armor decorator
}
