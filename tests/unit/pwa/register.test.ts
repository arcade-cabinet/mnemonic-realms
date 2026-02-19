import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServiceWorkerRegistration, registerServiceWorker } from '../../../src/pwa/register.js';

describe('ServiceWorkerRegistration', () => {
  let mockRegistration: Partial<globalThis.ServiceWorkerRegistration>;

  beforeEach(() => {
    mockRegistration = {
      installing: null,
      waiting: null,
      active: null,
      scope: '/mnemonic-realms/',
      updateViaCache: 'imports',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      unregister: vi.fn(() => Promise.resolve(true)),
      update: vi.fn(() => Promise.resolve()),
    };

    // Mock navigator.serviceWorker
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: vi.fn(() => Promise.resolve(mockRegistration)),
        controller: null,
      },
      writable: true,
      configurable: true,
    });
  });

  it('should register service worker successfully', async () => {
    const registration = new ServiceWorkerRegistration();
    await registration.register();

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith(
      '/mnemonic-realms/service-worker.js',
      { scope: '/mnemonic-realms/' }
    );
  });

  it('should throw error if service workers not supported', async () => {
    // Remove serviceWorker from navigator
    const originalServiceWorker = global.navigator.serviceWorker;
    // @ts-expect-error - Intentionally setting to undefined for test
    delete global.navigator.serviceWorker;

    const registration = new ServiceWorkerRegistration();
    await expect(registration.register()).rejects.toThrow(
      'Service workers are not supported in this browser'
    );

    // Restore serviceWorker
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: originalServiceWorker,
      writable: true,
      configurable: true,
    });
  });

  it('should unregister service worker', async () => {
    const registration = new ServiceWorkerRegistration();
    await registration.register();

    const result = await registration.unregister();
    expect(result).toBe(true);
    expect(mockRegistration.unregister).toHaveBeenCalled();
  });

  it('should return false when unregistering without registration', async () => {
    const registration = new ServiceWorkerRegistration();
    const result = await registration.unregister();
    expect(result).toBe(false);
  });

  it('should update service worker', async () => {
    const registration = new ServiceWorkerRegistration();
    await registration.register();

    await registration.update();
    expect(mockRegistration.update).toHaveBeenCalled();
  });

  it('should throw error when updating without registration', async () => {
    const registration = new ServiceWorkerRegistration();
    await expect(registration.update()).rejects.toThrow('Service worker is not registered');
  });
});

describe('registerServiceWorker', () => {
  beforeEach(() => {
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        register: vi.fn(() =>
          Promise.resolve({
            installing: null,
            waiting: null,
            active: null,
            scope: '/mnemonic-realms/',
            updateViaCache: 'imports',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            unregister: vi.fn(() => Promise.resolve(true)),
            update: vi.fn(() => Promise.resolve()),
          })
        ),
        controller: null,
      },
      writable: true,
      configurable: true,
    });
  });

  it('should register service worker on application startup', async () => {
    await registerServiceWorker();
    expect(navigator.serviceWorker.register).toHaveBeenCalledWith(
      '/mnemonic-realms/service-worker.js',
      { scope: '/mnemonic-realms/' }
    );
  });
});
