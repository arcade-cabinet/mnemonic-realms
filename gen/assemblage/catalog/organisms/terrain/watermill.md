---
id: watermill
size: [8, 6]
palette: village-premium
parameterized: true
params:
  objectRef: house.hay-large-1
  facing: [north, south, east, west]
  npc: { name, sprite, dialogue } | null
  resonanceStone: { id, fragments } | null
---
# Watermill

A working watermill perched on the riverbank, its great wheel turning in the current. The mill building is a large hay-roofed structure with a stone foundation extending into the water. The wheel mechanism is visible as an animated element on the river-facing side.

Watermills are the economic heart of river settlements. In Millbrook, the Brightwater Mill grinds grain shipped downriver from Heartfield. The constant rhythm of the wheel is audible throughout the waterfront district, and the millrace creates a zone of fast-flowing water that the player cannot cross.

## Layers

### ground
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| terrain:ground.grass | terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass | terrain:ground.grass |
| terrain:ground.grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.grass |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.sand | terrain:ground.sand | terrain:ground.sand | terrain:ground.sand | terrain:ground.sand | terrain:ground.sand | terrain:ground.sand | terrain:ground.sand |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

### water
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| terrain:water.shallow | terrain:water.shallow | terrain:water.shallow | terrain:water.shallow | terrain:water.shallow | terrain:water.shallow | terrain:water.shallow | terrain:water.shallow |
| terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep | terrain:water.deep |

## Collision
| | | | | | | | |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

## Visuals
- **mill-building**: `house.hay-large-1` at position (2, 0) -- the mill structure
- **mill-wheel**: animated waterfall or custom animation at position (3, 4) -- visible wheel turning in the river

## Objects
- **mill-entrance**: position (3, 3), type: transition -- door to the mill interior
- **miller-npc**: position (4, 3), type: npc -- the miller standing at the entrance
- **Resonance stone**: position (7, 3), type: trigger -- hidden near the millrace

## Anchors
- **road-north**: (4, 0) -- connects to the main road
- **road-south**: (4, 3) -- approach path from the south
- **river-east**: (7, 4) -- connects to adjacent river segment
- **river-west**: (0, 4) -- connects to adjacent river segment

## Notes

- The watermill is the only building that directly interfaces with a river organism. Its water rows align with the river channel.
- The `Animation_Waterfall` TSX could provide the wheel animation effect if a dedicated wheel animation is not available.
- In Millbrook, the mill sits mid-bank on the Brightwater River. The miller is an NPC with side-quest dialogue about the grain shipments from Heartfield being disrupted.
- The existing windmill TypeScript factory (`gen/assemblage/assemblages/buildings/windmill.ts`) handles a different structure (hilltop windmill). The watermill is a new organism for river-powered mills.
