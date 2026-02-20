---
id: fireplace
size: [3, 2]
palette: interior-premium
---
# Fireplace

A stone hearth set into a north-facing interior wall, three tiles wide and two tiles tall. The upper row shows the mantelpiece and chimney breast recessed into the wall; the lower row shows the firebox with glowing embers and the stone hearth floor extending into the room. The fire itself is an animated tile from `Animation_Campfire` overlaid on the firebox position.

Fireplaces anchor the emotional center of interior rooms. In the Bright Hearth inn, the great fireplace dominates the common room's north wall and gives the establishment its name. In Artun's study, a smaller variant crackles beside his reading chair. The warmth is vibrancy-gated: at low vibrancy the fire is dim embers; at high vibrancy it roars with golden light.

## Layers

### walls
| | | |
|---|---|---|
| wall.fireplace-tl | wall.fireplace-mantle | wall.fireplace-tr |
| wall.fireplace-bl | wall.fireplace-firebox | wall.fireplace-br |

## Collision
| | | |
|---|---|---|
| 1 | 1 | 1 |
| 0 | 1 | 0 |

## Visuals
- **fire-anim**: `Animation_Campfire` at position (1, 1), animated fire loop

## Objects
- **fireplace-interact**: position (1, 1), type: trigger, properties: { eventType: action, description: "The hearth radiates steady warmth. Orange light dances across the stone floor." }

## Anchors
- **hearthside-left**: position (0, 1) -- chair or rug placement
- **hearthside-right**: position (2, 1) -- chair or rug placement

## Notes

- The firebox tile (1, 1) is impassable -- the player cannot walk into the fire. Interaction triggers from adjacent tiles via the hearthside anchors.
- The `Animation_Campfire` TSX provides a multi-frame fire loop. At vibrancy level 0-1, swap to the static `object:fireplace.embers` tile for a dormant hearth.
- Mantelpiece decoration objects (candles, portraits, clocks) compose above the fireplace at the organism level using the wall-mounted object slots.
- For Artun's house interior, the fireplace sits centered on the north wall with bookshelf-wall molecules flanking it on either side.
- The Bright Hearth inn uses a double-wide variant: two fireplace molecules placed side by side with the inner edges merged (omit `wall.fireplace-tr` and `wall.fireplace-tl` at the seam).
