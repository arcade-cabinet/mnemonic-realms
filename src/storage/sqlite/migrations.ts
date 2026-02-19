import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { StorageMigrationError } from '../types';

interface Migration {
  version: number;
  up: string[];
}

const migrations: Migration[] = [
  // Future migrations will be added here
  // Example:
  // {
  //   version: 2,
  //   up: [
  //     'ALTER TABLE game_saves ADD COLUMN new_field TEXT',
  //   ],
  // },
];

export async function runMigrations(
  db: SQLiteDBConnection,
  targetVersion: number
): Promise<void> {
  try {
    // Get current schema version
    const versionQuery = 'PRAGMA user_version';
    const versionResult = await db.query(versionQuery);
    const currentVersion = versionResult.values?.[0]?.user_version || 0;

    // Run migrations from current version to target version
    for (const migration of migrations) {
      if (migration.version > currentVersion && migration.version <= targetVersion) {
        for (const sql of migration.up) {
          await db.execute(sql);
        }
      }
    }

    // Update schema version
    if (currentVersion < targetVersion) {
      await db.execute(`PRAGMA user_version = ${targetVersion}`);
    }
  } catch (error) {
    throw new StorageMigrationError(
      `Failed to run migrations: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
