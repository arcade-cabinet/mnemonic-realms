import { Enemy } from '@rpgjs/database';

@Enemy({
  id: 'E-SL-03',
  name: 'Forest Wisp',
  description:
    "Ethereal spheres of pale blue-green light that drift between the trees. They're fragments of the Dissolved Choir's music given visible form — each one hums a faint note. They attack with concentrated sound-light bolts. When defeated, they pop like soap bubbles and leave a fading chord.",
  parameters: {
    maxhp: { start: 35, end: 35 },
    str: { start: 3, end: 3 },
    int: { start: 10, end: 10 },
    dex: { start: 4, end: 4 },
    agi: { start: 12, end: 12 },
  },
  gain: {
    exp: 30,
    gold: 14,
  },
})
export default class ForestWisp {}
