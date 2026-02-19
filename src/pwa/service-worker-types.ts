export interface ServiceWorkerConfig {
  cacheVersion: string;
  cacheName: string;
  criticalAssets: string[];
}

export interface ServiceWorkerRegistration {
  register(): Promise<void>;
  unregister(): Promise<boolean>;
  update(): Promise<void>;
}

export interface CacheStorage {
  match(request: Request | string): Promise<Response | undefined>;
  open(cacheName: string): Promise<Cache>;
  keys(): Promise<string[]>;
  delete(cacheName: string): Promise<boolean>;
}
