/** CLI build subcommand — generates manifest JSON files. */

import {
  buildAmbientManifest,
  buildArmorCodeManifest,
  buildBgmManifest,
  buildClassCodeManifest,
  buildConsumableCodeManifest,
  buildDialogueCodeManifest,
  buildEnemyCodeManifest,
  buildMapCodeManifest,
  buildQuestCodeManifest,
  buildSceneCodeManifest,
  buildSfxManifest,
  buildSkillCodeManifest,
  buildStateCodeManifest,
  buildWeaponCodeManifest,
  writeManifest,
} from './builders/index';

const AUDIO_TARGETS: Record<string, () => unknown> = {
  sfx: buildSfxManifest,
  bgm: buildBgmManifest,
  ambient: buildAmbientManifest,
};

const CODE_TARGETS: Record<string, () => unknown> = {
  weapons: buildWeaponCodeManifest,
  armor: buildArmorCodeManifest,
  consumables: buildConsumableCodeManifest,
  skills: buildSkillCodeManifest,
  enemies: buildEnemyCodeManifest,
  classes: buildClassCodeManifest,
  states: buildStateCodeManifest,
  maps: buildMapCodeManifest,
  scenes: buildSceneCodeManifest,
  quests: buildQuestCodeManifest,
  dialogue: buildDialogueCodeManifest,
};

export function runBuild(targets: string[]): void {
  const all = targets.length === 0 || targets.includes('all');
  const code = all || targets.includes('code');
  const audio = all || targets.includes('audio');

  for (const [name, builder] of Object.entries(AUDIO_TARGETS)) {
    if (audio || targets.includes(name)) writeManifest(`audio/${name}`, builder());
  }
  for (const [name, builder] of Object.entries(CODE_TARGETS)) {
    if (code || targets.includes(name)) writeManifest(`code/${name}`, builder());
  }
}
