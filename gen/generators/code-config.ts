/** Code generation configuration: manifest paths and output directories. */

import { resolve } from 'node:path';
import type { ManifestInfo } from './model-config';
import { MANIFESTS_DIR, OUTPUT_DIR } from './model-config';

export const CODE_OUTPUT_DIR = resolve(OUTPUT_DIR, 'code');

export const CODE_MANIFEST_MAP: Record<string, ManifestInfo> = {
  weapons: {
    type: 'code/weapons',
    path: resolve(MANIFESTS_DIR, 'code/weapons/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'weapons'),
  },
  armor: {
    type: 'code/armor',
    path: resolve(MANIFESTS_DIR, 'code/armor/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'armor'),
  },
  consumables: {
    type: 'code/consumables',
    path: resolve(MANIFESTS_DIR, 'code/consumables/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'consumables'),
  },
  skills: {
    type: 'code/skills',
    path: resolve(MANIFESTS_DIR, 'code/skills/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'skills'),
  },
  enemies: {
    type: 'code/enemies',
    path: resolve(MANIFESTS_DIR, 'code/enemies/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'enemies'),
  },
  classes: {
    type: 'code/classes',
    path: resolve(MANIFESTS_DIR, 'code/classes/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'classes'),
  },
  states: {
    type: 'code/states',
    path: resolve(MANIFESTS_DIR, 'code/states/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'states'),
  },
  maps: {
    type: 'code/maps',
    path: resolve(MANIFESTS_DIR, 'code/maps/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'maps'),
  },
  scenes: {
    type: 'code/scenes',
    path: resolve(MANIFESTS_DIR, 'code/scenes/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'scenes'),
  },
  quests: {
    type: 'code/quests',
    path: resolve(MANIFESTS_DIR, 'code/quests/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'quests'),
  },
  dialogue: {
    type: 'code/dialogue',
    path: resolve(MANIFESTS_DIR, 'code/dialogue/manifest.json'),
    outputDir: resolve(CODE_OUTPUT_DIR, 'dialogue'),
  },
};
