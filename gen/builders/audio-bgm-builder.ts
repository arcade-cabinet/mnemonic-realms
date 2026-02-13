/** Builds BGM manifest from DDL data. */

import type { BgmAsset, BgmManifest, BgmStem } from '../schemas/index';
import { loadBgmEntries } from './ddl-loader';
import { timestamp } from './manifest-io';

function stemFilename(bgmId: string, layer: number): string {
  return `${bgmId.toLowerCase()}-layer${layer}.ogg`;
}

export function buildBgmManifest(): BgmManifest {
  console.log('Building BGM manifest...');
  const entries = loadBgmEntries();
  const assets: BgmAsset[] = [];

  for (const bgm of entries) {
    const stems: BgmStem[] = bgm.stems.map((s) => ({
      layer: s.layer,
      instruments: s.instruments,
      description: s.description,
      filename: stemFilename(bgm.id, s.layer),
    }));

    assets.push({
      id: bgm.id,
      name: bgm.name,
      type: bgm.type as BgmAsset['type'],
      zone: bgm.zone,
      tempo: bgm.tempo,
      key: bgm.key,
      timeSignature: bgm.timeSignature,
      mood: bgm.mood as BgmAsset['mood'],
      durationSec: bgm.durationSec,
      stems,
      status: 'pending',
    });
  }

  console.log(`  Total BGM assets: ${assets.length}`);
  const stemCount = assets.reduce((n, a) => n + a.stems.length, 0);
  console.log(`  Total BGM stems: ${stemCount}`);
  return {
    schemaVersion: '1.0.0',
    description: 'BGM generation manifest — multi-layer stems',
    updatedAt: timestamp(),
    assets,
  };
}
