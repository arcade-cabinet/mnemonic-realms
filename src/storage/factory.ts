import { PlatformDetector } from '../platform/detector';
import type { StorageDriver } from './types';
import { StorageInitializationError } from './types';

export async function createStorageDriver(): Promise<StorageDriver> {
  const detector = PlatformDetector.getInstance();
  const platformInfo = await detector.getPlatformInfo();

  if (platformInfo.isNative) {
    // Route to SQLite provider on mobile platforms
    const { SQLiteProvider } = await import('./sqlite/provider');
    const provider = new SQLiteProvider();
    await provider.initialize();
    return provider;
  }

  // Route to sql.js provider on web platform
  const { SqlJsProvider } = await import('./sqljs/provider');
  const provider = new SqlJsProvider();
  await provider.initialize();
  return provider;
}
