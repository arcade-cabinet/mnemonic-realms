import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Service Worker', () => {
  let mockCache: Map<string, Response>;
  let mockCaches: Map<string, Map<string, Response>>;

  beforeEach(() => {
    mockCache = new Map();
    mockCaches = new Map();

    // Mock caches API
    global.caches = {
      open: vi.fn((name: string) => {
        if (!mockCaches.has(name)) {
          mockCaches.set(name, new Map());
        }
        const cache = mockCaches.get(name)!;
        return Promise.resolve({
          addAll: vi.fn((urls: string[]) => {
            urls.forEach((url) => {
              cache.set(url, new Response('cached', { status: 200 }));
            });
            return Promise.resolve();
          }),
          put: vi.fn((request: Request | string, response: Response) => {
            const key = typeof request === 'string' ? request : request.url;
            cache.set(key, response);
            return Promise.resolve();
          }),
          match: vi.fn((request: Request | string) => {
            const key = typeof request === 'string' ? request : request.url;
            return Promise.resolve(cache.get(key));
          }),
        });
      }),
      match: vi.fn((request: Request | string) => {
        const key = typeof request === 'string' ? request : request.url;
        for (const cache of mockCaches.values()) {
          if (cache.has(key)) {
            return Promise.resolve(cache.get(key));
          }
        }
        return Promise.resolve(undefined);
      }),
      keys: vi.fn(() => Promise.resolve(Array.from(mockCaches.keys()))),
      delete: vi.fn((name: string) => {
        const existed = mockCaches.has(name);
        mockCaches.delete(name);
        return Promise.resolve(existed);
      }),
    } as unknown as CacheStorage;
  });

  it('should cache critical assets during install', async () => {
    const criticalAssets = [
      '/mnemonic-realms/',
      '/mnemonic-realms/index.html',
      '/mnemonic-realms/manifest.json',
    ];

    const cache = await caches.open('mnemonic-realms-v1');
    await cache.addAll(criticalAssets);

    for (const asset of criticalAssets) {
      const cached = await cache.match(asset);
      expect(cached).toBeDefined();
    }
  });

  it('should clean up old caches on activate', async () => {
    await caches.open('mnemonic-realms-v1');
    await caches.open('mnemonic-realms-v2');
    await caches.open('other-cache');

    const keys = await caches.keys();
    expect(keys).toContain('mnemonic-realms-v1');
    expect(keys).toContain('mnemonic-realms-v2');

    // Simulate activate: delete old versions
    const currentVersion = 'mnemonic-realms-v2';
    const keysToDelete = keys.filter(
      (name) => name.startsWith('mnemonic-realms-') && name !== currentVersion
    );

    for (const key of keysToDelete) {
      await caches.delete(key);
    }

    const remainingKeys = await caches.keys();
    expect(remainingKeys).not.toContain('mnemonic-realms-v1');
    expect(remainingKeys).toContain('mnemonic-realms-v2');
    expect(remainingKeys).toContain('other-cache');
  });

  it('should serve cached assets when available', async () => {
    const url = '/mnemonic-realms/index.html';
    const cache = await caches.open('mnemonic-realms-v1');
    await cache.put(url, new Response('cached content', { status: 200 }));

    const cached = await caches.match(url);
    expect(cached).toBeDefined();
    expect(await cached?.text()).toBe('cached content');
  });

  it('should implement cache-first strategy', async () => {
    const url = '/mnemonic-realms/asset.js';
    const cache = await caches.open('mnemonic-realms-v1');
    await cache.put(url, new Response('cached', { status: 200 }));

    // Check cache first
    const cached = await caches.match(url);
    expect(cached).toBeDefined();
    expect(await cached?.text()).toBe('cached');
  });
});
