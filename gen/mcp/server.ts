#!/usr/bin/env node
/**
 * Mnemonic Realms MCP Server
 *
 * Exposes the entire game world as typed tools for Claude.
 * Backed by SQLite FTS5 for search and a link graph for reference traversal.
 *
 * Tools:
 *   - search: Full-text search across all game content (BM25 ranked)
 *   - get_document: Get a document by ID with frontmatter + sections
 *   - list_documents: List all documents of a given type
 *   - find_references: Reverse link lookup — what documents reference this?
 *   - find_outgoing_links: Forward link lookup — what does this document link to?
 *   - validate_links: Check for broken internal links
 *   - get_stats: Index statistics
 *   - read_file: Read any project file by relative path
 *   - reindex: Rebuild the full content index
 *
 * Resources:
 *   - mnemonic://docs/{path} — any doc file content
 *   - mnemonic://index/stats — current index statistics
 *
 * Start: npx tsx gen/mcp/server.ts
 * Configure: .claude/mcps.json
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { ContentIndexer } from './indexer.js';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../..');
const DB_PATH = path.join(PROJECT_ROOT, '.mcp-index.db');

// Initialize indexer with persistent database
const indexer = new ContentIndexer(DB_PATH, PROJECT_ROOT);

// Auto-index on first start if database is empty
const stats = indexer.getStats();
if (stats.documents === 0) {
  const result = indexer.indexAll();
  process.stderr.write(`[mnemonic-mcp] Indexed ${result.count} documents in ${result.elapsed}ms\n`);
}

// Create MCP server
const server = new McpServer({
  name: 'mnemonic-realms',
  version: '1.0.0',
});

// --- Tools ---

server.tool(
  'search',
  'Full-text search across all game content (docs, DDL, assemblages). Returns BM25-ranked results with snippets.',
  {
    query: z.string().describe('Search query (supports FTS5 syntax: AND, OR, NOT, "exact phrase", prefix*)'),
    limit: z.number().optional().default(20).describe('Maximum results to return'),
    type: z.string().optional().describe('Filter by document type: location, region, assemblage, story, design, ddl'),
  },
  async ({ query, limit, type }) => {
    let results = indexer.search(query, limit);
    if (type) {
      results = results.filter((r) => r.type === type);
    }
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  },
);

server.tool(
  'get_document',
  'Get a document by ID. Returns frontmatter (parsed YAML), body, and sections. Use for locations (everwick), regions (settled-lands), assemblages, story docs, DDL data.',
  {
    id: z.string().describe('Document ID (e.g., "everwick", "settled-lands", "ddl:regions/settled-lands")'),
  },
  async ({ id }) => {
    const doc = indexer.getDocument(id);
    if (!doc) {
      return {
        content: [{ type: 'text', text: `Document not found: ${id}` }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              id: doc.id,
              path: doc.path,
              type: doc.type,
              title: doc.title,
              frontmatter: doc.frontmatter,
              sections: doc.sections.map((s) => ({
                heading: s.heading,
                level: s.level,
                contentLength: s.content.length,
              })),
              bodyPreview: doc.body.slice(0, 500) + (doc.body.length > 500 ? '...' : ''),
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  'get_document_section',
  'Get a specific section from a document by heading name. Returns the full content under that heading.',
  {
    id: z.string().describe('Document ID'),
    heading: z.string().describe('Section heading to extract (e.g., "Buildings", "NPCs", "Events")'),
  },
  async ({ id, heading }) => {
    const doc = indexer.getDocument(id);
    if (!doc) {
      return { content: [{ type: 'text', text: `Document not found: ${id}` }], isError: true };
    }

    const normalizedTarget = heading.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const section = doc.sections.find(
      (s) => s.heading.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() === normalizedTarget,
    );

    if (!section) {
      return {
        content: [
          {
            type: 'text',
            text: `Section "${heading}" not found in ${id}. Available: ${doc.sections.map((s) => s.heading).join(', ')}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: 'text', text: `## ${section.heading}\n\n${section.content}` }],
    };
  },
);

server.tool(
  'get_document_full',
  'Get the complete raw content of a document (frontmatter + body). Use when you need the full markdown.',
  {
    id: z.string().describe('Document ID'),
  },
  async ({ id }) => {
    const doc = indexer.getDocument(id);
    if (!doc) {
      return { content: [{ type: 'text', text: `Document not found: ${id}` }], isError: true };
    }

    const frontmatterStr = doc.frontmatter ? `---\n${JSON.stringify(doc.frontmatter, null, 2)}\n---\n\n` : '';
    return {
      content: [{ type: 'text', text: frontmatterStr + doc.body }],
    };
  },
);

server.tool(
  'list_documents',
  'List all documents of a given type. Types: location, region, assemblage, story, design, ddl.',
  {
    type: z.string().describe('Document type to list'),
  },
  async ({ type }) => {
    const docs = indexer.listByType(type);
    return {
      content: [{ type: 'text', text: JSON.stringify(docs, null, 2) }],
    };
  },
);

server.tool(
  'find_references',
  'Find all documents that link TO a given document (reverse lookup). Answers: "what references this assemblage/NPC/location?"',
  {
    target: z.string().describe('Target document ID or path fragment to search for in link targets'),
  },
  async ({ target }) => {
    const refs = indexer.findReferences(target);
    return {
      content: [
        {
          type: 'text',
          text: refs.length > 0
            ? JSON.stringify(refs, null, 2)
            : `No references found for: ${target}`,
        },
      ],
    };
  },
);

server.tool(
  'find_outgoing_links',
  'Find all links FROM a document (forward lookup). Shows what this document references.',
  {
    source_id: z.string().describe('Source document ID'),
  },
  async ({ source_id }) => {
    const links = indexer.findOutgoingLinks(source_id);
    return {
      content: [{ type: 'text', text: JSON.stringify(links, null, 2) }],
    };
  },
);

server.tool(
  'validate_links',
  'Check all internal markdown links for broken references. Returns broken links with source and target.',
  {},
  async () => {
    const result = indexer.validateLinks();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              total_links: result.total,
              broken_count: result.broken.length,
              broken: result.broken,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.tool(
  'get_stats',
  'Get index statistics: document counts by type, section count, link count.',
  {},
  async () => {
    const stats = indexer.getStats();
    return {
      content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }],
    };
  },
);

server.tool(
  'read_file',
  'Read any project file by relative path. Use for files not in the index (TypeScript, JSON, config).',
  {
    path: z.string().describe('Relative path from project root (e.g., "gen/assemblage/types.ts")'),
  },
  async ({ path: relPath }) => {
    const absPath = path.join(PROJECT_ROOT, relPath);
    if (!fs.existsSync(absPath)) {
      return { content: [{ type: 'text', text: `File not found: ${relPath}` }], isError: true };
    }
    const stat = fs.statSync(absPath);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(absPath);
      return { content: [{ type: 'text', text: entries.join('\n') }] };
    }
    const content = fs.readFileSync(absPath, 'utf-8');
    return { content: [{ type: 'text', text: content }] };
  },
);

server.tool(
  'reindex',
  'Rebuild the full content index. Run after modifying markdown docs or DDL files.',
  {},
  async () => {
    const result = indexer.indexAll();
    return {
      content: [
        {
          type: 'text',
          text: `Reindexed ${result.count} documents in ${result.elapsed}ms`,
        },
      ],
    };
  },
);

// --- Resources ---

server.resource(
  'index-stats',
  'mnemonic://index/stats',
  { description: 'Current content index statistics', mimeType: 'application/json' },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(indexer.getStats(), null, 2),
        mimeType: 'application/json',
      },
    ],
  }),
);

// --- Start ---

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write('[mnemonic-mcp] Server running on stdio\n');
