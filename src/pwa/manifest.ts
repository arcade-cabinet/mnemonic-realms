import type { PWAManifest } from './types.js';

/**
 * PWA manifest configuration for Mnemonic Realms
 * This manifest enables the game to be installed as a Progressive Web App
 */
export const manifest: PWAManifest = {
  name: 'Mnemonic Realms',
  short_name: 'Mnemonic Realms',
  description: 'A 16-bit JRPG about memory as creative vitality',
  start_url: '/mnemonic-realms/',
  display: 'standalone',
  background_color: '#000000',
  theme_color: '#1a1a2e',
  orientation: 'landscape',
  icons: [
    {
      src: '/mnemonic-realms/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/mnemonic-realms/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
  screenshots: [
    {
      src: '/mnemonic-realms/screenshot-wide.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
    },
  ],
  categories: ['games', 'entertainment'],
  prefer_related_applications: false,
};

/**
 * Get the PWA manifest configuration
 */
export function getManifest(): PWAManifest {
  return manifest;
}
