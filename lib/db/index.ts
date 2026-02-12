/**
 * Database initialization and management for sql.js
 * Browser-based SQLite database for game state and caching
 */

import initSqlJs, { type Database } from 'sql.js';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Global database instance (singleton pattern for browser)
let dbInstance: BetterSQLite3Database<typeof schema> | null = null;
let sqlJsDb: Database | null = null;

/**
 * Initialize sql.js and create/load database
 * In browser, loads from localStorage or creates new
 */
export async function initDatabase(): Promise<BetterSQLite3Database<typeof schema>> {
  if (dbInstance) {
    return dbInstance;
  }

  // Initialize sql.js
  const SQL = await initSqlJs({
    // Load WASM file from CDN
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  // Try to load existing database from localStorage
  const savedDb = typeof window !== 'undefined' ? localStorage.getItem('mnemonic-realms-db') : null;
  
  if (savedDb) {
    // Restore from saved binary
    const uint8Array = new Uint8Array(JSON.parse(savedDb));
    sqlJsDb = new SQL.Database(uint8Array);
  } else {
    // Create new database
    sqlJsDb = new SQL.Database();
    await runMigrations(sqlJsDb);
  }

  // Wrap with Drizzle ORM
  dbInstance = drizzle(sqlJsDb as any, { schema });

  return dbInstance;
}

/**
 * Run database migrations (create tables)
 */
async function runMigrations(db: Database): Promise<void> {
  // Create worlds table
  db.run(`
    CREATE TABLE IF NOT EXISTS worlds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seed TEXT NOT NULL UNIQUE,
      generated_data TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      last_accessed_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Create game_saves table
  db.run(`
    CREATE TABLE IF NOT EXISTS game_saves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      world_id INTEGER NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
      save_name TEXT NOT NULL,
      player_state TEXT NOT NULL,
      play_time INTEGER NOT NULL DEFAULT 0,
      saved_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Create test_scenarios table
  db.run(`
    CREATE TABLE IF NOT EXISTS test_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seed TEXT NOT NULL,
      scenario_name TEXT NOT NULL,
      description TEXT NOT NULL,
      expected_outcomes TEXT NOT NULL,
      actual_outcomes TEXT,
      passed INTEGER,
      last_run INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Create ai_scenarios table
  db.run(`
    CREATE TABLE IF NOT EXISTS ai_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      world_seed TEXT NOT NULL,
      start_state TEXT NOT NULL,
      goals TEXT NOT NULL,
      behavior_config TEXT NOT NULL,
      max_duration INTEGER NOT NULL DEFAULT 300,
      success_criteria TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Create ai_test_runs table
  db.run(`
    CREATE TABLE IF NOT EXISTS ai_test_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_id INTEGER NOT NULL REFERENCES ai_scenarios(id) ON DELETE CASCADE,
      passed INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      goals_achieved TEXT NOT NULL,
      metrics TEXT NOT NULL,
      error_log TEXT,
      recording BLOB,
      ran_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  console.log('✅ Database migrations completed');
}

/**
 * Save database to localStorage (persist between sessions)
 */
export function saveDatabase(): void {
  if (!sqlJsDb || typeof window === 'undefined') {
    return;
  }

  const data = sqlJsDb.export();
  const buffer = Array.from(data);
  localStorage.setItem('mnemonic-realms-db', JSON.stringify(buffer));
  console.log('💾 Database saved to localStorage');
}

/**
 * Export database as file (for backup)
 */
export function exportDatabase(): Uint8Array | null {
  if (!sqlJsDb) {
    return null;
  }
  return sqlJsDb.export();
}

/**
 * Import database from file (restore from backup)
 */
export async function importDatabase(data: Uint8Array): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  sqlJsDb = new SQL.Database(data);
  dbInstance = drizzle(sqlJsDb as any, { schema });

  // Save to localStorage
  saveDatabase();
}

/**
 * Clear database (for testing)
 */
export async function clearDatabase(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mnemonic-realms-db');
  }
  
  dbInstance = null;
  sqlJsDb = null;
  
  await initDatabase();
}

/**
 * Get database instance (initialize if needed)
 */
export async function getDatabase(): Promise<BetterSQLite3Database<typeof schema>> {
  if (!dbInstance) {
    return await initDatabase();
  }
  return dbInstance;
}
