/** Processes a single code generation entry: idempotency, prompt assembly, generation. */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { GoogleGenAI } from '@google/genai';
import type { CodeGenEntry } from '../schemas/codegen';
import type { GenerationMetadata } from '../schemas/common';
import { hashFile, hashPrompt, isCodeTruncated, needsRegeneration } from '../schemas/common';
import { assembleFullPrompt } from './prompt-assembly';
import { generateText } from './text-gen';

export interface CodeProcessResult {
  status: 'skipped' | 'generated' | 'failed';
  metadata?: GenerationMetadata;
  error?: string;
}

export async function processCodeEntry(
  ai: GoogleGenAI,
  entry: CodeGenEntry,
  outputDir: string,
  systemPrompt: string,
  dryRun: boolean,
  model: string,
  dirtyIds?: Set<string>,
): Promise<CodeProcessResult> {
  const outputPath = resolve(outputDir, entry.filename);
  const fileExists = existsSync(outputPath);
  const fileData = fileExists ? readFileSync(outputPath) : undefined;
  const fullPrompt = assembleFullPrompt(entry.prompt, entry.docRefs);
  const currentHash = hashPrompt(fullPrompt);

  const forcedDirty = dirtyIds?.has(entry.id) ?? false;
  if (
    !forcedDirty &&
    !needsRegeneration(entry.status, entry.metadata, currentHash, fileExists, fileData)
  ) {
    return { status: 'skipped' };
  }

  if (dryRun) {
    console.log(`  [DRY RUN] Would generate: ${entry.id} → ${entry.filename}`);
    return { status: 'skipped' };
  }

  console.log(`  Generating: ${entry.id} [${model}]...`);
  const start = Date.now();

  try {
    const code = await generateText(ai, systemPrompt, fullPrompt, model);

    if (isCodeTruncated(code)) {
      const elapsed = Date.now() - start;
      console.error(`    Truncated output (${code.length} chars, ${elapsed}ms) — marking failed`);
      return {
        status: 'failed',
        error: 'Truncated output: unbalanced braces or missing closing statement',
      };
    }

    const codeBuffer = Buffer.from(code, 'utf-8');

    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, code, 'utf-8');

    const elapsed = Date.now() - start;
    console.log(`    Done (${elapsed}ms, ${code.length} chars)`);
    return {
      status: 'generated',
      metadata: {
        promptHash: currentHash,
        outputHash: hashFile(codeBuffer),
        generatedAt: new Date().toISOString(),
        generationTimeMs: elapsed,
        fileSizeBytes: codeBuffer.length,
        model,
      },
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`    Failed: ${error}`);
    return { status: 'failed', error };
  }
}
