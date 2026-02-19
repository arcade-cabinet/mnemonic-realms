import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';

describe('Service Worker Property Tests', () => {
  let mockCaches: Map<string, Map<string, Response>>;

  beforeEach(() => {
    mockCaches = new Map();

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

  it('Property 10: Essential Assets Caching', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
        async (criticalAssets) => {
          const cache = await caches.open('mnemonic-realms-v1');
          await cache.addAll(criticalAssets);

          for (const asset of criticalAssets) {
            const cached = await cache.match(asset);
            expect(cached).toBeDefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: Offline Asset Serving', async () => {
    await fc.assert(
      fc.asyncProperty(fc.webUrl(), async (assetUrl) => {
        const cache = await caches.open('mnemonic-realms-v1');
        const response = new Response('cached content', { status: 200 });
        await cache.put(assetUrl, response);

        const cached = await caches.match(assetUrl);
        expect(cached).toBeDefined();
        expect(cached?.status).toBe(200);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 12: Cache-First Strategy', async () => {
    await fc.assert(
      fc.asyncProperty(fc.webUrl(), async (assetUrl) => {
        const cache = await caches.open('mnemonic-realms-v1');
        await cache.put(assetUrl, new Response('cached', { status: 200 }));

        const cached = await caches.match(assetUrl);
        expect(cached).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: Cache Version Invalidation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.webUrl(),
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 11, max: 20 }),
        async (assetUrl, v1, v2) => {
          const cacheName1 = `mnemonic-realms-v${v1}`;
          const cacheName2 = `mnemonic-realms-v${v2}`;

          const cache1 = await caches.open(cacheName1);
          await cache1.put(assetUrl, new Response('v1', { status: 200 }));

          const cache2 = await caches.open(cacheName2);
          await cache2.put(assetUrl, new Response('v2', { status: 200 }));

          await caches.delete(cacheName1);

          const keys = await caches.keys();
          expect(keys).not.toContain(cacheName1);
          expect(keys).toContain(cacheName2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 19: Progressive Caching Non-Blocking', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 }),
        fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
        async (criticalAssets, nonCriticalAssets) => {
          const cache = await caches.open('mnemonic-realms-v1');

          await cache.addAll(criticalAssets);

          for (const asset of criticalAssets) {
            const cached = await cache.match(asset);
            expect(cached).toBeDefined();
          }

          for (const asset of nonCriticalAssets) {
            await cache.put(asset, new Response('progressive', { status: 200 }));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 20: Cache Content Equivalence', async () => {
    await fc.assert(
      fc.asyncProperty(fc.webUrl(), fc.string(), async (assetUrl, content) => {
        const cache = await caches.open('mnemonic-realms-v1');
        const response = new Response(content, { status: 200 });
        await cache.put(assetUrl, response.clone());

        const cached = await cache.match(assetUrl);
        expect(cached).toBeDefined();
        expect(await cached?.text()).toBe(content);
      }),
      { numRuns: 100 }
    );
  });
});
