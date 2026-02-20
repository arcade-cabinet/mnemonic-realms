/**
 * Content Indexer — SQLite FTS5 + sqlite-vec powered content index
 *
 * Indexes all markdown docs, DDL data, and assemblage catalog into SQLite.
 * Provides full-text search (BM25), link graph traversal, and vector similarity.
 *
 * This is the data layer for the MCP server. Claude queries this instead of
 * holding 100+ markdown files in context.
 */

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';

export interface IndexedDocument {
  id: string;
  path: string;
  type: 'location' | 'region' | 'assemblage' | 'story' | 'design' | 'ddl' | 'other';
  title: string;
  frontmatter: Record<string, unknown> | null;
  body: string;
  sections: IndexedSection[];
  outgoing_links: string[];
}

export interface IndexedSection {
  heading: string;
  level: number;
  content: string;
}

export interface LinkEdge {
  source_id: string;
  target_path: string;
  target_anchor: string | null;
  link_text: string;
  context: string;
}

export interface SearchResult {
  id: string;
  path: string;
  type: string;
  title: string;
  snippet: string;
  rank: number;
}

const PROJECT_ROOT = import.meta.dirname
  ? path.resolve(import.meta.dirname, '../..')
  : process.cwd();

export class ContentIndexer {
  private db: Database.Database;
  private projectRoot: string;

  constructor(dbPath: string = ':memory:', projectRoot: string = PROJECT_ROOT) {
    this.projectRoot = projectRoot;
    this.db = new Database(dbPath);
    sqliteVec.load(this.db);
    this.db.pragma('journal_mode = WAL');
    this.createSchema();
  }

  private createSchema() {
    this.db.exec(`
      -- Core document store
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        path TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        frontmatter TEXT,
        body TEXT NOT NULL,
        indexed_at INTEGER NOT NULL DEFAULT (unixepoch())
      );

      -- Sections within documents
      CREATE TABLE IF NOT EXISTS sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doc_id TEXT NOT NULL REFERENCES documents(id),
        heading TEXT NOT NULL,
        level INTEGER NOT NULL,
        content TEXT NOT NULL
      );

      -- Link graph (markdown links between documents)
      CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT NOT NULL REFERENCES documents(id),
        target_path TEXT NOT NULL,
        target_anchor TEXT,
        link_text TEXT NOT NULL,
        context TEXT
      );

      -- Full-text search index (BM25)
      CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
        id, title, body, type,
        content=documents,
        content_rowid=rowid,
        tokenize='porter unicode61'
      );

      -- Triggers to keep FTS in sync
      CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
        INSERT INTO documents_fts(rowid, id, title, body, type)
        VALUES (new.rowid, new.id, new.title, new.body, new.type);
      END;

      CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
        INSERT INTO documents_fts(documents_fts, rowid, id, title, body, type)
        VALUES ('delete', old.rowid, old.id, old.title, old.body, old.type);
      END;

      CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
        INSERT INTO documents_fts(documents_fts, rowid, id, title, body, type)
        VALUES ('delete', old.rowid, old.id, old.title, old.body, old.type);
        INSERT INTO documents_fts(rowid, id, title, body, type)
        VALUES (new.rowid, new.id, new.title, new.body, new.type);
      END;

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_sections_doc ON sections(doc_id);
      CREATE INDEX IF NOT EXISTS idx_links_source ON links(source_id);
      CREATE INDEX IF NOT EXISTS idx_links_target ON links(target_path);
      CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
    `);
  }

