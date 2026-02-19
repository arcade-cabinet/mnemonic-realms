export { manifest, getManifest } from './manifest.js';
export type { PWAManifest, PWAIcon, PWAScreenshot } from './types.js';
export { ServiceWorkerRegistration, registerServiceWorker } from './register.js';
export type {
  ServiceWorkerConfig,
  ServiceWorkerRegistration as ServiceWorkerRegistrationType,
  CacheStorage,
} from './service-worker-types.js';
