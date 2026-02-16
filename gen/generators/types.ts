/** Shared types for the generation pipeline. */

import type { DocRef, GenerationMetadata } from '../schemas/index';

export interface AssetEntry {
  id: string;
  prompt: string;
  negativePrompt?: string;
  docRefs: DocRef[];
  filename: string;
  status: string;
  metadata?: GenerationMetadata;
  dimensions: { width: number; height: number; genWidth: number; genHeight: number };
}

export interface ProcessResult {
  status: 'skipped' | 'generated' | 'failed';
  metadata?: GenerationMetadata;
  error?: string;
}
