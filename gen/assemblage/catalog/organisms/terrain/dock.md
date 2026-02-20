---
id: dock
size: [4, 6]
palette: village-premium
parameterized: true
params:
  length: 4-10
  width: 3-5
  facing: [north, south, east, west]
  npc: { name, sprite, dialogue } | null
  resonanceStone: { id, fragments } | null
  chest: { id, contents } | null
---
# Dock

A wooden platform extending from the shore out over the water, used for fishing, trade, and quiet contemplation at the water's edge. Docks are rectangular structures of weathered planking with mooring posts along their edges and an open end facing the water.

The deck uses road-layer terrain (defaulting to `terrain:road.dirt` to suggest wooden planks), rendering above the water layer. There is no ground layer beneath the dock -- the water is visible through gaps in the planking (handled by the water layer below).

## Layers

### road
The entire dock footprint is filled with `terrain:road.dirt` (plank decking) on the road layer.

For a south-facing dock (width=4, length=6):

| | | | |
|---|---|---|---|
| terrain:road.dirt | terrain:road.dirt | terrain:road.dirt | terrain:road.dirt |
| terrain:road.dirt | terrain:road.dirt | terrain:road.dirt | terrain:road.dirt |
| terrain:road.dirt | terrain:road.dirt | terrain:road.dirt | terrain:road.dirt |
| terrain:road.dirt | terrain:road.dirt | terrain:road.dirt | terrain:road.dirt |
| terrain:road.dirt | terrain:road.dirt | terrain:road.dirt | terrain:road.dirt |
| terrain:road.dirt | terrain:road.dirt | terrain:road.dirt | terrain:road.dirt |

## Collision
Side edges and far end are impassable (prevents walking into water). The center deck is walkable.

For a south-facing dock (width=4, length=6):

| | | | |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 |

Top row (shore connection) is fully open. Side columns block water access. Bottom row (far end over water) is blocked.

## Visuals
- **mooring-post**: `prop.barrel-empty` (placeholder for post) at intervals along the side edges
- **crate-stack**: `prop.crate-medium` near the shore end for cargo atmosphere

## Objects
- **fisher-npc**: at the far end of the dock, type: npc -- a fisherman with side-quest dialogue
- **resonance-stone**: near the waterline, type: trigger -- a stone worn smooth by the river
- **supply-chest**: near the shore end, type: chest -- dockside storage

## Anchors
- **shore**: the connection point on land (top row for south-facing, bottom row for north-facing)
- **end**: the far point over water

## Notes

- In Millbrook, the Fisher's Rest dock (Act 1, Scene 7) extends south into the Brightwater River. Fisher Tam stands at the end with SQ-04 dialogue, and RS-MB-03 is near the waterline.
- Dock assemblages overlay river or lake water tiles. The road-layer deck renders above the water, creating the visual of a pier over water.
- The existing TypeScript factory in `gen/assemblage/assemblages/buildings/dock.ts` implements the same collision pattern.
- For Shimmer Marsh (Act 2), docks become stilted observation platforms over marsh pools -- same structure, different narrative framing.
