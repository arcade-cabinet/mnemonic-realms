import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { ContentIndexer } from '../../../gen/mcp/indexer.ts';

describe('ContentIndexer', () => {
  let indexer: ContentIndexer;

  beforeAll(() => {
    indexer = new ContentIndexer(':memory:');
    indexer.indexAll();
  });

  afterAll(() => {
    indexer.close();
  });

  describe('indexAll', () => {
    it('indexes documents from the project', () => {
      const stats = indexer.getStats();
      expect(stats.documents).toBeGreaterThan(0);
      expect(stats.sections).toBeGreaterThan(0);
    });

    it('indexes multiple document types', () => {
      const stats = indexer.getStats();
      expect(Object.keys(stats.byType).length).toBeGreaterThan(1);
    });
  });

  describe('search', () => {
    it('finds documents by content', () => {
      const results = indexer.search('memory');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBeDefined();
      expect(results[0].snippet).toBeDefined();
    });

    it('returns empty for nonexistent content', () => {
      const results = indexer.search('xyznonexistentterm123456');
      expect(results).toHaveLength(0);
    });
  });

  describe('getDocument', () => {
    it('returns null for nonexistent ID', () => {
      expect(indexer.getDocument('does-not-exist')).toBeNull();
    });

    it('returns document with sections', () => {
      // Find first available document
      const stats = indexer.getStats();
      const firstType = Object.keys(stats.byType)[0];
      const docs = indexer.listByType(firstType);
      if (docs.length === 0) return;

      const doc = indexer.getDocument(docs[0].id);
      expect(doc).not.toBeNull();
      expect(doc!.id).toBe(docs[0].id);
      expect(doc!.body).toBeDefined();
    });
  });

  describe('listByType', () => {
    it('lists DDL documents', () => {
      const ddlDocs = indexer.listByType('ddl');
      expect(ddlDocs.length).toBeGreaterThan(0);
      for (const doc of ddlDocs) {
        expect(doc.id).toContain('ddl:');
      }
    });
  });

  describe('findReferences', () => {
    it('returns array (may be empty for some targets)', () => {
      const refs = indexer.findReferences('memory-system');
      expect(Array.isArray(refs)).toBe(true);
    });
  });

  describe('validateLinks', () => {
    it('reports total link count', () => {
      const result = indexer.validateLinks();
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.broken)).toBe(true);
    });
  });

  describe('getStats', () => {
    it('returns comprehensive statistics', () => {
      const stats = indexer.getStats();
      expect(stats).toHaveProperty('documents');
      expect(stats).toHaveProperty('sections');
      expect(stats).toHaveProperty('links');
      expect(stats).toHaveProperty('byType');
      expect(typeof stats.documents).toBe('number');
    });
  });
});
