import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-06',
  name: 'Stone Crab',
  description:
    'Flat, wide crabs with shells made of river-polished stone. They skitter along the riverbanks with surprising speed for their bulk. When threatened, they snap their massive pincers — the crack is audible across the map. Their shells are covered in small Resonance Stone chips that glint in the light.',
  parameters: {
    maxhp: { start: 60, end: 60 },
    str: { start: 10, end: 10 },
    int: { start: 2, end: 2 },
    dex: { start: 12, end: 12 },
    agi: { start: 5, end: 5 },
  },
  gain: {
    exp: 40,
    gold: 18,
    // items: [
    //   { nb: 1, item: FortifyTonic, chance: 0.10 }, // C-SC-03
    //   { nb: 1, item: MinorPotion, chance: 0.15 },  // C-HP-01
    // ]
  },
})
export default class StoneCrab {
  // Context:
  // - Zone: Millbrook
  // - Category: settled
  // - Fragment affinity: Calm / Water
  // Abilities:
  // - Pincer Snap: ATK * 1.4 (10% chance Weakness (DEF -30%, 3 turns))
  // - Shell Hunker: DEF +50% for 1 turn (Used when hit 2+ times prev round)
  // Drop table:
  // - C-SC-03 (Fortify Tonic): 10% chance
  // - C-HP-01 (Minor Potion): 15% chance
}
