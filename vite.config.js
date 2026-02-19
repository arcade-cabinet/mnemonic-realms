import { defineConfig } from 'vite';
import { tsxXmlLoadPlugin } from './vite-plugins/tsx-xml-load.js';

/**
 * Project-level Vite config — merged with RPG-JS compiler's inline config.
 *
 * The RPG-JS compiler (client-config.js) checks for vite.config.js in the
 * project root and sets it as configFile. Vite merges our plugins with
 * the compiler's inline plugins.
 *
 * We use this to register middleware extensions that the stock compiler
 * doesn't provide, without needing additional pnpm patches.
 */
export default defineConfig({
  plugins: [
    // Prevent Babel from parsing Tiled XML .tsx files as JSX,
    // and serve them as raw XML via HTTP middleware for the TMX parser.
    tsxXmlLoadPlugin(),
  ],
  // Tell Vite to treat .tsx files as static assets, not JS modules.
  // RPG-JS uses .tsx for Tiled XML tileset data (not TypeScript JSX).
  // The compiler's assetsInclude pattern "{!(gui)/**/*}.tsx" doesn't
  // match reliably in picomatch — this simpler pattern works.
  assetsInclude: ['**/*.tsx'],
});
