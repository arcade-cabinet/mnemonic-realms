import { networkMonitor } from './network';
import type { NetworkStatus } from './network';

export interface PendingOperation<T = unknown> {
  id: string;
  operation: () => Promise<T>;
  timestamp: number;
}

class OperationQueue {
  private queue: PendingOperation[] = [];
  private processing = false;

  enqueue<T>(operation: () => Promise<T>): string {
    const id = `op-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.queue.push({
      id,
      operation: operation as () => Promise<unknown>,
      timestamp: Date.now(),
    });
    return id;
  }

  async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const op = this.queue.shift();
      if (!op) break;

      try {
        await op.operation();
      } catch (error) {
        console.error(`Failed to process operation ${op.id}:`, error);
        // Re-queue failed operation
        this.queue.unshift(op);
        break;
      }
    }

    this.processing = false;
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

export const operationQueue = new OperationQueue();

// Auto-sync when network is restored
networkMonitor.addListener((status: NetworkStatus) => {
  if (status.connected) {
    operationQueue.processQueue().catch((error) => {
      console.error('Failed to process operation queue:', error);
    });
  }
});
