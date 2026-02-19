import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { GameData, StorageDriver } from '../types';
import {
  StorageInitializationError,
  StorageWriteError,
  StorageReadError,
  StorageDeleteError,
} from '../types';
import { INIT_SCHEMA, SCHEMA_VERSION } from './schema';
import { runMigrations } from './migrations';

export class SQLiteProvider implements StorageDriver {
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'mnemonic_realms';

  async initialize(): Promise<void> {
    try {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      this.db = await sqlite.createConnection(
        this.dbName,
        false,
        'no-encryption',
        SCHEMA_VERSION,
        false
      );
      await this.db.open();
      await this.db.execute(INIT_SCHEMA);
      await runMigrations(this.db, SCHEMA_VERSION);
    } catch (error) {
      throw new StorageInitializationError(
        `Failed to initialize SQLite: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async save(key: string, data: GameData): Promise<void> {
    if (!this.db) throw new StorageWriteError('Database not initialized');
    
    try {
      const now = Date.now();
      const query = `
        INSERT OR REPLACE INTO game_saves (id, player_id, save_slot, data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await this.db.run(query, [
        key,
        data.playerId,
        data.saveSlot,
        JSON.stringify(data.data),
        data.timestamp || now,
        now,
      ]);
    } catch (error) {
      throw new StorageWriteError(
        `Failed to save data: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async load(key: string): Promise<GameData | null> {
    if (!this.db) throw new StorageReadError('Database not initialized');
    
    try {
      const query = 'SELECT * FROM game_saves WHERE id = ?';
      const result = await this.db.query(query, [key]);
      
      if (!result.values || result.values.length === 0) {
        return null;
      }
      
      const row = result.values[0];
      return {
        playerId: row.player_id,
        saveSlot: row.save_slot,
        data: JSON.parse(row.data),
        timestamp: row.created_at, // Use created_at instead of updated_at to preserve original timestamp
      };
    } catch (error) {
      throw new StorageReadError(
        `Failed to load data: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async update(key: string, data: Partial<GameData>): Promise<void> {
    if (!this.db) throw new StorageWriteError('Database not initialized');
    
    try {
      const existing = await this.load(key);
      if (!existing) {
        throw new StorageWriteError(`Cannot update non-existent key: ${key}`);
      }
      
      const updated: GameData = {
        ...existing,
        ...data,
        timestamp: Date.now(),
      };
      
      await this.save(key, updated);
    } catch (error) {
      if (error instanceof StorageWriteError || error instanceof StorageReadError) {
        throw error;
      }
      throw new StorageWriteError(
        `Failed to update data: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.db) throw new StorageDeleteError('Database not initialized');
    
    try {
      const query = 'DELETE FROM game_saves WHERE id = ?';
      await this.db.run(query, [key]);
    } catch (error) {
      throw new StorageDeleteError(
        `Failed to delete data: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async list(): Promise<string[]> {
    if (!this.db) throw new StorageReadError('Database not initialized');
    
    try {
      const query = 'SELECT id FROM game_saves ORDER BY updated_at DESC';
      const result = await this.db.query(query);
      
      if (!result.values) {
        return [];
      }
      
      return result.values.map((row) => row.id);
    } catch (error) {
      throw new StorageReadError(
        `Failed to list keys: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      try {
        await this.db.close();
        this.db = null;
      } catch (error) {
        // Log but don't throw on close errors
        console.error('Error closing database:', error);
      }
    }
  }
}
