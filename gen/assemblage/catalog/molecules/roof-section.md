---
id: roof-section
size: [4, 2]
palette: village-premium
variants:
  - id: roof-section-red
    description: Clay-tiled red roof, standard Everwick architecture
  - id: roof-section-blue
    description: Slate-blue shingles, Millbrook waterfront style
  - id: roof-section-green
    description: Moss-stained wooden shakes, Ambergrove forest houses
  - id: roof-section-hay
    description: Bundled thatch, Heartfield farmstead roofing
---
# Roof Section

A four-tile-wide, two-tile-tall section of peaked roofing. The top row contains the ridge tiles (peak line), and the bottom row contains the slope tiles that overhang the wall below. Roof sections sit above wall sections in the vertical layout of a building organism.

Roofs extend one tile beyond the building walls on each side to create realistic eaves. This overhang renders above the ground layer but does not block movement -- the collision for the overhang tiles is 0 since the player walks beneath the eaves.

## Layers

### objects (red variant)
| | | | |
|---|---|---|---|
| object:roof.red-peak-l | object:roof.red-peak-ml | object:roof.red-peak-mr | object:roof.red-peak-r |
| object:roof.red-slope-l | object:roof.red-slope-ml | object:roof.red-slope-mr | object:roof.red-slope-r |

### objects (blue variant)
| | | | |
|---|---|---|---|
| object:roof.blue-peak-l | object:roof.blue-peak-ml | object:roof.blue-peak-mr | object:roof.blue-peak-r |
| object:roof.blue-slope-l | object:roof.blue-slope-ml | object:roof.blue-slope-mr | object:roof.blue-slope-r |

### objects (green variant)
| | | | |
|---|---|---|---|
| object:roof.green-peak-l | object:roof.green-peak-ml | object:roof.green-peak-mr | object:roof.green-peak-r |
| object:roof.green-slope-l | object:roof.green-slope-ml | object:roof.green-slope-mr | object:roof.green-slope-r |

### objects (hay variant)
| | | | |
|---|---|---|---|
| object:roof.hay-peak-l | object:roof.hay-peak-ml | object:roof.hay-peak-mr | object:roof.hay-peak-r |
| object:roof.hay-slope-l | object:roof.hay-slope-ml | object:roof.hay-slope-mr | object:roof.hay-slope-r |

## Collision
| | | | |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 |

## Notes

- Roofs are always impassable. Players never walk on rooftops in the Settled Lands maps.
- The Atlas building sheets contain pre-composed roof tiles for each color variant.
- For houses wider than 4 tiles, repeat the middle peak/slope tiles horizontally.
- Chimney molecules overlay the ridge row at a specified offset.
