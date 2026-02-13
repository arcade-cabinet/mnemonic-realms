/** CLI build subcommand — generates manifest JSON files. */

import {
  buildAmbientManifest,
  buildArmorCodeManifest,
  buildBgmManifest,
  buildClassCodeManifest,
  buildConsumableCodeManifest,
  buildDialogueCodeManifest,
  buildEnemyCodeManifest,
  buildItemIconManifest,
  buildMapCodeManifest,
  buildPortraitManifest,
  buildQuestCodeManifest,
  buildSceneCodeManifest,
  buildSfxManifest,
  buildSkillCodeManifest,
  buildSpritesheetManifest,
  buildStateCodeManifest,
  buildTilesetManifest,
  buildUIElementManifest,
  buildWeaponCodeManifest,
  writeManifest,
} from './builders/index';

const IMAGE_TARGETS: Record<string, () => unknown> = {
  tilesets: buildTilesetManifest,
  sprites: buildSpritesheetManifest,
  portraits: buildPortraitManifest,
  items: buildItemIconManifest,
  ui: buildUIElementManifest,
};

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

  for (const [name, builder] of Object.entries(IMAGE_TARGETS)) {
    if (all || targets.includes(name)) writeManifest(name, builder());
  }
  for (const [name, builder] of Object.entries(AUDIO_TARGETS)) {
    if (audio || targets.includes(name)) writeManifest(`audio/${name}`, builder());
  }
  for (const [name, builder] of Object.entries(CODE_TARGETS)) {
    if (code || targets.includes(name)) writeManifest(`code/${name}`, builder());
  }
}
