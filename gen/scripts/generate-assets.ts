#!/usr/bin/env npx tsx
/** Image generation — thin wrapper around cli-generate. */

import { runGenerate } from '../cli-generate';
import { runStatus } from '../cli-status';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const modelIdx = args.indexOf('--model');
const model = modelIdx >= 0 ? args[modelIdx + 1] : undefined;
const targets = args.filter((a, i) => !a.startsWith('--') && (modelIdx < 0 || i !== modelIdx + 1));

if (targets.length === 0 || targets[0] === 'status') {
  runStatus();
} else {
  await runGenerate({ targets, dryRun, model });
}