  /**
   * Index all content from the project.
   */
  indexAll() {
    const start = Date.now();
    this.db.exec('DELETE FROM links');
    this.db.exec('DELETE FROM sections');
    this.db.exec('DELETE FROM documents');

    let count = 0;

    // Index docs/world/ (locations and regions)
    count += this.indexDirectory('docs/world', this.classifyWorldDoc);

    // Index docs/story/ (act scripts, characters, dialogue)
    count += this.indexDirectory('docs/story', () => 'story');

    // Index docs/design/ (game design docs)
    count += this.indexDirectory('docs/design', () => 'design');

    // Index docs/maps/ (map layout docs)
    count += this.indexDirectory('docs/maps', () => 'design');

    // Index gen/ddl/ (JSON DDL data)
    count += this.indexDdlDirectory('gen/ddl');

    // Index gen/assemblage/catalog/ (assemblage markdown)
    count += this.indexDirectory('gen/assemblage/catalog', () => 'assemblage');

    const elapsed = Date.now() - start;
    return { count, elapsed };
  }

  private indexDirectory(
    relDir: string,
    typeClassifier: (relPath: string) => string,
  ): number {
    const absDir = path.join(this.projectRoot, relDir);
    if (!fs.existsSync(absDir)) return 0;

    const files = this.walkDir(absDir, ['.md']);
    let count = 0;

    const insertDoc = this.db.prepare(`
      INSERT OR REPLACE INTO documents (id, path, type, title, frontmatter, body)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertSection = this.db.prepare(`
      INSERT INTO sections (doc_id, heading, level, content) VALUES (?, ?, ?, ?)
    `);
    const insertLink = this.db.prepare(`
      INSERT INTO links (source_id, target_path, target_anchor, link_text, context)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertBatch = this.db.transaction((docs: IndexedDocument[]) => {
      for (const doc of docs) {
        insertDoc.run(
          doc.id,
          doc.path,
          doc.type,
          doc.title,
          doc.frontmatter ? JSON.stringify(doc.frontmatter) : null,
          doc.body,
        );
        for (const section of doc.sections) {
          insertSection.run(doc.id, section.heading, section.level, section.content);
        }
        for (const link of this.extractLinks(doc.id, doc.body, doc.path)) {
          insertLink.run(link.source_id, link.target_path, link.target_anchor, link.link_text, link.context);
        }
      }
    });

    const batch: IndexedDocument[] = [];
    for (const absPath of files) {
      const relPath = path.relative(this.projectRoot, absPath);
      const content = fs.readFileSync(absPath, 'utf-8');
      const doc = this.parseMarkdownDoc(relPath, content, typeClassifier(relPath));
      batch.push(doc);
      count++;
    }

    if (batch.length > 0) {
      insertBatch(batch);
    }

    return count;
  }

  private indexDdlDirectory(relDir: string): number {
    const absDir = path.join(this.projectRoot, relDir);
    if (!fs.existsSync(absDir)) return 0;

    const files = this.walkDir(absDir, ['.json']);
    let count = 0;

    const insertDoc = this.db.prepare(`
      INSERT OR REPLACE INTO documents (id, path, type, title, frontmatter, body)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertBatch = this.db.transaction((items: { id: string; path: string; title: string; data: string }[]) => {
      for (const item of items) {
        insertDoc.run(item.id, item.path, 'ddl', item.title, item.data, item.data);
      }
    });

    const batch: { id: string; path: string; title: string; data: string }[] = [];
    for (const absPath of files) {
      const relPath = path.relative(this.projectRoot, absPath);
      const content = fs.readFileSync(absPath, 'utf-8');
      const id = `ddl:${relPath.replace('gen/ddl/', '').replace('.json', '')}`;
      const title = path.basename(absPath, '.json');
      batch.push({ id, path: relPath, title, data: content });
      count++;
    }

    if (batch.length > 0) {
      insertBatch(batch);
    }

    return count;
  }

  // --- Parsing ---

  private parseMarkdownDoc(relPath: string, content: string, type: string): IndexedDocument {
    const { frontmatter, body } = this.extractFrontmatter(content);
    let parsed: Record<string, unknown> | null = null;
    if (frontmatter) {
      try {
        const result = parseYaml(frontmatter);
        parsed = result && typeof result === 'object' ? result as Record<string, unknown> : null;
      } catch {
        // Some markdown files have YAML-incompatible frontmatter (e.g., markdown links)
        parsed = null;
      }
    }
    const title = this.extractTitle(body) ?? path.basename(relPath, '.md');
    const id = parsed?.id ?? this.pathToId(relPath);
    const sections = this.extractSections(body);

    return {
      id,
      path: relPath,
      type: type as IndexedDocument['type'],
      title,
      frontmatter: parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null,
      body,
      sections,
      outgoing_links: [],
    };
  }

  private extractFrontmatter(content: string): { frontmatter: string | null; body: string } {
    const trimmed = content.trimStart();
    if (!trimmed.startsWith('---')) return { frontmatter: null, body: content };
    const endIdx = trimmed.indexOf('---', 3);
    if (endIdx < 0) return { frontmatter: null, body: content };
    return {
      frontmatter: trimmed.slice(3, endIdx).trim(),
      body: trimmed.slice(endIdx + 3).trim(),
    };
  }

  private extractTitle(body: string): string | null {
    const match = body.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
  }

  private extractSections(body: string): IndexedSection[] {
    const sections: IndexedSection[] = [];
    const lines = body.split('\n');
    let currentSection: IndexedSection | null = null;

    for (const line of lines) {
      const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (hMatch) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          heading: hMatch[2].trim(),
          level: hMatch[1].length,
          content: '',
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }
    if (currentSection) sections.push(currentSection);

    return sections;
  }

  private extractLinks(sourceId: string, body: string, sourcePath: string): LinkEdge[] {
    const links: LinkEdge[] = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(body)) !== null) {
      const linkText = match[1];
      const href = match[2];

      // Skip external URLs
      if (href.startsWith('http://') || href.startsWith('https://')) continue;

      const anchorIdx = href.indexOf('#');
      const targetPath = anchorIdx >= 0 ? href.slice(0, anchorIdx) : href;
      const anchor = anchorIdx >= 0 ? href.slice(anchorIdx + 1) : null;

      // Resolve relative path
      const sourceDir = path.dirname(sourcePath);
      const resolvedPath = targetPath ? path.normalize(path.join(sourceDir, targetPath)) : sourcePath;

      // Get surrounding context (40 chars each side)
      const contextStart = Math.max(0, match.index - 40);
      const contextEnd = Math.min(body.length, match.index + match[0].length + 40);
      const context = body.slice(contextStart, contextEnd).replace(/\n/g, ' ');

      links.push({
        source_id: sourceId,
        target_path: resolvedPath,
        target_anchor: anchor,
        link_text: linkText,
        context,
      });
    }

    return links;
  }

  // --- Queries ---

  /**
   * Full-text search with BM25 ranking.
   */
  search(query: string, limit: number = 20): SearchResult[] {
    return this.db
      .prepare(
        `SELECT d.id, d.path, d.type, d.title,
                snippet(documents_fts, 2, '<mark>', '</mark>', '...', 32) as snippet,
                rank
         FROM documents_fts
         JOIN documents d ON d.rowid = documents_fts.rowid
         WHERE documents_fts MATCH ?
         ORDER BY rank
         LIMIT ?`,
      )
      .all(query, limit) as SearchResult[];
  }

  /**
   * Get a document by ID.
   */
  getDocument(id: string): (IndexedDocument & { sections: IndexedSection[] }) | null {
    const doc = this.db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as any;
    if (!doc) return null;

    const sections = this.db
      .prepare('SELECT heading, level, content FROM sections WHERE doc_id = ? ORDER BY id')
      .all(id) as IndexedSection[];

    return {
      ...doc,
      frontmatter: doc.frontmatter ? JSON.parse(doc.frontmatter) : null,
      sections,
      outgoing_links: [],
    };
  }

  /**
   * Get a document by file path.
   */
  getDocumentByPath(relPath: string): IndexedDocument | null {
    const doc = this.db.prepare('SELECT * FROM documents WHERE path = ?').get(relPath) as any;
    if (!doc) return null;
    return {
      ...doc,
      frontmatter: doc.frontmatter ? JSON.parse(doc.frontmatter) : null,
      sections: [],
      outgoing_links: [],
    };
  }

  /**
   * List all documents of a given type.
   */
  listByType(type: string): { id: string; path: string; title: string }[] {
    return this.db
      .prepare('SELECT id, path, title FROM documents WHERE type = ? ORDER BY id')
      .all(type) as any[];
  }

  /**
   * Find all documents that link TO a given path or ID.
   */
  findReferences(targetIdOrPath: string): { source_id: string; link_text: string; context: string }[] {
    return this.db
      .prepare(
        `SELECT DISTINCT l.source_id, l.link_text, l.context
         FROM links l
         WHERE l.target_path LIKE ? OR l.target_path LIKE ?
         ORDER BY l.source_id`,
      )
      .all(`%${targetIdOrPath}%`, `%${targetIdOrPath}%`) as any[];
  }

  /**
   * Find outgoing links from a document.
   */
  findOutgoingLinks(sourceId: string): LinkEdge[] {
    return this.db
      .prepare('SELECT * FROM links WHERE source_id = ?')
      .all(sourceId) as LinkEdge[];
  }

  /**
   * Get the full link graph as adjacency list.
   */
  getLinkGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    const rows = this.db
      .prepare('SELECT source_id, target_path FROM links')
      .all() as { source_id: string; target_path: string }[];

    for (const row of rows) {
      const existing = graph.get(row.source_id) ?? [];
      existing.push(row.target_path);
      graph.set(row.source_id, existing);
    }
    return graph;
  }

  /**
   * Get index statistics.
   */
  getStats(): { documents: number; sections: number; links: number; byType: Record<string, number> } {
    const documents = (this.db.prepare('SELECT COUNT(*) as c FROM documents').get() as any).c;
    const sections = (this.db.prepare('SELECT COUNT(*) as c FROM sections').get() as any).c;
    const links = (this.db.prepare('SELECT COUNT(*) as c FROM links').get() as any).c;
    const typeRows = this.db
      .prepare('SELECT type, COUNT(*) as c FROM documents GROUP BY type')
      .all() as { type: string; c: number }[];
    const byType: Record<string, number> = {};
    for (const row of typeRows) byType[row.type] = row.c;

    return { documents, sections, links, byType };
  }

  /**
   * Validate all internal links — find broken references.
   */
  validateLinks(): { broken: { source: string; target: string; text: string }[]; total: number } {
    const allLinks = this.db
      .prepare('SELECT source_id, target_path, link_text FROM links')
      .all() as { source_id: string; target_path: string; link_text: string }[];

    const allPaths = new Set(
      (this.db.prepare('SELECT path FROM documents').all() as { path: string }[]).map((r) => r.path),
    );

    const broken: { source: string; target: string; text: string }[] = [];
    for (const link of allLinks) {
      if (!link.target_path) continue;
      // Check if target file exists on disk or in index
      const absTarget = path.join(this.projectRoot, link.target_path);
      if (!allPaths.has(link.target_path) && !fs.existsSync(absTarget)) {
        broken.push({
          source: link.source_id,
          target: link.target_path,
          text: link.link_text,
        });
      }
    }

    return { broken, total: allLinks.length };
  }

  close() {
    this.db.close();
  }

  // --- Helpers ---

  private classifyWorldDoc(relPath: string): string {
    if (relPath.includes('index.md')) return 'region';
    return 'location';
  }

  private pathToId(relPath: string): string {
    return relPath
      .replace(/^docs\//, '')
      .replace(/^gen\//, '')
      .replace(/\.md$/, '')
      .replace(/\//g, ':');
  }

  private walkDir(dir: string, extensions: string[]): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...this.walkDir(fullPath, extensions));
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
    return results;
  }
}
