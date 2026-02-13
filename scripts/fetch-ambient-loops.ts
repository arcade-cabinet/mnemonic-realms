/** Fetches CC0 ambient loops from Freesound.org API. Requires FREESOUND_API_KEY. */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const API_KEY = process.env.FREESOUND_API_KEY;
if (!API_KEY) {
  console.error('FREESOUND_API_KEY not set. Use: doppler run --project gha --config ci -- npx tsx scripts/fetch-ambient-loops.ts');
  process.exit(1);
}

const OUT_DIR = resolve(import.meta.dirname ?? '.', '../assets/audio/ambient');
mkdirSync(OUT_DIR, { recursive: true });

interface FreesoundResult {
  results: Array<{
    id: number;
    name: string;
    previews: { 'preview-hq-ogg': string };
    license: string;
    username: string;
  }>;
}

const AMBIENT_QUERIES: Record<string, string> = {
  village: 'village ambience birdsong',
  grassland: 'wind field nature ambient',
  forest: 'forest ambience birds leaves',
  mountain: 'mountain wind howling',
  riverside: 'river flowing water',
  wetland: 'swamp frogs wetland',
  plains: 'wind open ambient nature',
  dungeon: 'cave dripping echo',
  sketch: 'pencil scratching paper quiet',
  stagnation: 'wind chime glass crystal',
};

async function searchAndDownload(biome: string, query: string): Promise<void> {
  const outFile = resolve(OUT_DIR, `amb-${biome}.ogg`);
  if (existsSync(outFile)) {
    console.log(`  [skip] ${biome} — already exists`);
    return;
  }

  const params = new URLSearchParams({
    query,
    filter: 'duration:[5 TO 60] license:"Creative Commons 0"',
    fields: 'id,name,previews,license,username',
    page_size: '1',
    token: API_KEY!,
  });
  const url = `https://freesound.org/apiv2/search/text/?${params}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  [error] ${biome}: Freesound search failed (${res.status})`);
    return;
  }

  const data = (await res.json()) as FreesoundResult;
  if (!data.results?.length) {
    console.warn(`  [warn] ${biome}: no results for "${query}"`);
    return;
  }

  const sound = data.results[0];
  const previewUrl = sound.previews['preview-hq-ogg'];
  if (!previewUrl) {
    console.warn(`  [warn] ${biome}: no OGG preview`);
    return;
  }

  console.log(`  ${biome}: downloading "${sound.name}" by ${sound.username} (${sound.license})`);
  const audioRes = await fetch(previewUrl);
  if (!audioRes.ok) {
    console.error(`  [error] ${biome}: download failed`);
    return;
  }

  const buffer = Buffer.from(await audioRes.arrayBuffer());
  writeFileSync(outFile, buffer);
  console.log(`  ${biome}: saved to ${outFile} (${buffer.length} bytes)`);
}

async function main() {
  console.log('Fetching ambient loops from Freesound.org...\n');

  for (const [biome, query] of Object.entries(AMBIENT_QUERIES)) {
    await searchAndDownload(biome, query);
  }

  console.log('\nDone!');
}

main().catch(console.error);
