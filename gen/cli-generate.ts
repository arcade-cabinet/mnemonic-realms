/** CLI generate subcommand — runs image, code, and audio generation. */

import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { runAudioBatch } from './generators/audio-batch-runner';
import { runCodeBatch } from './generators/code-batch-runner';
import { runBatch, runTrial } from './generators/index';

export interface GenerateOpts {
  targets: string[];
  dryRun: boolean;
  index?: number;
  model?: string;
}

function getAi(dryRun: boolean): GoogleGenAI | null {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (key && !dryRun) return new GoogleGenAI({ apiKey: key });
  if (!dryRun) console.warn('No API key set. Running dry-run.\n');
  return null;
}

const IMAGE_CATS = ['tilesets', 'sprites', 'portraits', 'items', 'ui'];
const CODE_CATS = ['weapons', 'armor', 'consumables', 'skills', 'enemies', 'classes', 'states', 'maps', 'scenes', 'quests', 'dialogue'];
const AUDIO_CATS = ['bgm', 'ambient'];

export async function runGenerate(opts: GenerateOpts): Promise<void> {
  const { targets, dryRun, index, model } = opts;
  const all = targets.length === 0 || targets.includes('all');
  const images = all || targets.includes('images');
  const code = all || targets.includes('code');
  const audio = all || targets.includes('audio');
  const ai = getAi(dryRun);

  if (targets.includes('trial')) {
    await runTrial(ai, dryRun);
    return;
  }

  if (images || targets.some((t) => IMAGE_CATS.includes(t))) {
    const specificCat = targets.find((t) => IMAGE_CATS.includes(t));
    const cat = specificCat || 'all';
    await runBatch(ai, cat, index, dryRun, model);
  }

  if (code || targets.some((t) => CODE_CATS.includes(t))) {
    const specificCat = targets.find((t) => CODE_CATS.includes(t));
    const cat = specificCat || 'all';
    await runCodeBatch(ai, cat, index, dryRun || !ai, model);
  }

  if (audio || targets.some((t) => AUDIO_CATS.includes(t))) {
    const specificCat = targets.find((t) => AUDIO_CATS.includes(t));
    const cat = specificCat || 'all';
    await runAudioBatch(cat, index, dryRun);
  }
}
