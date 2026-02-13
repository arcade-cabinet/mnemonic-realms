import { Armor } from '@rpgjs/database';

// Tier: 3
@Armor({
  id: 'A-10',
  name: "Preserver's Crystal Mail",
  description:
    'A mail crafted from resonant crystals, offering robust defense and protection against temporal distortions.',
  pdef: 30,
  statesDefense: ['stasis'],
})
export default class PreserversCrystalMail {}
