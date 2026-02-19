import initSqlJs, { type Database } from 'sql.js';
import type { GameData, StorageDriver } from '../types';
import {
  StorageInitializationError,
  StorageWriteError,
  StorageReadError,
  StorageDeleteError,
} from '../types';
import { INIT_SCHEMA } from '../sqlite/schema';
import { loadFromIndexedDB, saveToIndexedDB } from './persistence';

export class SqlJsProvider implements StorageDriver {
  private db: Database | null = null;
  private readonly dbName = 'mnemonic_realms';

  async initialize(): Promise<void> {
    try {
      const SQL = await initSqlJs();

      const savedData = await loadFromIndexedDB(this.dbName);
      
      if (savedData) {
        this.db = new SQL.Database(savedData);
      } else {
        this.db = new SQL.Database();
        this.db.exec(INIT_SCHEMA);
        await this.persist();
      }
    } catch (error) {
      throw new StorageInitializationError(
        `Failed to initialize sql.js: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async persist(): Promise<void> {
    if (!this.db) return;
    const data = this.db.export();
    await saveToIndexedDB(this.dbName, data);
  }

  async save(key: string, data: GameData): Promise<void> {
    if (!this.db) throw new StorageWriteError('Database not initialized');
    
    try {
      const now = Date.now();
      const query = `
        INSERT OR REPLACE INTO game_saves (id, player_id, save_slot, data, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      this.db.run(query, [
        key,
        data.playerId,
        data.saveSlot,
        JSON.stringify(data.data),
        data.timestamp || now,
        now,
      ]);
      await this.persist();
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
      const result = this.db.exec(query, [key]);
      
      if (result.length === 0 || result[0].values.length === 0) {
        return null;
      }
      
      const row = result[0].values[0];
      return {
        playerId: row[1] as string,
        saveSlot: row[2] as number,
        data: JSON.parse(row[3] as string),
        timestamp: row[5] as number,
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
      this.db.run(query, [key]);
      await this.persist();
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
      const result = this.db.exec(query);
      
      if (result.length === 0) {
        return [];
      }
      
      return result[0].values.map((row) => row[0] as string);
    } catch (error) {
      throw new StorageReadError(
        `Failed to list keys: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      try {
        await this.persist();
        this.db.close();
        this.db = null;
      } catch (error) {
        console.error('Error closing database:', error);
      }
    }
  }
}
