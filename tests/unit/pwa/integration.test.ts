import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Service Worker Integration', () => {
  beforeEach(() => {
    // Mock navigator.serviceWorker
    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: {
        register: vi.fn().mockResolvedValue({
          addEventListener: vi.fn(),
          unregister: vi.fn().mockResolvedValue(true),
          update: vi.fn().mockResolvedValue(undefined),
        }),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should register service worker on application startup', async () => {
    const { registerServiceWorker } = await import('../../../src/pwa/register.js');

    await registerServiceWorker();

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith(
      '/mnemonic-realms/service-worker.js',
      { scope: '/mnemonic-realms/' }
    );
  });

  it('should handle service worker registration failure gracefully', async () => {
    const mockError = new Error('Registration failed');
    vi.spyOn(navigator.serviceWorker, 'register').mockRejectedValueOnce(mockError);

    const { registerServiceWorker } = await import('../../../src/pwa/register.js');

    await expect(registerServiceWorker()).rejects.toThrow('Registration failed');
  });

  it('should register service worker with correct scope', async () => {
    const { registerServiceWorker } = await import('../../../src/pwa/register.js');

    await registerServiceWorker();

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith(
      expect.stringContaining('service-worker.js'),
      expect.objectContaining({ scope: '/mnemonic-realms/' })
    );
  });
});
