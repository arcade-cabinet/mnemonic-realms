import type { RpgPlayer } from '@rpgjs/server';
import { getSubclassBranch } from './memory';

// ---------------------------------------------------------------------------
// DDL Skill Data — loaded at import time from gen/ddl/skills/*.json
// ---------------------------------------------------------------------------

import clericBase from '../../../gen/ddl/skills/cleric-base.json';
import clericSubclass from '../../../gen/ddl/skills/cleric-subclass.json';
import knightBase from '../../../gen/ddl/skills/knight-base.json';
import knightSubclass from '../../../gen/ddl/skills/knight-subclass.json';
import mageBase from '../../../gen/ddl/skills/mage-base.json';
import mageSubclass from '../../../gen/ddl/skills/mage-subclass.json';
import rogueBase from '../../../gen/ddl/skills/rogue-base.json';
import rogueSubclass from '../../../gen/ddl/skills/rogue-subclass.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkillDef {
  id: string;
  name: string;
  classId: string;
  level: number;
  spCost: number;
  target: string;
  element: string;
  formula: string;
  description: string;
  isPassive: boolean;
  isSubclass: boolean;
  subclassPath: string;
}

// ---------------------------------------------------------------------------
// Skill Registry — all 44 skills indexed by ID and class
// ---------------------------------------------------------------------------

const ALL_SKILLS: SkillDef[] = [
  ...(knightBase as SkillDef[]),
  ...(knightSubclass as SkillDef[]),
  ...(mageBase as SkillDef[]),
  ...(mageSubclass as SkillDef[]),
  ...(clericBase as SkillDef[]),
  ...(clericSubclass as SkillDef[]),
  ...(rogueBase as SkillDef[]),
  ...(rogueSubclass as SkillDef[]),
];

const skillById = new Map<string, SkillDef>(ALL_SKILLS.map((s) => [s.id, s]));

/** Base skills (not subclass) grouped by classId, sorted by level ascending. */
const baseSkillsByClass = new Map<string, SkillDef[]>();
/** Subclass skills grouped by classId + subclassPath. */
const subclassSkillsByClassAndPath = new Map<string, SkillDef[]>();

for (const skill of ALL_SKILLS) {
  if (!skill.isSubclass) {
    const list = baseSkillsByClass.get(skill.classId) ?? [];
    list.push(skill);
    baseSkillsByClass.set(skill.classId, list);
  } else {
    const key = `${skill.classId}:${skill.subclassPath}`;
    const list = subclassSkillsByClassAndPath.get(key) ?? [];
    list.push(skill);
    subclassSkillsByClassAndPath.set(key, list);
  }
}

// Sort base skills by level for efficient lookup
for (const list of baseSkillsByClass.values()) {
  list.sort((a, b) => a.level - b.level);
}

// ---------------------------------------------------------------------------
// Player variable key
// ---------------------------------------------------------------------------

const PLAYER_SKILLS_KEY = 'PLAYER_SKILLS';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getLearnedSkillIds(player: RpgPlayer): string[] {
  return (player.getVariable(PLAYER_SKILLS_KEY) as string[] | undefined) ?? [];
}

function setLearnedSkillIds(player: RpgPlayer, ids: string[]): void {
  player.setVariable(PLAYER_SKILLS_KEY, ids);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Look up a skill definition by ID.
 */
export function getSkillDef(skillId: string): SkillDef | undefined {
  return skillById.get(skillId);
}

/**
 * Get all skill definitions (all 44 skills).
 */
export function getAllSkills(): readonly SkillDef[] {
  return ALL_SKILLS;
}

/**
 * Check for newly available skills based on the player's current level and class.
 * Grants any base skills whose level requirement is met but not yet learned.
 * Also grants subclass skills if the player has unlocked a subclass branch.
 *
 * Returns the list of newly learned skill IDs (empty if none).
 */
export function checkSkillUnlocks(player: RpgPlayer): string[] {
  const classId = player.getVariable('PLAYER_CLASS_ID') as string | undefined;
  if (!classId) return [];

  const level = (player.getVariable('PLAYER_LEVEL') as number) || 1;
  const learned = getLearnedSkillIds(player);
  const learnedSet = new Set(learned);
  const newSkills: string[] = [];

  // Check base skills for level-up unlocks
  const baseSkills = baseSkillsByClass.get(classId) ?? [];
  for (const skill of baseSkills) {
    if (skill.level <= level && !learnedSet.has(skill.id)) {
      newSkills.push(skill.id);
      learnedSet.add(skill.id);
    }
  }

  // Check subclass skills (unlock all at once when branch is chosen)
  const branch = getSubclassBranch(player);
  if (branch) {
    const subSkills = subclassSkillsByClassAndPath.get(`${classId}:${branch}`) ?? [];
    for (const skill of subSkills) {
      if (!learnedSet.has(skill.id)) {
        newSkills.push(skill.id);
        learnedSet.add(skill.id);
      }
    }
  }

  if (newSkills.length > 0) {
    setLearnedSkillIds(player, [...learned, ...newSkills]);

    // Emit event for UI notification
    const newSkillDefs = newSkills.map((id) => skillById.get(id)).filter(Boolean);
    player.emit('skills-learned', { skills: newSkillDefs });
  }

  return newSkills;
}

/**
 * Return all learned skill definitions for this player.
 */
export function getPlayerSkills(player: RpgPlayer): SkillDef[] {
  return getLearnedSkillIds(player)
    .map((id) => skillById.get(id))
    .filter((s): s is SkillDef => s !== undefined);
}

/**
 * Check whether the player has learned a specific skill.
 */
export function hasSkill(player: RpgPlayer, skillId: string): boolean {
  return getLearnedSkillIds(player).includes(skillId);
}

/**
 * Get the base skills available for a given class (all levels).
 */
export function getBaseSkillsForClass(classId: string): readonly SkillDef[] {
  return baseSkillsByClass.get(classId) ?? [];
}

/**
 * Get the subclass skills for a given class and branch.
 */
export function getSubclassSkills(classId: string, branch: string): readonly SkillDef[] {
  return subclassSkillsByClassAndPath.get(`${classId}:${branch}`) ?? [];
}
