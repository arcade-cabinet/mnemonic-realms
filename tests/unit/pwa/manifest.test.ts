import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { manifest, getManifest } from '../../../src/pwa/manifest.js';
import type { PWAManifest } from '../../../src/pwa/types.js';

describe('PWA Manifest', () => {
  it('should have valid app metadata', () => {
    expect(manifest.name).toBe('Mnemonic Realms');
    expect(manifest.short_name).toBe('Mnemonic Realms');
    expect(manifest.description).toBe('A 16-bit JRPG about memory as creative vitality');
  });

  it('should have correct start URL', () => {
    expect(manifest.start_url).toBe('/mnemonic-realms/');
  });

  it('should have standalone display mode', () => {
    expect(manifest.display).toBe('standalone');
  });

  it('should have landscape orientation', () => {
    expect(manifest.orientation).toBe('landscape');
  });

  it('should have correct theme colors', () => {
    expect(manifest.background_color).toBe('#000000');
    expect(manifest.theme_color).toBe('#1a1a2e');
  });

  it('should have required icon sizes', () => {
    const iconSizes = manifest.icons.map((icon) => icon.sizes);
    expect(iconSizes).toContain('192x192');
    expect(iconSizes).toContain('512x512');
  });

  it('should have icons with correct paths', () => {
    for (const icon of manifest.icons) {
      expect(icon.src).toMatch(/^\/mnemonic-realms\/icon-\d+\.png$/);
      expect(icon.type).toBe('image/png');
      expect(icon.purpose).toBe('any maskable');
    }
  });

  it('should have screenshots configured', () => {
    expect(manifest.screenshots).toBeDefined();
    expect(manifest.screenshots?.length).toBeGreaterThan(0);
    const screenshot = manifest.screenshots?.[0];
    expect(screenshot?.src).toBe('/mnemonic-realms/screenshot-wide.png');
    expect(screenshot?.form_factor).toBe('wide');
  });

  it('should have game categories', () => {
    expect(manifest.categories).toContain('games');
    expect(manifest.categories).toContain('entertainment');
  });

  it('should not prefer related applications', () => {
    expect(manifest.prefer_related_applications).toBe(false);
  });

  it('should return manifest from getManifest function', () => {
    const result = getManifest();
    expect(result).toEqual(manifest);
  });

  it('should match manifest.json file in assets', () => {
    const manifestPath = join(process.cwd(), 'assets', 'manifest.json');
    const fileContent = readFileSync(manifestPath, 'utf-8');
    const fileManifest: PWAManifest = JSON.parse(fileContent);

    expect(fileManifest.name).toBe(manifest.name);
    expect(fileManifest.short_name).toBe(manifest.short_name);
    expect(fileManifest.description).toBe(manifest.description);
    expect(fileManifest.start_url).toBe(manifest.start_url);
    expect(fileManifest.display).toBe(manifest.display);
    expect(fileManifest.background_color).toBe(manifest.background_color);
    expect(fileManifest.theme_color).toBe(manifest.theme_color);
    expect(fileManifest.orientation).toBe(manifest.orientation);
    expect(fileManifest.icons.length).toBe(manifest.icons.length);
  });
});
