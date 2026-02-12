# Terrain Tileset

This directory contains the terrain tileset for Mnemonic Realms.

## terrain.png

A 256x32 pixel tileset containing 8 tiles (32x32 each):

1. Plains - Green grass tile
2. Forest - Dark green trees tile
3. Mountain - Gray/brown rocky tile
4. Desert - Yellow sand tile
5. Swamp - Dark green/brown murky tile
6. Tundra - White/light blue ice tile
7. Volcano - Red/orange lava tile
8. Ocean - Blue water tile

## Creating Custom Tilesets

1. Create a 256x32 PNG with 8 tiles
2. Update terrain.tsx to reference your PNG
3. Ensure each tile is 32x32 pixels
4. Add any custom properties in the TSX file

## Example Usage

```typescript
import { ProceduralMapGenerator } from 'mnemonic-realms';

const gen = new ProceduralMapGenerator('ancient mystic forest');
const tiledMap = gen.generateTiledMap(20, 20);
// Export to JSON and load in Tiled or RPG-JS
```
