/**
 * Property Test: Storage Provider Interface Parity
 * 
 * **Validates: Requirements 6.5**
 * 
 * Property 9: Storage Provider Interface Parity
 * For any operation defined in the StorageDriver interface (save, load, update, 
 * delete, list), both SQLite_Provider and Web_Storage_Provider shall implement 
 * that operation with the same method signature and return type.
 * 
 * @module property/storage/interface-parity
 */

import { describe, expect, it } from 'vitest';
import { SQLiteProvider } from '../../../src/storage/sqlite/provider';
import { SqlJsProvider } from '../../../src/storage/sqljs/provider';
import type { StorageDriver } from '../../../src/storage/types';

describe('Property Test: Storage Provider Interface Parity', () => {
  it('Property 9: Both providers implement StorageDriver interface', () => {
    const sqliteProvider = new SQLiteProvider();
    const sqljsProvider = new SqlJsProvider();

    // Verify both providers implement all required methods
    const requiredMethods: (keyof StorageDriver)[] = [
      'initialize',
      'save',
      'load',
      'update',
      'delete',
      'list',
      'close',
    ];

    for (const method of requiredMethods) {
      expect(typeof sqliteProvider[method]).toBe('function');
      expect(typeof sqljsProvider[method]).toBe('function');
    }
  });

  it('Property 9: Method signatures match between providers', () => {
    const sqliteProvider = new SQLiteProvider();
    const sqljsProvider = new SqlJsProvider();

    // Verify method signatures (arity) match
    expect(sqliteProvider.initialize.length).toBe(sqljsProvider.initialize.length);
    expect(sqliteProvider.save.length).toBe(sqljsProvider.save.length);
    expect(sqliteProvider.load.length).toBe(sqljsProvider.load.length);
    expect(sqliteProvider.update.length).toBe(sqljsProvider.update.length);
    expect(sqliteProvider.delete.length).toBe(sqljsProvider.delete.length);
    expect(sqliteProvider.list.length).toBe(sqljsProvider.list.length);
    expect(sqliteProvider.close.length).toBe(sqljsProvider.close.length);
  });

  it('Property 9: Both providers are assignable to StorageDriver type', () => {
    const sqliteProvider: StorageDriver = new SQLiteProvider();
    const sqljsProvider: StorageDriver = new SqlJsProvider();

    // TypeScript compilation ensures type compatibility
    // This test verifies runtime assignability
    expect(sqliteProvider).toBeDefined();
    expect(sqljsProvider).toBeDefined();
  });
});
