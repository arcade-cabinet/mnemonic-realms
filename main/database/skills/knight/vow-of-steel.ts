import { Skill } from '@rpgjs/database';

@Skill({
  id: 'SK-KN-03',
  name: 'Vow of Steel',
  description: 'Defensive stance with DEF boost. Disables flee.',
  spCost: 12,
  power: 0, // This is a buff skill, not a direct damage or healing skill.
  hitRate: 1, // Self-buffs always hit.
  coefficient: {}, // This skill's potency (DEF +40%) does not scale with any character stat.
})
export default class VowOfSteel {
  // Formula: Self DEF +40% for 3 turns. Cannot flee.
  // This effect would typically be implemented by applying a State that modifies DEF and restricts actions.
}
