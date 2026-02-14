#!/usr/bin/env npx tsx
/** Asset integration — thin wrapper around cli-integrate. */

import { runIntegrate } from '../cli-integrate';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const targets = args.filter((a) => !a.startsWith('--'));

console.log('Mnemonic Realms — Asset Integration\n');
await runIntegrate(targets.length ? targets : ['all'], dryRun);
