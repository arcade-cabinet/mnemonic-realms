/**
 * Drizzle ORM Schema for Mnemonic Realms Game Database
 * 
 * This schema defines the structure for:
 * - Generated worlds cache (seed → JSON)
 * - Game saves (player state, progress)
 * - Test scenarios (automated testing data)
 */

import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Worlds table: Caches procedurally generated world data
 * Key concept: Same seed always generates same world (deterministic)
 */
export const worlds = sqliteTable('worlds', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  seed: text('seed').notNull().unique(), // "adjective adjective noun"
  generatedData: text('generated_data').notNull(), // JSON string of all generated content
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  lastAccessedAt: integer('last_accessed_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Game saves table: Stores player progress for each world
 * Enables save/load functionality
 */
export const gameSaves = sqliteTable('game_saves', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  worldId: integer('world_id')
    .notNull()
    .references(() => worlds.id, { onDelete: 'cascade' }),
  saveName: text('save_name').notNull(), // User-defined save name
  playerState: text('player_state').notNull(), // JSON: position, stats, inventory, etc.
  playTime: integer('play_time').notNull().default(0), // Seconds played
  savedAt: integer('saved_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Test scenarios table: Stores expected outcomes for E2E tests
 * Reserved seed: "brave ancient warrior"
 */
export const testScenarios = sqliteTable('test_scenarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  seed: text('seed').notNull(), // Test seed (e.g., "brave ancient warrior")
  scenarioName: text('scenario_name').notNull(), // e.g., "character_generation", "combat_basic"
  description: text('description').notNull(), // What this scenario tests
  expectedOutcomes: text('expected_outcomes').notNull(), // JSON: expected values
  actualOutcomes: text('actual_outcomes'), // JSON: actual test results (null if not run)
  passed: integer('passed', { mode: 'boolean' }), // null = not run, true = passed, false = failed
  lastRun: integer('last_run', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Yuka AI scenarios table: Stores AI governor playtesting scenarios
 * Automated testing using Yuka.js AI for player controls
 */
export const aiScenarios = sqliteTable('ai_scenarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  scenarioName: text('scenario_name').notNull().unique(),
  description: text('description').notNull(),
  worldSeed: text('world_seed').notNull(), // Which world to test in
  startState: text('start_state').notNull(), // JSON: initial player state
  goals: text('goals').notNull(), // JSON: array of goals for AI to achieve
  behaviorConfig: text('behavior_config').notNull(), // JSON: Yuka FSM configuration
  maxDuration: integer('max_duration').notNull().default(300), // Seconds before timeout
  successCriteria: text('success_criteria').notNull(), // JSON: conditions for success
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * AI test runs table: Records results from Yuka AI playtesting
 */
export const aiTestRuns = sqliteTable('ai_test_runs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  scenarioId: integer('scenario_id')
    .notNull()
    .references(() => aiScenarios.id, { onDelete: 'cascade' }),
  passed: integer('passed', { mode: 'boolean' }).notNull(),
  duration: integer('duration').notNull(), // Seconds taken
  goalsAchieved: text('goals_achieved').notNull(), // JSON: array of achieved goals
  metrics: text('metrics').notNull(), // JSON: performance metrics
  errorLog: text('error_log'), // Errors encountered, if any
  recording: blob('recording'), // Optional: recorded gameplay data
  ranAt: integer('ran_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Type exports for TypeScript
export type World = typeof worlds.$inferSelect;
export type NewWorld = typeof worlds.$inferInsert;

export type GameSave = typeof gameSaves.$inferSelect;
export type NewGameSave = typeof gameSaves.$inferInsert;

export type TestScenario = typeof testScenarios.$inferSelect;
export type NewTestScenario = typeof testScenarios.$inferInsert;

export type AIScenario = typeof aiScenarios.$inferSelect;
export type NewAIScenario = typeof aiScenarios.$inferInsert;

export type AITestRun = typeof aiTestRuns.$inferSelect;
export type NewAITestRun = typeof aiTestRuns.$inferInsert;
