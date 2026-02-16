/**
 * Generates silent placeholder BGM stems.
 *
 * Creates minimal WAV files that the audio engine can load without errors.
 * Replace these with real production stems from Suno/Udio or commissioned audio.
 *
 * Usage: npx tsx scripts/generate-placeholder-bgm.ts
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT_DIR = resolve(import.meta.dirname ?? '.', '../assets/audio/bgm');
mkdirSync(OUT_DIR, { recursive: true });

// All BGM IDs and their stem counts from the audio spec
const BGM_STEMS: Record<string, number> = {
  'bgm-vh': 4, 'bgm-hf': 4, 'bgm-ag': 4, 'bgm-mb': 4,
  'bgm-sr': 4, 'bgm-sm': 4, 'bgm-hr': 4, 'bgm-fv': 4,
  'bgm-rf': 4, 'bgm-lw': 4, 'bgm-up': 4, 'bgm-hdf': 4,
  'bgm-dep': 4, 'bgm-sl4': 4, 'bgm-dm5': 4, 'bgm-pf': 4,
  'bgm-btl': 4, 'bgm-boss': 4, 'bgm-pvb': 4,
  'bgm-title': 1, 'bgm-gameover': 1, 'bgm-victory': 1,
  'bgm-levelup': 1, 'bgm-recall': 1, 'bgm-bloom': 1, 'bgm-credits': 1,
};

/** Create a minimal WAV file (44-byte header + 1 second of silence at 22050Hz mono). */
function createSilentWav(): Buffer {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const duration = 1;
  const dataSize = sampleRate * numChannels * (bitsPerSample / 8) * duration;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  // silence is already zeroed
  return buffer;
}

function main() {
  console.log('Generating placeholder BGM stems...\n');
  const wav = createSilentWav();
  let count = 0;

  for (const [bgmId, stemCount] of Object.entries(BGM_STEMS)) {
    for (let i = 1; i <= stemCount; i++) {
      // Use .ogg extension even though it's WAV — Web Audio decodeAudioData handles both
      const filename = `${bgmId}-layer${i}.ogg`;
      const outFile = resolve(OUT_DIR, filename);
      if (existsSync(outFile)) continue;
      writeFileSync(outFile, wav);
      count++;
    }
  }

  console.log(`  Generated ${count} placeholder stems`);
  console.log(`  Location: ${OUT_DIR}`);
  console.log('\nReplace with real OGG stems from Suno/Udio or commissioned audio.');
}

main();
