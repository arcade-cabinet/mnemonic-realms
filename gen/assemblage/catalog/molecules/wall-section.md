---
id: wall-section
size: [3, 2]
palette: village-premium
variants:
  - id: wall-section-red
    description: Red-painted wooden planks, Everwick's signature color
  - id: wall-section-blue
    description: Blue-washed timber, common in Millbrook waterfront
  - id: wall-section-green
    description: Green-stained boards, blending with Ambergrove's canopy
  - id: wall-section-hay
    description: Wattle-and-daub with hay thatch infill, rural Heartfield
---
# Wall Section

A horizontal run of building wall, three tiles wide and two tiles tall. The lower row shows the visible facade with its characteristic color; the upper row shows the wall-to-roof transition where plaster meets beam. Wall sections compose into full building faces when placed side by side.

Each variant uses Atlas tiles from the corresponding wood-color building sheet. The collision is solid -- players cannot walk through walls.

## Layers

### ground
| | | |
|---|---|---|
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |

### objects (red variant)
| | | |
|---|---|---|
| object:wall.red-upper-l | object:wall.red-upper-m | object:wall.red-upper-r |
| object:wall.red-lower-l | object:wall.red-lower-m | object:wall.red-lower-r |

### objects (blue variant)
| | | |
|---|---|---|
| object:wall.blue-upper-l | object:wall.blue-upper-m | object:wall.blue-upper-r |
| object:wall.blue-lower-l | object:wall.blue-lower-m | object:wall.blue-lower-r |

### objects (green variant)
| | | |
|---|---|---|
| object:wall.green-upper-l | object:wall.green-upper-m | object:wall.green-upper-r |
| object:wall.green-lower-l | object:wall.green-lower-m | object:wall.green-lower-r |

### objects (hay variant)
| | | |
|---|---|---|
| object:wall.hay-upper-l | object:wall.hay-upper-m | object:wall.hay-upper-r |
| object:wall.hay-lower-l | object:wall.hay-lower-m | object:wall.hay-lower-r |

## Collision
| | | |
|---|---|---|
| 1 | 1 | 1 |
| 1 | 1 | 1 |

## Notes

- Wall sections are internal molecules, not placed directly on maps. They compose into house organisms.
- Atlas tiles from `Atlas_Buildings_Wood_Red`, `Atlas_Buildings_Wood_Blue`, `Atlas_Buildings_Wood_Green`, and `Atlas_Buildings_Hay` provide the actual pixel art.
- The reference Village Bridge TMX uses these Atlas sheets for all building facades.
- Collision is always solid; openings are created by composing a door-frame molecule at the appropriate position.
