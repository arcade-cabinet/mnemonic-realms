---
id: fence-section
size: [4, 1]
palette: village-premium
---
# Fence Section

A four-tile horizontal run of wooden post-and-rail fencing. Fences define property boundaries, corral livestock areas, and line roads in the Settled Lands. They use the `Tileset_Fence_1` Wang set for auto-tiled connections -- when fence sections are placed adjacent to each other, the Wang rules automatically resolve corner posts, T-junctions, and end caps.

The entire section is impassable. Gates (fence gaps) are created by leaving a 1-2 tile break between fence sections, not by modifying the fence tiles themselves.

## Layers

### ground
| | | | |
|---|---|---|---|
| terrain:fence | terrain:fence | terrain:fence | terrain:fence |

## Collision
| | | | |
|---|---|---|---|
| 1 | 1 | 1 | 1 |

## Anchors
- **left**: position (0, 0) -- connects to adjacent fence or building
- **right**: position (3, 0) -- connects to adjacent fence or building

## Notes

- The `terrain:fence` reference triggers Wang set auto-tiling via `Tileset_Fence_1`. Adjacent fence tiles automatically resolve to posts, rails, corners, and T-junctions.
- `Tileset_Fence_2` is available as `terrain:fence.2` for a second fence style (darker wood, iron fittings) used in Sunridge and frontier zones.
- Vertical fence runs use the same terrain reference; the Wang set handles orientation automatically.
- For farm fields, fences typically surround a 10x10+ area with a 2-tile gate on one side aligned with a road path.
