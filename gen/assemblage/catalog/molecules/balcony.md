---
id: balcony
size: [3, 1]
palette: village-premium
variants:
  - id: balcony-red
    description: Iron-railed balcony on a red-painted upper story
  - id: balcony-blue
    description: Weathered balcony on a blue Millbrook waterfront building
  - id: balcony-green
    description: Vine-draped balcony on an Ambergrove woodland house
---
# Balcony

A three-tile-wide upper-floor balcony projecting from the second story of a large building. An iron or wooden railing runs along the front edge, and the floor is planked timber visible beneath the rail. Balconies appear only on large house variants and prominent buildings -- the Bright Hearth inn in Everwick, the harbormaster's residence in Millbrook, the grove-keeper's lodge in Ambergrove.

The balcony molecule is placed in the upper rows of a building organism, overlapping the wall face. It is purely visual and fully impassable since it occupies roofline space that the player never reaches on the exterior map.

## Layers

### objects (red variant)
| | | |
|---|---|---|
| object:balcony.red-l | object:balcony.red-m | object:balcony.red-r |

### objects (blue variant)
| | | |
|---|---|---|
| object:balcony.blue-l | object:balcony.blue-m | object:balcony.blue-r |

### objects (green variant)
| | | |
|---|---|---|
| object:balcony.green-l | object:balcony.green-m | object:balcony.green-r |

## Collision
| | | |
|---|---|---|
| 1 | 1 | 1 |

## Notes

- Balcony tiles are drawn from the `Atlas_Buildings_Bridges` detail sheet, where upper-story detail elements live.
- The balcony is decorative on exterior maps. Interior maps for the building's upper floor may place a door-frame at the balcony position to allow the player to step outside onto it.
- In Millbrook, the blue balconies often have fishing nets or drying lines draped over them -- handled as additional visual prop objects composed at the organism level.
- Ambergrove's green balconies have trailing ivy (`object:vine.ivy-trail`) placed alongside for a wild, overgrown look.
- Only large buildings (5x4 or 6x5 footprint) have enough wall height for a balcony row. Medium buildings are too short.
