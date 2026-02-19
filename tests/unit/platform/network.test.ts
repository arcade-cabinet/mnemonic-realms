import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Capacitor Network API
vi.mock('@capacitor/network', () => ({
  Network: {
    getStatus: vi.fn(),
    addListener: vi.fn(),
  },
}));

describe('Network Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Network Status Detection', () => {
    it('should detect online status', async () => {
      const { Network } = await import('@capacitor/network');
      (Network.getStatus as ReturnType<typeof vi.fn>).mockResolvedValue({
        connected: true,
        connectionType: 'wifi',
      });

      const { networkMonitor } = await import('../../../src/platform/network');
      await networkMonitor.initialize();

      const status = networkMonitor.getStatus();
      expect(status.connected).toBe(true);
      expect(status.connectionType).toBe('wifi');
    });

    it('should detect offline status', async () => {
      const { Network } = await import('@capacitor/network');
      (Network.getStatus as ReturnType<typeof vi.fn>).mockResolvedValue({
        connected: false,
        connectionType: 'none',
      });

      const { networkMonitor } = await import('../../../src/platform/network');
      await networkMonitor.initialize();

      const status = networkMonitor.getStatus();
      expect(status.connected).toBe(false);
      expect(status.connectionType).toBe('none');
    });

    it('should notify listeners on status change', async () => {
      const { Network } = await import('@capacitor/network');
      let statusChangeCallback: ((status: { connected: boolean; connectionType: string }) => void) | null = null;

      (Network.getStatus as ReturnType<typeof vi.fn>).mockResolvedValue({
        connected: true,
        connectionType: 'wifi',
      });

      (Network.addListener as ReturnType<typeof vi.fn>).mockImplementation((event, callback) => {
        if (event === 'networkStatusChange') {
          statusChangeCallback = callback as typeof statusChangeCallback;
        }
        return Promise.resolve({ remove: vi.fn() });
      });

      const { networkMonitor } = await import('../../../src/platform/network');
      await networkMonitor.initialize();

      const listener = vi.fn();
      networkMonitor.addListener(listener);

      // Simulate status change
      if (statusChangeCallback) {
        statusChangeCallback({ connected: false, connectionType: 'none' });
      }

      expect(listener).toHaveBeenCalledWith({
        connected: false,
        connectionType: 'none',
      });
    });

    it('should handle network API unavailable gracefully', async () => {
      const { Network } = await import('@capacitor/network');
      (Network.getStatus as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network API not available'));

      const { networkMonitor } = await import('../../../src/platform/network');
      await expect(networkMonitor.initialize()).resolves.not.toThrow();
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed operations with exponential backoff', async () => {
      const { retryWithExponentialBackoff } = await import('../../../src/platform/retry');
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValueOnce('Success');

      const result = await retryWithExponentialBackoff(operation, {
        maxRetries: 3,
        initialDelay: 10,
        maxDelay: 100,
        backoffMultiplier: 2,
      });

      expect(result).toBe('Success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      const { retryWithExponentialBackoff } = await import('../../../src/platform/retry');
      const operation = vi.fn().mockRejectedValue(new Error('Always fails'));

      await expect(
        retryWithExponentialBackoff(operation, {
          maxRetries: 2,
          initialDelay: 10,
          maxDelay: 100,
          backoffMultiplier: 2,
        }),
      ).rejects.toThrow('Always fails');

      expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should respect max delay', async () => {
      const { retryWithExponentialBackoff } = await import('../../../src/platform/retry');
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockRejectedValueOnce(new Error('Fail 3'))
        .mockResolvedValueOnce('Success');

      const startTime = Date.now();
      await retryWithExponentialBackoff(operation, {
        maxRetries: 4,
        initialDelay: 10,
        maxDelay: 50,
        backoffMultiplier: 2,
      });
      const elapsed = Date.now() - startTime;

      // Total delay should be: 10 + 20 + 50 = 80ms (third delay capped to 50)
      // Allow some margin for test execution overhead
      expect(elapsed).toBeGreaterThanOrEqual(70);
      expect(elapsed).toBeLessThan(200);
    });
  });

  describe('Operation Queue', () => {
    it('should enqueue operations', async () => {
      const { operationQueue } = await import('../../../src/platform/operation-queue');
      operationQueue.clear();

      const operation = vi.fn().mockResolvedValue('Success');
      operationQueue.enqueue(operation);

      expect(operationQueue.getQueueSize()).toBe(1);
    });

    it('should process queued operations', async () => {
      const { operationQueue } = await import('../../../src/platform/operation-queue');
      operationQueue.clear();

      const operation1 = vi.fn().mockResolvedValue('Success 1');
      const operation2 = vi.fn().mockResolvedValue('Success 2');

      operationQueue.enqueue(operation1);
      operationQueue.enqueue(operation2);

      await operationQueue.processQueue();

      expect(operation1).toHaveBeenCalled();
      expect(operation2).toHaveBeenCalled();
      expect(operationQueue.getQueueSize()).toBe(0);
    });

    it('should re-queue failed operations', async () => {
      const { operationQueue } = await import('../../../src/platform/operation-queue');
      operationQueue.clear();

      const operation = vi.fn().mockRejectedValue(new Error('Failed'));
      operationQueue.enqueue(operation);

      await operationQueue.processQueue();

      expect(operation).toHaveBeenCalledTimes(1);
      expect(operationQueue.getQueueSize()).toBe(1); // Re-queued
    });
  });
});
