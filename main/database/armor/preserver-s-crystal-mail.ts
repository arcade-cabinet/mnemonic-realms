import { Armor } from '@rpgjs/database';

// Special Effect: +20% DEF. Immune to Stasis.
// Tier: 3
@Armor({
  id: 'A-10',
  name: "Preserver's Crystal Mail",
  description:
    'A mail crafted from resonant crystals, offering robust defense and protection against temporal distortions.',
  pdef: 30,
  statesDefense: ['stasis'], // Assuming 'stasis' is the ID for the Stasis state
})
export default class PreserversCrystalMail {}
