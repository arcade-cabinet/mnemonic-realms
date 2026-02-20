---
id: lake
size: [14, 12]
palette: village-premium
parameterized: true
params:
  width: 8-20
  height: 6-16
  submergedObject: { id: string, description: string, quest: string } | null
  shoreDecor: boolean
---
# Lake

An irregular body of still water with sandy shores, used for ponds, tarns, and the Ambergrove lake. The water body is elliptical, with deep water in the center transitioning to shallow water at the edges, then a sandy shore strip, and finally the surrounding grass.

Lakes are impassable -- the player cannot walk into the water. The sandy shore is walkable, providing an approach path for interactions with submerged objects (dormant resonance stones, quest-related items beneath the surface).

## Layers

### ground
Computed per-tile based on elliptical distance from center:
- **dist <= 0.7**: 0 (transparent -- deep water above)
- **0.7 < dist <= 1.0**: `terrain:ground.sand` (beneath shallow water)
- **1.0 < dist <= 1.3**: `terrain:ground.sand` (dry shore)
- **dist > 1.3**: `terrain:ground.grass` (surrounding land)

### water
- **dist <= 0.7**: `terrain:water.deep`
- **0.7 < dist <= 1.0**: `terrain:water.shallow`
- **dist > 1.0**: 0 (no water)

## Collision
- **dist <= 1.0**: 1 (impassable -- water)
- **1.0 < dist <= 1.3**: 0 (walkable shore)
- **dist > 1.3**: 0 (walkable land)

## Visuals
- Optional shore decorations: `bush.emerald-1` at west shore, `bush.emerald-2` at east shore
- `rock.moss-1` and `rock.gray-1` placed along the shore for natural look

## Objects
- **Submerged object**: trigger at center tile, activated when player reaches the shore and examines the water. Properties: `eventType: action`, `description`, optional `linkedQuest`

## Anchors
- **north-shore**: (center_x, 0)
- **south-shore**: (center_x, height-1)
- **west-shore**: (0, center_y)
- **east-shore**: (width-1, center_y)

## Notes

- The `Tileset_Water` Wang set (`Water` / `Water` color) handles all shore-to-deep transitions automatically via auto-tiling.
- In Ambergrove, the lake (Act 1, Scene 6) contains a submerged resonance stone visible through the clear water -- the player must complete a quest to drain or calm the water before retrieving it.
- For Millbrook, the river replaces the lake organism. Lakes appear in more isolated locations.
- The reference Village Bridge TMX shows extensive water terrain with the same shallow-to-deep layering pattern.
