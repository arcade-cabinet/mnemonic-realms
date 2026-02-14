/** Processes a single code generation entry: idempotency, prompt assembly, generation. */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { GoogleGenAI } from '@google/genai';
import type { CodeGenEntry } from '../schemas/codegen';
import type { GenerationMetadata } from '../schemas/common';
import { hashFile, hashPrompt, isCodeTruncated, needsRegeneration } from '../schemas/common';
import { assembleFullPrompt } from './prompt-assembly';
import { generateText } from './text-gen';

/** Check if XML/TMX output is truncated (missing closing tags). */
function isXmlTruncated(content: string): boolean {
  const trimmed = content.trim();
  if (trimmed.length === 0) return true;

  // Strip markdown code fences if present
  const xml = trimmed
    .replace(/^```xml?\n?/i, '')
    .replace(/\n?```$/i, '')
    .trim();
  if (xml.length === 0) return true;

  // Must start with <?xml or <map and end with </map>
  const hasMapClose = xml.endsWith('</map>');
  if (!hasMapClose) return true;

  // Basic tag balance check: count opening/closing tags
  const openTags = (xml.match(/<(?!\/|!|\?)[a-z][^>]*[^/]>/gi) || []).length;
  const selfCloseTags = (xml.match(/<[a-z][^>]*\/>/gi) || []).length;
  const closeTags = (xml.match(/<\/[a-z][^>]*>/gi) || []).length;
  // Self-closing tags are balanced by definition; open tags need a close tag
  return openTags > closeTags + 2; // Allow small margin for XML declarations etc
}

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
  // TMX files get .gen suffix in gen/output/ to avoid RPG-JS build scanner
  // (its globFiles('tmx') scans **/*.tmx from project root)
  const outputFilename = entry.filename.endsWith('.tmx') ? `${entry.filename}.gen` : entry.filename;
  const outputPath = resolve(outputDir, outputFilename);
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
    // TMX maps need much higher token limits for tile data arrays
    const isTmx = entry.filename.endsWith('.tmx');
    const tokenLimit = isTmx ? 65536 : 16384;
    const code = await generateText(ai, systemPrompt, fullPrompt, model, tokenLimit);

    // TMX files are XML — skip brace-balance check, use tag-balance instead
    const truncated = isTmx ? isXmlTruncated(code) : isCodeTruncated(code);

    if (truncated) {
      const elapsed = Date.now() - start;
      console.error(`    Truncated output (${code.length} chars, ${elapsed}ms) — marking failed`);

      // Write failed output for debugging (suffixed with .failed)
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(`${outputPath}.failed`, code, 'utf-8');

      return {
        status: 'failed',
        error: isTmx
          ? 'Truncated output: unclosed XML tags or missing </map>'
          : 'Truncated output: unbalanced braces or missing closing statement',
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
