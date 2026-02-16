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

/** Strip block comments and single-line comments from code for brace analysis. */
function stripComments(code: string): string {
  let result = '';
  let i = 0;
  let inString: string | null = null;
  let inTemplate = false;

  while (i < code.length) {
    // Handle string/template literal boundaries (don't strip "comments" inside strings)
    if (!inString && !inTemplate && code[i] === '`') {
      inTemplate = true;
      result += code[i++];
      continue;
    }
    if (inTemplate && code[i] === '`' && code[i - 1] !== '\\') {
      inTemplate = false;
      result += code[i++];
      continue;
    }
    if (inTemplate) {
      result += code[i++];
      continue;
    }
    if (!inString && (code[i] === "'" || code[i] === '"')) {
      inString = code[i];
      result += code[i++];
      continue;
    }
    if (inString && code[i] === inString && code[i - 1] !== '\\') {
      inString = null;
      result += code[i++];
      continue;
    }
    if (inString) {
      result += code[i++];
      continue;
    }

    // Block comment: /* ... */
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      i = end === -1 ? code.length : end + 2;
      continue;
    }
    // Single-line comment: // ...
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i + 2);
      i = end === -1 ? code.length : end + 1;
      continue;
    }

    result += code[i++];
  }
  return result;
}

/** Check if a TypeScript/code file appears truncated. */
export function isCodeTruncated(content: string): boolean {
  const trimmed = content.trimEnd();
  if (trimmed.length === 0) return true;

  // Iteratively strip trailing comments (Gemini adds // lines and /* */ blocks after code)
  let lines = trimmed.split('\n');
  let changed = true;
  while (changed) {
    changed = false;
    // Strip trailing single-line comments and empty lines
    while (lines.length > 0) {
      const line = lines[lines.length - 1].trim();
      if (line === '' || line.startsWith('//') || line === '*/' || line === '*/;') {
        lines.pop();
        changed = true;
      } else {
        break;
      }
    }
    // Strip trailing block comment: find the last `/*` that has no matching `*/` after it
    const joined = lines.join('\n');
    const lastBlockOpen = joined.lastIndexOf('/*');
    if (lastBlockOpen !== -1 && !joined.includes('*/', lastBlockOpen + 2)) {
      // Everything from the `/*` onward is an unclosed trailing block comment — strip it
      const before = joined.slice(0, lastBlockOpen).trimEnd();
      lines = before.split('\n');
      changed = true;
    }
  }

  const codeOnly = lines.join('\n').trimEnd();
  if (codeOnly.length === 0) return true;

  // Valid TS files end with `}`, `export default ...`, or a closing statement
  const lastLine = codeOnly.split('\n').pop()?.trim() ?? '';
  const endsWell =
    lastLine.endsWith('}') ||
    lastLine.endsWith(';') ||
    lastLine.endsWith('*/') ||
    lastLine.startsWith('export default');
  if (!endsWell) return true;

  // Check balanced braces, ignoring comments
  const stripped = stripComments(codeOnly);
  let depth = 0;
  for (const ch of stripped) {
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
