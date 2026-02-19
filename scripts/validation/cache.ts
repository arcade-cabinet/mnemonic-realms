// Validation cache system for parsed files
import { statSync } from 'node:fs';

interface CacheEntry<T> {
  data: T;
  mtime: number;
}

export class ValidationCache {
  private mapCache = new Map<string, CacheEntry<unknown>>();
  private spriteCache = new Map<string, CacheEntry<unknown>>();

  private getFileModTime(path: string): number {
    try {
      return statSync(path).mtimeMs;
    } catch {
      return 0;
    }
  }

  private isValid<T>(entry: CacheEntry<T> | undefined, path: string): boolean {
    if (!entry) return false;
    const currentMtime = this.getFileModTime(path);
    return entry.mtime === currentMtime;
  }

  getCachedMap<T>(path: string, mtime: number): T | null {
    const entry = this.mapCache.get(path) as CacheEntry<T> | undefined;
    if (this.isValid(entry, path) && entry?.mtime === mtime) {
      return entry.data;
    }
    return null;
  }

  setCachedMap<T>(path: string, mtime: number, map: T): void {
    this.mapCache.set(path, { data: map, mtime });
  }

  getCachedSprite<T>(path: string, mtime: number): T | null {
    const entry = this.spriteCache.get(path) as CacheEntry<T> | undefined;
    if (this.isValid(entry, path) && entry?.mtime === mtime) {
      return entry.data;
    }
    return null;
  }

  setCachedSprite<T>(path: string, mtime: number, analysis: T): void {
    this.spriteCache.set(path, { data: analysis, mtime });
  }

  clear(): void {
    this.mapCache.clear();
    this.spriteCache.clear();
  }

  getStats() {
    return {
      mapCacheSize: this.mapCache.size,
      spriteCacheSize: this.spriteCache.size,
    };
  }
}

// Global cache instance
export const validationCache = new ValidationCache();
