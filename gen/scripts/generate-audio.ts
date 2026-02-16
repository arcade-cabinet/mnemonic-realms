#!/usr/bin/env npx tsx
/** Audio generation — standalone script for BGM and ambient synthesis. */

import { runAudioBatch } from '../generators/audio-batch-runner';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const idxFlag = args.indexOf('--index');
const index = idxFlag >= 0 ? Number(args[idxFlag + 1]) : undefined;
const targets = args.filter((a, i) => !a.startsWith('--') && (idxFlag < 0 || i !== idxFlag + 1));

const target = targets[0] || 'all';

await runAudioBatch(target, index, dryRun);
