export const SCHEMA_VERSION = 1;

export const CREATE_GAME_SAVES_TABLE = `
CREATE TABLE IF NOT EXISTS game_saves (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  save_slot INTEGER NOT NULL,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(player_id, save_slot)
);
`;

export const CREATE_SETTINGS_TABLE = `
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
`;

export const CREATE_INDEXES = `
CREATE INDEX IF NOT EXISTS idx_player_saves ON game_saves(player_id);
`;

export const INIT_SCHEMA = [
  CREATE_GAME_SAVES_TABLE,
  CREATE_SETTINGS_TABLE,
  CREATE_INDEXES,
].join('\n');
