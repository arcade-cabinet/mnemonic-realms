#!/usr/bin/env npx tsx
/** Code generation — thin wrapper around cli-generate. */

import { runGenerate } from '../cli-generate';
import { runStatus } from '../cli-status';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const idxFlag = args.indexOf('--index');
const index = idxFlag >= 0 ? Number(args[idxFlag + 1]) : undefined;
const modelFlag = args.indexOf('--model');
const model = modelFlag >= 0 ? args[modelFlag + 1] : undefined;
const positional = args.filter(
  (a, i) => !a.startsWith('--') && ![idxFlag + 1, modelFlag + 1].includes(i),
);
const target = positional[0] || 'all';

if (target === 'status') {
  runStatus();
} else {
  await runGenerate({ targets: [target], dryRun, index, model });
}
