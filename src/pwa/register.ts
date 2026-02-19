import type { ServiceWorkerRegistration as SWRegistration } from './service-worker-types.js';

/**
 * Service Worker registration module for Mnemonic Realms PWA
 * Handles registration, updates, and lifecycle management
 */
export class ServiceWorkerRegistration implements SWRegistration {
  private registration: globalThis.ServiceWorkerRegistration | null = null;

  /**
   * Register the service worker
   * @throws Error if service workers are not supported
   */
  async register(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers are not supported in this browser');
    }

    try {
      this.registration = await navigator.serviceWorker.register(
        '/mnemonic-realms/service-worker.js',
        { scope: '/mnemonic-realms/' }
      );

      // Check for updates on page load
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, prompt user to reload
              console.log('New version available! Please reload the page.');
            }
          });
        }
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      return await this.registration.unregister();
    } catch (error) {
      console.error('Service worker unregistration failed:', error);
      return false;
    }
  }

  /**
   * Check for service worker updates
   */
  async update(): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker is not registered');
    }

    try {
      await this.registration.update();
    } catch (error) {
      console.error('Service worker update failed:', error);
      throw error;
    }
  }
}

/**
 * Register the service worker on application startup
 */
export async function registerServiceWorker(): Promise<void> {
  const registration = new ServiceWorkerRegistration();
  await registration.register();
}
