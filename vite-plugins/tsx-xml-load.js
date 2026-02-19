import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Vite plugin that handles Tiled XML .tsx tileset files in two code paths:
 *
 * Problem: RPG-JS uses .tsx for Tiled XML tilesets. Vite's transformMiddleware
 * matches .tsx as a JavaScript extension and routes ALL .tsx HTTP requests
 * (including browser fetch/axios) through the module pipeline. The tiled parser
 * (axios.get) expects raw XML text, but receives JS module code instead.
 *
 * Solution:
 * 1. Monkey-patch server.transformRequest to return null for XML .tsx files,
 *    causing Vite's transformMiddleware to call next() instead of serving JS.
 * 2. Add a post-middleware (after Vite internals) that serves raw XML for
 *    these files when transformMiddleware skips them.
 * 3. Keep a load hook as a safety net — if .tsx enters the module graph via
 *    import, return a JS string export to prevent Babel from parsing XML.
 */
export function tsxXmlLoadPlugin() {
  /** Read file, return content only if it's XML tileset data. */
  function readIfXml(filePath) {
    try {
      if (!existsSync(filePath)) return null;
      const content = readFileSync(filePath, 'utf-8');
      const trimmed = content.trimStart();
      if (trimmed.startsWith('<?xml') || trimmed.startsWith('<tileset')) {
        return content;
      }
    } catch {
      // ignore
    }
    return null;
  }

  /** Strip query string and check if URL points to a non-gui .tsx file. */
  function isXmlTsxUrl(url) {
    if (!url || !url.includes('.tsx')) return null;
    const clean = url.split('?')[0];
    if (!clean.endsWith('.tsx')) return null;
    if (clean.includes('node_modules') || clean.includes('/gui/')) return null;
    return clean;
  }

  return {
    name: 'tsx-xml-load',
    enforce: 'pre',

    configureServer(server) {
      // 1. Monkey-patch transformRequest to skip XML .tsx files.
      //    When transformRequest returns null, Vite's transformMiddleware
      //    calls next() instead of serving the JS-transformed response.
      const original = server.transformRequest.bind(server);
      server.transformRequest = async function (url, ...args) {
        const clean = isXmlTsxUrl(url);
        if (clean) {
          const relative = clean.startsWith('/') ? clean.slice(1) : clean;
          const filePath = join(server.config.root, relative);
          if (readIfXml(filePath)) {
            return null; // Skip module transformation
          }
        }
        return original(url, ...args);
      };

      // 2. Return a post-hook: middleware added AFTER Vite's internal
      //    middleware. This catches XML .tsx requests that transformMiddleware
      //    skipped (because transformRequest returned null) and serves raw XML.
      return () => {
        server.middlewares.use((req, res, next) => {
          const clean = isXmlTsxUrl(req.url);
          if (!clean) return next();

          const relative = clean.startsWith('/') ? clean.slice(1) : clean;
          const filePath = join(server.config.root, relative);
          const content = readIfXml(filePath);

          if (content) {
            res.setHeader('Content-Type', 'application/xml');
            res.setHeader('Cache-Control', 'no-cache');
            res.end(content);
            return;
          }

          next();
        });
      };
    },

    // 3. Module pipeline safety net: if .tsx enters Vite's module graph
    //    via a static import (e.g., during dep scanning), return XML as
    //    a JS string export to prevent Babel from parsing it as JSX.
    load(id) {
      if (!id.endsWith('.tsx')) return null;
      if (id.includes('node_modules')) return null;

      const content = readIfXml(id);
      if (content) {
        return {
          code: `export default ${JSON.stringify(content)};`,
          map: null,
        };
      }

      return null;
    },
  };
}
