import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-L2',
  name: 'Shared Valor',
  description: 'Upgraded Remembered Valor with DEF buff and oath sharing.',
  spCost: 22,
  power: 0, // This skill provides buffs, not direct damage or healing.
  hitRate: 1, // Buffs typically have a 100% success rate.
  coefficient: { int: 1 }, // Support skills often scale with INT, even if the buff values are fixed.
})
export default class SharedValor {
  // Formula: All allies gain ATK +20% and DEF +15% for 3 turns.
  // Additionally, one chosen ally receives one of the Knight's active oath bonuses (+2% ATK, +2% DEF) for the duration.
  // The oath is shared, not transferred — the Knight retains the bonus.
}
