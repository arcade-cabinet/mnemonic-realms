#!/usr/bin/env tsx
import { existsSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

interface TilesetMapping {
  source: string;
  zone: string;
  priority: 'high' | 'medium' | 'low';
  hasTMX: boolean;
  hasTSX: boolean;
  hasRules: boolean;
}

const TILESET_MAPPINGS: TilesetMapping[] = [
  // High priority tilesets (TMX+TSX+Rules)
  {
    source: 'fantasy-castles',
    zone: 'fortress',
    priority: 'high',
    hasTMX: true,
    hasTSX: true,
    hasRules: true,
  },
  {
    source: 'fantasy-desert',
    zone: 'sketch-realm',
    priority: 'high',
    hasTMX: true,
    hasTSX: true,
    hasRules: true,
  },
  {
    source: 'fantasy-free',
    zone: 'shared',
    priority: 'high',
    hasTMX: true,
    hasTSX: true,
    hasRules: true,
  },
  {
    source: 'fantasy-premium',
    zone: 'shared',
    priority: 'high',
    hasTMX: true,
    hasTSX: true,
    hasRules: true,
  },
  {
    source: 'fantasy-seasons',
    zone: 'shared',
    priority: 'high',
    hasTMX: true,
    hasTSX: true,
    hasRules: true,
  },
  {
    source: 'fantasy-snow',
    zone: 'sketch-realm',
    priority: 'high',
    hasTMX: true,
    hasTSX: true,
    hasRules: true,
  },
  // Medium priority tilesets (TMX+TSX)
  {
    source: 'fantasy-interiors',
    zone: 'village',
    priority: 'medium',
    hasTMX: true,
    hasTSX: true,
    hasRules: false,
  },
];

const SOURCE_DIR = 'assets/tilesets';
const TARGET_DIR = 'assets/tilesets-organized';

function organizeTilesets() {
  console.log('🗂️  Organizing tileset assets by zone...\n');

  // Create target directory structure
  const zones = ['fortress', 'sketch-realm', 'village', 'shared', 'forgotten-realm', 'depths'];
  
  for (const zone of zones) {
    const zonePath = join(TARGET_DIR, zone);
    if (!existsSync(zonePath)) {
      mkdirSync(zonePath, { recursive: true });
      console.log(`✅ Created zone directory: ${zone}/`);
    }
  }

  console.log('');

  // Copy tilesets to their zones
  let copiedCount = 0;
  let skippedCount = 0;

  for (const mapping of TILESET_MAPPINGS) {
    const sourcePath = join(SOURCE_DIR, mapping.source);
    const targetPath = join(TARGET_DIR, mapping.zone, mapping.source);

    if (!existsSync(sourcePath)) {
      console.log(`⚠️  Source not found: ${mapping.source} (skipping)`);
      skippedCount++;
      continue;
    }

    try {
      // Copy entire tileset directory
      cpSync(sourcePath, targetPath, { recursive: true });
      
      const priorityEmoji = mapping.priority === 'high' ? '🟢' : mapping.priority === 'medium' ? '🟡' : '🔴';
      const features = [];
      if (mapping.hasTMX) features.push('TMX');
      if (mapping.hasTSX) features.push('TSX');
      if (mapping.hasRules) features.push('Rules');
      
      console.log(`${priorityEmoji} Copied ${mapping.source} → ${mapping.zone}/ [${features.join(', ')}]`);
      copiedCount++;
    } catch (error) {
      console.error(`❌ Failed to copy ${mapping.source}:`, error);
      skippedCount++;
    }
  }

  console.log('');
  console.log('📊 Summary:');
  console.log(`   ✅ Copied: ${copiedCount} tilesets`);
  console.log(`   ⚠️  Skipped: ${skippedCount} tilesets`);
  console.log('');
  console.log(`📁 Organized tilesets available at: ${TARGET_DIR}/`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Review organized structure');
  console.log('   2. Run TMX/TSX compatibility validation (Task 3)');
  console.log('   3. Update game code to reference new paths');
}

// Run the script
organizeTilesets();
