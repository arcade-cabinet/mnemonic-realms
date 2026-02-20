---
id: lookout-hill
size: [12, 10]
palette: village-premium
---
# Lookout Hill

A raised grassy knoll on the eastern edge of Everwick, offering a commanding view of the Settled Lands below. The hill rises above the village rooftops, its crown bare except for wind-bent grass and a single ancient signpost pointing toward the five directions of the known world: Heartfield, Ambergrove, Millbrook, Sunridge, and the unknown Frontier beyond.

This is where Act 1, Scene 12 ("New Resolve") takes place. Lira stands on the hill after returning from her first journey, looking out at the land she will explore. It is a moment of reflection and the emotional capstone of Act 1.

## Layers

### ground
The hill uses a concentric ring pattern of terrain types to suggest elevation:

| Ring | Terrain | Meaning |
|------|---------|---------|
| Outermost (edge) | `terrain:ground.grass` | Base-level grass merging with the map |
| Second ring | `terrain:ground.light-grass` | Slope -- slightly paler, wind-exposed |
| Third ring | `terrain:cliff.brown` | Rocky ledge visible on the hill face |
| Inner plateau | `terrain:ground.light-grass` | Summit -- smooth, sparse grass |
| Center | `terrain:ground.dirt` | Packed earth where people stand to look out |

Computed per-tile based on distance from center (6, 5):
- **dist <= 2**: `terrain:ground.dirt` (summit)
- **2 < dist <= 3**: `terrain:ground.light-grass` (inner slope)
- **3 < dist <= 4**: `terrain:cliff.brown` (rock face)
- **4 < dist <= 5**: `terrain:ground.light-grass` (outer slope)
- **dist > 5**: `terrain:ground.grass` (base)

## Collision
- **Rock face (dist ~3-4)**: 1 on the north, east, and west arcs (cliff face), 0 on the south arc (accessible slope)
- **Summit and slopes**: 0 (walkable)
- **Base**: 0

The player climbs from the south side, following the accessible slope up to the summit.

## Visuals
- **signpost**: `prop.sign-south` at position (6, 4) -- the ancient directional signpost
- **rock-1**: `rock.gray-1` at position (3, 3) -- decorative boulder on the hillside
- **rock-2**: `rock.gray-3` at position (9, 4) -- decorative boulder
- **bush**: `bush.emerald-1` at position (2, 7) -- greenery at the base

## Objects
- **lookout-trigger**: position (5, 4), type: trigger, size: (3, 2) -- triggers the Act 1 Scene 12 cutscene when the player reaches the summit
- **rs-ew-05**: position (7, 5), type: trigger -- Resonance Stone at the lookout point, "A weather-worn stone set into the hillside, facing the open sky"

## Anchors
- **south-path**: position (6, 9) -- connects to the road leading back to Everwick village
- **summit**: position (6, 5) -- the highest point

## Notes

- The `terrain:cliff.brown` ring creates a visual suggestion of elevation using the `Tileset_RockSlope_1_Brown` Wang set. This is a 16x16 tileset that renders rock face tiles.
- The lookout hill is not a separate map -- it is a section of the Everwick map (60x60) placed in the eastern portion.
- The signpost is a story-significant prop. Its text changes based on which zones the player has visited: unvisited directions show "???" while visited ones show the zone name and distance.
- Wind particle effects on the summit (implemented client-side) convey the exposed elevation.
