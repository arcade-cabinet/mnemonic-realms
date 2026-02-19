import { Network } from '@capacitor/network';
import type { ConnectionStatus } from '@capacitor/network';

export interface NetworkStatus {
  connected: boolean;
  connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
}

export type NetworkStatusListener = (status: NetworkStatus) => void;

class NetworkMonitor {
  private listeners: NetworkStatusListener[] = [];
  private currentStatus: NetworkStatus = {
    connected: true,
    connectionType: 'unknown',
  };

  async initialize(): Promise<void> {
    try {
      const status = await Network.getStatus();
      this.currentStatus = this.mapStatus(status);

      Network.addListener('networkStatusChange', (status) => {
        this.currentStatus = this.mapStatus(status);
        this.notifyListeners();
      });
    } catch (error) {
      console.warn('Network monitoring not available:', error);
    }
  }

  getStatus(): NetworkStatus {
    return { ...this.currentStatus };
  }

  addListener(listener: NetworkStatusListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private mapStatus(status: ConnectionStatus): NetworkStatus {
    return {
      connected: status.connected,
      connectionType: status.connectionType as NetworkStatus['connectionType'],
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.getStatus());
      } catch (error) {
        console.error('Network listener error:', error);
      }
    }
  }
}

export const networkMonitor = new NetworkMonitor();
