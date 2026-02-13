/** Hash utilities and regeneration detection for idempotent pipeline. */

import { createHash } from 'node:crypto';
import type { GenerationMetadata, GenerationStatus } from './common-generation';

export function hashPrompt(prompt: string): string {
  return createHash('sha256').update(prompt).digest('hex').slice(0, 16);
}

export function hashFile(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

const MIN_VALID_FILE_BYTES = 1024;

/** Check if a TypeScript/code file appears truncated. */
export function isCodeTruncated(content: string): boolean {
  const trimmed = content.trimEnd();
  if (trimmed.length === 0) return true;

  // Strip trailing single-line comments (Gemini sometimes adds explanations)
  const lines = trimmed.split('\n');
  let lastCodeIdx = lines.length - 1;
  while (lastCodeIdx > 0 && lines[lastCodeIdx].trim().startsWith('//')) {
    lastCodeIdx--;
  }
  const codeOnly = lines
    .slice(0, lastCodeIdx + 1)
    .join('\n')
    .trimEnd();
  if (codeOnly.length === 0) return true;

  // Valid TS files end with `}`, `export default ...`, or a closing statement
  const lastLine = codeOnly.split('\n').pop()?.trim() ?? '';
  const endsWell =
    lastLine.endsWith('}') || lastLine.endsWith(';') || lastLine.startsWith('export default');
  if (!endsWell) return true;

  // Check balanced braces in code only
  let depth = 0;
  for (const ch of codeOnly) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
  }
  return depth !== 0;
}

export function needsRegeneration(
  status: GenerationStatus,
  metadata: GenerationMetadata | undefined,
  currentPromptHash: string,
  fileExists: boolean,
  fileData?: Buffer,
): boolean {
  if (status === 'pending' || status === 'failed' || !metadata) return true;
  if (!fileExists) return true;
  if (fileData && fileData.length < MIN_VALID_FILE_BYTES) return true;
  // Detect truncated code files
  if (fileData) {
    // Content-based truncation detection for code files
    const content = fileData.toString('utf-8');
    if (content.includes('import') && content.includes('@') && isCodeTruncated(content)) {
      return true;
    }
  }
  if (metadata.promptHash !== currentPromptHash) return true;
  if (fileData && metadata.outputHash) {
    const currentFileHash = hashFile(fileData);
    if (currentFileHash !== metadata.outputHash) return true;
  }
  return false;
}
