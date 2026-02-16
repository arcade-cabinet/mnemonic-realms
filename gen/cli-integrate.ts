/** CLI integrate subcommand — post-processes and copies to main/. */

import { integrateAudio } from './integrators/audio-integrator';
import { integrateCode } from './integrators/code-integrator';

export async function runIntegrate(targets: string[], dryRun: boolean): Promise<void> {
  const all = targets.length === 0 || targets.includes('all');
  const code = all || targets.includes('code');
  const audio = all || targets.includes('audio');
  let total = 0;

  if (audio || targets.includes('bgm') || targets.includes('ambient')) {
    total += await integrateAudio(targets, dryRun);
  }

  if (
    code ||
    targets.some((t) =>
      [
        'weapons',
        'armor',
        'consumables',
        'skills',
        'enemies',
        'classes',
        'states',
        'maps',
        'scenes',
        'quests',
        'dialogue',
      ].includes(t),
    )
  ) {
    const cats = code ? ['all'] : targets.filter((t) => !['all', 'audio'].includes(t));
    await integrateCode(cats, dryRun);
  }

  console.log(`\n${total} audio assets ${dryRun ? 'would be' : ''} processed.`);
}
