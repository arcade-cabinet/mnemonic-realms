/** Builds SFX manifest from DDL data. */

import type { SfxAsset, SfxManifest } from '../schemas/index';
import { loadSfxEntries } from './ddl-loader';
import { timestamp } from './manifest-io';

export function buildSfxManifest(): SfxManifest {
  console.log('Building SFX manifest...');
  const entries = loadSfxEntries();
  const assets: SfxAsset[] = [];

  for (const sfx of entries) {
    assets.push({
      id: sfx.id,
      name: sfx.name,
      category: sfx.category,
      description: sfx.description,
      durationSec: sfx.durationSec,
      looping: sfx.looping ?? false,
      filename: `${sfx.id.toLowerCase()}.ogg`,
      status: 'pending',
    });
  }

  console.log(`  Total SFX assets: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'SFX generation manifest — Freesound samples',
    updatedAt: timestamp(),
    assets,
  };
}
