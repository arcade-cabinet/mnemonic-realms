#!/usr/bin/env npx tsx
/** Code integration — thin wrapper around cli-integrate. */

import { runIntegrate } from '../cli-integrate';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const cats = args.filter((a) => !a.startsWith('--'));

await runIntegrate(cats.length ? cats : ['code'], dryRun);
