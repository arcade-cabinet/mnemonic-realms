// Service Worker for Mnemonic Realms PWA
// Implements cache-first strategy with progressive caching

const CACHE_VERSION = 'v1';
const CACHE_NAME = `mnemonic-realms-${CACHE_VERSION}`;

// Critical assets that must be cached during install
const CRITICAL_ASSETS = [
  '/mnemonic-realms/',
  '/mnemonic-realms/index.html',
  '/mnemonic-realms/manifest.json',
  '/mnemonic-realms/icon-192.png',
  '/mnemonic-realms/icon-512.png',
];

// Install event: cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('mnemonic-realms-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event: cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache successful responses for future use
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback: return a meaningful message
        if (event.request.mode === 'navigate') {
          return new Response(
            '<html><body><h1>Offline</h1><p>Mnemonic Realms is currently unavailable. Please check your internet connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
