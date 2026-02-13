#!/usr/bin/env npx tsx
/** Manifest builder — thin wrapper around cli-build. */

import { runBuild } from '../cli-build';

console.log('Mnemonic Realms — Manifest Builder\n');
runBuild(process.argv.slice(2));
console.log('\nDone.');
