export interface GameData {
  playerId: string;
  saveSlot: number;
  data: Record<string, unknown>;
  timestamp: number;
}

export interface StorageDriver {
  initialize(): Promise<void>;
  save(key: string, data: GameData): Promise<void>;
  load(key: string): Promise<GameData | null>;
  update(key: string, data: Partial<GameData>): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
  close(): Promise<void>;
}

export class StorageInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageInitializationError';
  }
}

export class StorageWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageWriteError';
  }
}

export class StorageReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageReadError';
  }
}

export class StorageDeleteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageDeleteError';
  }
}

export class StorageMigrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageMigrationError';
  }
}
