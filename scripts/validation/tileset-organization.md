# Organized Tileset Structure

Generated: 2026-02-19

## Overview

This document describes the organized tileset structure created for Mnemonic Realms. Tilesets have been reorganized by game zone, prioritizing those with TMX/TSX files and Rules for auto-tiling support.

## Directory Structure

```
assets/tilesets-organized/
├── fortress/           # Fortress and castle areas
│   └── fantasy-castles/
├── sketch-realm/       # Sketch Realm zones (desert, winter)
│   ├── fantasy-desert/
│   └── fantasy-snow/
├── village/            # Everwick and interior spaces
│   └── fantasy-interiors/
├── shared/             # Versatile tilesets usable across multiple zones
│   ├── fantasy-free/
│   ├── fantasy-premium/
│   └── fantasy-seasons/
├── forgotten-realm/    # Reserved for Forgotten Realm tilesets
└── depths/             # Reserved for Depths dungeon tilesets
```

## Tileset Details

### Fortress Zone

#### fantasy-castles
- **Priority:** High (TMX+TSX+Rules)
- **TMX Files:** 3 example maps
- **TSX Files:** 25 tileset definitions
- **Rules Files:** 1 auto-tiling configuration
- **Use Case:** Fortress, castle interiors/exteriors, stone structures
- **Example Map:** `Tiled/Tilemaps/Farmer Hold.tmx`

### Sketch Realm Zone

#### fantasy-desert
- **Priority:** High (TMX+TSX+Rules)
- **TMX Files:** 5 example maps
- **TSX Files:** 29 tileset definitions
- **Rules Files:** 3 auto-tiling configurations
- **Use Case:** Desert areas, sandy terrain, arid environments
- **Example Map:** `Tiled/Tilemaps/Desert Town.tmx`

#### fantasy-snow
- **Priority:** High (TMX+TSX+Rules)
- **TMX Files:** 7 example maps
- **TSX Files:** 32 tileset definitions
- **Rules Files:** 3 auto-tiling configurations
- **Use Case:** Winter/snow areas, frozen terrain, icy environments
- **Example Map:** `Tiled/Tilemaps/Frost Peak.tmx`

### Village Zone

#### fantasy-interiors
- **Priority:** Medium (TMX+TSX)
- **TMX Files:** 11 example maps
- **TSX Files:** 4 tileset definitions
- **Rules Files:** 0
- **Use Case:** Interior spaces, shops, homes, buildings
- **Example Map:** `Tiled/Tilemaps/Butchery_1.tmx`

### Shared Zone (Versatile)

#### fantasy-free
- **Priority:** High (TMX+TSX+Rules)
- **TMX Files:** 2 example maps
- **TSX Files:** 16 tileset definitions
- **Rules Files:** 1 auto-tiling configuration
- **Use Case:** General outdoor areas, fields, basic terrain
- **Example Map:** `Tiled/Tilemaps/Beginning Fields.tmx`

#### fantasy-premium
- **Priority:** High (TMX+TSX+Rules)
- **TMX Files:** 9 example maps
- **TSX Files:** 51 tileset definitions
- **Rules Files:** 5 auto-tiling configurations
- **Use Case:** High-quality outdoor areas, varied terrain, detailed environments
- **Example Map:** `Tiled/Tilemaps/Farm Shore.tmx`

#### fantasy-seasons
- **Priority:** High (TMX+TSX+Rules)
- **TMX Files:** 5 example maps
- **TSX Files:** 25 tileset definitions
- **Rules Files:** 2 auto-tiling configurations
- **Use Case:** Seasonal variations, autumn/spring themes, transitional areas
- **Example Map:** `Tiled/Tilemaps/Autumn Fields.tmx`

## Selection Criteria

Tilesets were selected based on:

1. **TMX/TSX Availability:** Prioritized tilesets with example maps and tileset definitions
2. **Rules Files:** Preferred tilesets with auto-tiling configurations
3. **Game Aesthetic:** Selected tilesets matching the 16-bit JRPG style
4. **Zone Mapping:** Organized by game zones for easy discovery

## Excluded Tilesets

The following tilesets were NOT copied (low priority - no TMX/TSX files):

- `32px` - Custom 32px style (may be used for custom Mnemonic Realms assets)
- `backterria` - Custom 32px style
- `dungeons` - Depths/Dungeons (no TMX/TSX)
- `grand-forests` - Forgotten Realm (no TMX/TSX)
- `lonesome-forest` - Forgotten Realm (no TMX/TSX)
- `natural-interiors` - Depths/Dungeons (no TMX/TSX)
- `old-town-exteriors` - Everwick (no TMX/TSX)
- `old-town-interiors` - Village/Interiors (no TMX/TSX)
- `pixel-dungeon` - Depths/Dungeons (no TMX/TSX)
- `world-map` - Overworld Map (no TMX/TSX)

These tilesets remain in `assets/tilesets/` and can be evaluated later if needed.

## Usage Guidelines

### For Map Designers

1. **Start with example TMX files:** Each tileset includes example maps demonstrating proper usage
2. **Use TSX files:** Reference the TSX tileset definitions for consistent tile IDs
3. **Leverage Rules files:** Auto-tiling configurations simplify terrain creation
4. **Check collision layers:** Example maps show proper collision layer setup

### For Developers

1. **Update asset paths:** Game code should reference `assets/tilesets-organized/[zone]/[tileset]/`
2. **Preserve TMX/TSX structure:** Maintain the Tiled directory structure when copying maps
3. **Test compatibility:** Run TMX/TSX validation (Task 3) before using in game

## Next Steps

1. ✅ **Task 1 Complete:** Tileset audit and inventory
2. ✅ **Task 2 Complete:** Organized asset structure created
3. ⏭️ **Task 3 Next:** Validate TMX/TSX compatibility
   - Test all preserved TMX files load correctly
   - Verify TSX tilesets reference correct PNG paths
   - Check Rules files for auto-tiling configurations
   - Document collision layers in example TMX files

## Statistics

- **Total tilesets organized:** 7
- **High priority:** 6 tilesets
- **Medium priority:** 1 tileset
- **Total TMX example maps:** 42
- **Total TSX definitions:** 182
- **Total Rules files:** 15
- **Zones created:** 6

## Maintenance

- **Original tilesets:** Remain in `assets/tilesets/` (unchanged)
- **Organized tilesets:** Located in `assets/tilesets-organized/` (new structure)
- **Future additions:** Add new tilesets to appropriate zone directories
- **Deprecation:** Low-priority tilesets can be removed from `assets/tilesets/` after validation
