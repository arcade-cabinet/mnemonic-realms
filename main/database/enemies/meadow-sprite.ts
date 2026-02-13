import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-01',
  name: 'Meadow Sprite',
  description:
    "Tiny luminous creatures that float above the wheat fields, trailing wisps of golden pollen. They're not aggressive — they attack only when provoked (player walks into them) or cornered. They're memories of summer given form, and they giggle when they dodge.",
  parameters: {
    maxhp: { start: 30, end: 30 },
    str: { start: 5, end: 5 },
    int: { start: 3, end: 3 },
    dex: { start: 3, end: 3 },
    agi: { start: 8, end: 8 },
  },
  gain: {
    exp: 18,
    gold: 8,
  },
})
export default class MeadowSprite {}
