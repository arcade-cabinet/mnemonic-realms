import { State } from '@rpgjs/database';

@State({
  id: 'ST-VOW-STEEL',
  name: 'Vow of Steel',
  description: 'Defense is greatly increased. Cannot flee from battle.',
  paramsModifier: {
    dex: { rate: 0.4 }, // DEF +40% (dex typically represents defense in RPG-JS)
  },
  // Note: 'Cannot flee' is not a built-in Effect enum value.
  // This effect would need to be implemented via custom game logic.
})
export default class VowOfSteel {
  // Duration: 3 turns (managed by game logic, not the decorator)
  // Stackable: false (not a decorator property)
}
