/**
 * SFX file map — maps SFX IDs to .ogg filenames in assets/audio/sfx/.
 *
 * Filenames follow the manifest convention from gen/manifests/audio/sfx/.
 * Files are sourced from Freesound via the audio generation pipeline.
 */

export type SfxId =
  | 'SFX-UI-01'
  | 'SFX-UI-02'
  | 'SFX-UI-03'
  | 'SFX-UI-04'
  | 'SFX-UI-05'
  | 'SFX-UI-06'
  | 'SFX-UI-07'
  | 'SFX-UI-08'
  | 'SFX-CBT-01'
  | 'SFX-CBT-02'
  | 'SFX-CBT-03'
  | 'SFX-CBT-04'
  | 'SFX-CBT-05'
  | 'SFX-CBT-06'
  | 'SFX-CBT-07'
  | 'SFX-CBT-08'
  | 'SFX-CBT-09'
  | 'SFX-CBT-10'
  | 'SFX-CBT-11'
  | 'SFX-CBT-12'
  | 'SFX-MEM-01'
  | 'SFX-MEM-02'
  | 'SFX-MEM-03'
  | 'SFX-MEM-04'
  | 'SFX-MEM-05'
  | 'SFX-MEM-06'
  | 'SFX-ENV-01'
  | 'SFX-ENV-02'
  | 'SFX-ENV-03'
  | 'SFX-ENV-04'
  | 'SFX-ENV-05'
  | 'SFX-ENV-06';

export const SFX_FILES: Record<SfxId, string> = {
  // UI
  'SFX-UI-01': 'sfx-ui-01.ogg',
  'SFX-UI-02': 'sfx-ui-02.ogg',
  'SFX-UI-03': 'sfx-ui-03.ogg',
  'SFX-UI-04': 'sfx-ui-04.ogg',
  'SFX-UI-05': 'sfx-ui-05.ogg',
  'SFX-UI-06': 'sfx-ui-06.ogg',
  'SFX-UI-07': 'sfx-ui-07.ogg',
  'SFX-UI-08': 'sfx-ui-08.ogg',
  // Combat
  'SFX-CBT-01': 'sfx-cbt-01.ogg',
  'SFX-CBT-02': 'sfx-cbt-02.ogg',
  'SFX-CBT-03': 'sfx-cbt-03.ogg',
  'SFX-CBT-04': 'sfx-cbt-04.ogg',
  'SFX-CBT-05': 'sfx-cbt-05.ogg',
  'SFX-CBT-06': 'sfx-cbt-06.ogg',
  'SFX-CBT-07': 'sfx-cbt-07.ogg',
  'SFX-CBT-08': 'sfx-cbt-08.ogg',
  'SFX-CBT-09': 'sfx-cbt-09.ogg',
  'SFX-CBT-10': 'sfx-cbt-10.ogg',
  'SFX-CBT-11': 'sfx-cbt-11.ogg',
  'SFX-CBT-12': 'sfx-cbt-12.ogg',
  // Memory
  'SFX-MEM-01': 'sfx-mem-01.ogg',
  'SFX-MEM-02': 'sfx-mem-02.ogg',
  'SFX-MEM-03': 'sfx-mem-03.ogg',
  'SFX-MEM-04': 'sfx-mem-04.ogg',
  'SFX-MEM-05': 'sfx-mem-05.ogg',
  'SFX-MEM-06': 'sfx-mem-06.ogg',
  // Environment
  'SFX-ENV-01': 'sfx-env-01.ogg',
  'SFX-ENV-02': 'sfx-env-02.ogg',
  'SFX-ENV-03': 'sfx-env-03.ogg',
  'SFX-ENV-04': 'sfx-env-04.ogg',
  'SFX-ENV-05': 'sfx-env-05.ogg',
  'SFX-ENV-06': 'sfx-env-06.ogg',
};
