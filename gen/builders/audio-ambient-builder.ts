/** Builds ambient loop manifest from DDL data. */

import type { AmbientAsset, AmbientManifest } from '../schemas/index';
import { loadAmbientEntries } from './ddl-loader';
import { timestamp } from './manifest-io';

export function buildAmbientManifest(): AmbientManifest {
  console.log('Building ambient loop manifest...');
  const entries = loadAmbientEntries();
  const assets: AmbientAsset[] = [];

  for (const amb of entries) {
    assets.push({
      id: amb.id,
      name: amb.name,
      biome: amb.biome as AmbientAsset['biome'],
      description: amb.description,
      sourceQuery: amb.sourceQuery,
      defaultVolume: amb.defaultVolume,
      mutedDesc: amb.mutedDesc,
      vividDesc: amb.vividDesc,
      filename: `${amb.id.toLowerCase()}.ogg`,
      status: 'pending',
    });
  }

  console.log(`  Total ambient assets: ${assets.length}`);
  return {
    schemaVersion: '1.0.0',
    description: 'Ambient loop manifest',
    updatedAt: timestamp(),
    assets,
  };
}
