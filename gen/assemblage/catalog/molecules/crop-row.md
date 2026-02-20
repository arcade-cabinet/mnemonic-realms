---
id: crop-row
size: [6, 1]
palette: village-premium
variants:
  - id: crop-row-wheat
    terrain: terrain:farm
    description: Golden wheat swaying in the breeze, Heartfield's signature crop
  - id: crop-row-hay
    terrain: terrain:tallgrass.hay
    description: Bundled hay stalks drying in the sun
  - id: crop-row-flower
    terrain: terrain:tallgrass.flower
    description: Flowering groundcover between crop strips
---
# Crop Row

A six-tile horizontal strip of cultivated farmland. Crop rows are the atomic unit of Heartfield's rolling fields -- they tile horizontally to fill wide farm-field organisms and stack vertically with dirt-path separators between them.

The `terrain:farm` reference triggers Wang set auto-tiling from `Tileset_FarmField`, which produces tilled-earth rows with crop overlays. The `tallgrass.hay` and `tallgrass.flower` variants use `Tileset_TallGrass` Wang sets for untilled grassland variations.

Crop rows are fully walkable. Random encounters (Meadow Sprites, Grass Serpents) trigger in farm terrain zones.

## Layers

### ground (wheat variant)
| | | | | | |
|---|---|---|---|---|---|
| terrain:farm | terrain:farm | terrain:farm | terrain:farm | terrain:farm | terrain:farm |

### ground (hay variant)
| | | | | | |
|---|---|---|---|---|---|
| terrain:tallgrass.hay | terrain:tallgrass.hay | terrain:tallgrass.hay | terrain:tallgrass.hay | terrain:tallgrass.hay | terrain:tallgrass.hay |

### ground (flower variant)
| | | | | | |
|---|---|---|---|---|---|
| terrain:tallgrass.flower | terrain:tallgrass.flower | terrain:tallgrass.flower | terrain:tallgrass.flower | terrain:tallgrass.flower | terrain:tallgrass.flower |

## Collision
| | | | | | |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 |

## Notes

- The `Tileset_FarmField` Wang set (`Farm Fields` / `Farm Field` color) produces coherent field patterns when crop-row tiles are placed adjacently.
- Between crop rows, insert a 1-tile strip of `terrain:ground.dirt` as a walking path for farmers and the player.
- For Heartfield's stagnation clearings, replace some crop rows with `terrain:sand` + `terrain:shadow.light` overlay to show crystallized fields that have stopped growing.
- Hay bale visual objects (`prop.barrel-empty` as placeholder) scatter among crop rows for visual variety.
