import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { XMLParser } from 'fast-xml-parser';

interface TilesetRef {
  '@_firstgid': number;
  '@_source': string;
}

interface Layer {
  id: number;
  name: string;
  width?: number;
  height?: number;
  data?: string;
}

interface TMXMap {
  map: {
    '@_version': string;
    '@_width': number;
    '@_height': number;
    '@_tilewidth': number;
    '@_tileheight': number;
    tileset: TilesetRef | TilesetRef[];
    layer?: Layer | Layer[];
    objectgroup?: unknown;
  };
}

interface TSXTileset {
  tileset: {
    '@_name': string;
    '@_tilewidth': number;
    '@_tileheight': number;
    '@_tilecount': number;
    image: {
      '@_source': string;
      '@_width': number;
      '@_height': number;
    };
  };
}

interface ValidationResult {
  tmxFile: string;
  success: boolean;
  errors: string[];
  warnings: string[];
  tilesets: {
    source: string;
    exists: boolean;
    pngExists: boolean;
    pngPath?: string;
  }[];
  collisionLayers: string[];
  isRulesFile: boolean;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

function parseTMX(tmxPath: string): TMXMap | null {
  try {
    const content = readFileSync(tmxPath, 'utf-8');
    return parser.parse(content) as TMXMap;
  } catch (error) {
    console.error(`Failed to parse TMX: ${tmxPath}`, error);
    return null;
  }
}

function parseTSX(tsxPath: string): TSXTileset | null {
  try {
    const content = readFileSync(tsxPath, 'utf-8');
    return parser.parse(content) as TSXTileset;
  } catch (error) {
    console.error(`Failed to parse TSX: ${tsxPath}`, error);
    return null;
  }
}

function validateTMXFile(tmxPath: string): ValidationResult {
  const result: ValidationResult = {
    tmxFile: tmxPath,
    success: true,
    errors: [],
    warnings: [],
    tilesets: [],
    collisionLayers: [],
    isRulesFile: tmxPath.includes('Rules'),
  };

  const tmxData = parseTMX(tmxPath);
  if (!tmxData) {
    result.success = false;
    result.errors.push('Failed to parse TMX file');
    return result;
  }

  const tmxDir = dirname(tmxPath);
  
  // Debug: log the structure
  if (!tmxData.map.tileset) {
    result.warnings.push('No tileset elements found in TMX');
  }
  
  const tilesets = tmxData.map.tileset
    ? Array.isArray(tmxData.map.tileset)
      ? tmxData.map.tileset
      : [tmxData.map.tileset]
    : [];

  for (const tileset of tilesets) {
    if (!tileset || !tileset['@_source']) {
      result.warnings.push('Tileset reference missing source attribute');
      continue;
    }

    const tsxPath = resolve(tmxDir, tileset['@_source']);
    const tsxExists = existsSync(tsxPath);

    const tilesetResult = {
      source: tileset['@_source'],
      exists: tsxExists,
      pngExists: false,
      pngPath: undefined as string | undefined,
    };

    if (!tsxExists) {
      result.errors.push(`TSX file not found: ${tileset['@_source']}`);
      result.success = false;
    } else {
      const tsxData = parseTSX(tsxPath);
      if (tsxData && tsxData.tileset) {
        // Check for single image tileset
        if (tsxData.tileset.image) {
          const imageSource = tsxData.tileset.image['@_source'];
          if (imageSource) {
            const pngPath = resolve(dirname(tsxPath), imageSource);
            tilesetResult.pngPath = imageSource;
            tilesetResult.pngExists = existsSync(pngPath);

            if (!tilesetResult.pngExists) {
              result.errors.push(
                `PNG file not found: ${imageSource} (referenced by ${tileset['@_source']})`,
              );
              result.success = false;
            }
          } else {
            result.warnings.push(`TSX ${tileset['@_source']} has no image source`);
          }
        } else if (tsxData.tileset.tile) {
          // Collection tileset - each tile has its own image
          result.warnings.push(`TSX ${tileset['@_source']} is a collection tileset (individual tile images)`);
          tilesetResult.pngPath = 'collection';
          tilesetResult.pngExists = true; // Assume valid for now
        } else {
          result.warnings.push(`TSX ${tileset['@_source']} has no image or tile elements`);
        }
      } else {
        result.errors.push(`Failed to parse TSX: ${tileset['@_source']}`);
        result.success = false;
      }
    }

    result.tilesets.push(tilesetResult);
  }

  const layers = tmxData.map.layer
    ? Array.isArray(tmxData.map.layer)
      ? tmxData.map.layer
      : [tmxData.map.layer]
    : [];

  for (const layer of layers) {
    if (!layer || !layer.name) {
      continue;
    }
    const layerName = layer.name.toLowerCase();
    if (
      layerName.includes('collision') ||
      layerName.includes('collide') ||
      layerName.includes('block')
    ) {
      result.collisionLayers.push(layer.name);
    }
  }

  if (result.collisionLayers.length === 0 && !result.isRulesFile) {
    result.warnings.push('No collision layers detected (expected layer name with collision/collide/block)');
  }

  return result;
}

function generateReport(results: ValidationResult[]): string {
  const totalFiles = results.length;
  const successCount = results.filter((r) => r.success).length;
  const failCount = totalFiles - successCount;
  const rulesCount = results.filter((r) => r.isRulesFile).length;

  let report = '# TMX/TSX Compatibility Report\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- Total TMX files: ${totalFiles}\n`;
  report += `- Valid: ${successCount}\n`;
  report += `- Invalid: ${failCount}\n`;
  report += `- Rules files: ${rulesCount}\n\n`;

  if (failCount > 0) {
    report += `## ❌ Failed Validations (${failCount})\n\n`;
    for (const result of results.filter((r) => !r.success)) {
      report += `### ${result.tmxFile}\n\n`;
      for (const error of result.errors) {
        report += `- ❌ ${error}\n`;
      }
      report += '\n';
    }
  }

  report += `## ✅ Valid TMX Files (${successCount})\n\n`;
  for (const result of results.filter((r) => r.success)) {
    report += `### ${result.tmxFile}\n\n`;
    report += `- Tilesets: ${result.tilesets.length}\n`;
    report += `- Collision layers: ${result.collisionLayers.length > 0 ? result.collisionLayers.join(', ') : 'None'}\n`;
    if (result.isRulesFile) {
      report += '- Type: Auto-tiling Rules file\n';
    }
    if (result.warnings.length > 0) {
      for (const warning of result.warnings) {
        report += `- ⚠️  ${warning}\n`;
      }
    }
    report += '\n';
  }

  report += `## Collision Layer Documentation\n\n`;
  const filesWithCollision = results.filter((r) => r.collisionLayers.length > 0);
  if (filesWithCollision.length > 0) {
    report += `Found collision layers in ${filesWithCollision.length} files:\n\n`;
    for (const result of filesWithCollision) {
      report += `- **${result.tmxFile}**: ${result.collisionLayers.join(', ')}\n`;
    }
  } else {
    report += 'No collision layers found in any TMX files.\n';
  }

  return report;
}

function main() {
  const tmxFiles = execSync('find assets/tilesets-organized -name "*.tmx"', { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .filter((f: string) => f.length > 0);

  console.log(`Found ${tmxFiles.length} TMX files to validate...\n`);

  const results: ValidationResult[] = [];
  for (const tmxFile of tmxFiles) {
    console.log(`Validating: ${tmxFile}`);
    const result = validateTMXFile(tmxFile);
    results.push(result);
    if (!result.success) {
      console.log(`  ❌ FAILED: ${result.errors.length} errors`);
    } else {
      console.log(`  ✅ VALID`);
    }
  }

  const report = generateReport(results);
  const reportPath = 'scripts/validation/tmx-compatibility-report.md';
  writeFileSync(reportPath, report);

  const jsonPath = 'scripts/validation/tmx-compatibility-report.json';
  writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  console.log(`\n✅ Validation complete!`);
  console.log(`📄 Report: ${reportPath}`);
  console.log(`📄 JSON: ${jsonPath}`);

  const failCount = results.filter((r) => !r.success).length;
  if (failCount > 0) {
    console.log(`\n⚠️  ${failCount} files failed validation`);
    process.exit(1);
  }
}

main();
