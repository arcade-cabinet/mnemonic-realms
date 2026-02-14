import type { RpgPlayer } from '@rpgjs/server';
import classData from '../../../gen/ddl/classes/all.json';

const MAX_LEVEL = 35;

const STAT_KEYS = ['hp', 'sp', 'atk', 'int', 'def', 'agi'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface ClassGrowth {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface StatDef {
  base: number;
  growthRate: number;
}

function getClassGrowth(classId: string): Record<StatKey, StatDef> | undefined {
  const cls = (classData as ClassGrowth[]).find((c) => c.id === classId);
  if (!cls) return undefined;

  const growth = {} as Record<StatKey, StatDef>;
  for (const stat of STAT_KEYS) {
    const def = cls[stat] as StatDef | undefined;
    if (!def) return undefined;
    growth[stat] = def;
  }
  return growth;
}

/**
 * Calculate a stat value at a given level.
 * Formula: floor(base + growthRate * (level - 1))
 */
function calcStat(def: StatDef, level: number): number {
  return Math.floor(def.base + def.growthRate * (level - 1));
}

/**
 * Total XP required to reach a given level.
 * Level 1 requires 0 XP. Uses quadratic curve: floor(50 * (level-1) * level).
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(50 * (level - 1) * level);
}

/**
 * Initialize progression variables for a player at level 1.
 * Call after the player's class has been set.
 */
export function initProgression(player: RpgPlayer): void {
  const classId = player.class?.id;
  if (!classId) return;

  player.setVariable('PLAYER_LEVEL', 1);
  player.setVariable('PLAYER_XP', 0);
  applyStatGrowth(player, classId, 1);
}

/**
 * Add XP to a player. Handles multi-level-ups if XP is large.
 * Returns the number of levels gained (0 if none).
 */
export function addXP(player: RpgPlayer, amount: number): number {
  const classId = player.class?.id;
  if (!classId) return 0;

  const currentLevel = (player.getVariable('PLAYER_LEVEL') as number) || 1;
  if (currentLevel >= MAX_LEVEL) return 0;

  const currentXP = (player.getVariable('PLAYER_XP') as number) || 0;
  const newXP = currentXP + amount;
  player.setVariable('PLAYER_XP', newXP);

  let level = currentLevel;
  while (level < MAX_LEVEL && newXP >= xpForLevel(level + 1)) {
    level++;
  }

  const levelsGained = level - currentLevel;
  if (levelsGained > 0) {
    player.setVariable('PLAYER_LEVEL', level);
    applyStatGrowth(player, classId, level);
  }

  return levelsGained;
}

/**
 * Compute and store stats for the given class and level.
 */
function applyStatGrowth(player: RpgPlayer, classId: string, level: number): void {
  const growth = getClassGrowth(classId);
  if (!growth) return;

  for (const stat of STAT_KEYS) {
    const value = calcStat(growth[stat], level);
    player.setVariable(`PLAYER_${stat.toUpperCase()}`, value);
  }
}

/**
 * Read the player's current progression state.
 */
export function getProgression(player: RpgPlayer) {
  return {
    level: (player.getVariable('PLAYER_LEVEL') as number) || 1,
    xp: (player.getVariable('PLAYER_XP') as number) || 0,
    hp: (player.getVariable('PLAYER_HP') as number) || 0,
    sp: (player.getVariable('PLAYER_SP') as number) || 0,
    atk: (player.getVariable('PLAYER_ATK') as number) || 0,
    int: (player.getVariable('PLAYER_INT') as number) || 0,
    def: (player.getVariable('PLAYER_DEF') as number) || 0,
    agi: (player.getVariable('PLAYER_AGI') as number) || 0,
  };
}

/**
 * Get the XP still needed to reach the next level, or 0 if at max.
 */
export function xpToNextLevel(player: RpgPlayer): number {
  const level = (player.getVariable('PLAYER_LEVEL') as number) || 1;
  if (level >= MAX_LEVEL) return 0;
  const currentXP = (player.getVariable('PLAYER_XP') as number) || 0;
  return xpForLevel(level + 1) - currentXP;
}
