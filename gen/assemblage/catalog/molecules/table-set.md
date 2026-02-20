---
id: table-set
size: [3, 3]
palette: interior-premium
variants:
  - id: table-set-round
    description: A round tavern table with two stools, used in common rooms
  - id: table-set-square
    description: A square dining table with two chairs, used in homes and studies
---
# Table Set

A three-by-three dining arrangement: a central table flanked by seating on the east and west sides, with open approach space to the north and south. The table itself occupies the center tile; chairs or stools sit at the left and right centers. The corner and edge tiles are open floor.

Table sets fill the common rooms of the Settled Lands -- the Bright Hearth's smoky dining hall, Artun's study where he spreads old maps over dinner, Hana's workshop where gears and teacups share the same scarred wooden surface. They are the social furniture of the world, the places where NPCs sit and talk and where the player overhears rumors.

## Layers

### objects (round variant)
| | | |
|---|---|---|
| 0 | 0 | 0 |
| object:stool.wood | object:table.round | object:stool.wood |
| 0 | 0 | 0 |

### objects (square variant)
| | | |
|---|---|---|
| 0 | 0 | 0 |
| object:chair.wood-l | object:table.square | object:chair.wood-r |
| 0 | 0 | 0 |

## Collision
| | | |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 1 | 1 |
| 0 | 0 | 0 |

## Objects
- **table-interact**: position (1, 1), type: trigger, properties: { eventType: action, description: "A sturdy table worn smooth by years of elbows and spilled ale." }
- **seat-left**: position (0, 1), type: npc-seat -- NPC sitting spot
- **seat-right**: position (2, 1), type: npc-seat -- NPC sitting spot

## Anchors
- **approach-north**: position (1, 0) -- player approaches from above
- **approach-south**: position (1, 2) -- player approaches from below

## Notes

- Table and chair objects come from `Objects_InteriorFurniture`. Round tables use `table.round` (localTileId 120); square tables use `table.square` (localTileId 124).
- The center row is fully impassable -- the player cannot walk through the table or occupied chairs. The top and bottom rows are walkable aisles.
- In the Bright Hearth's common room, three to four round table-sets fill the space south of the tavern-bar, with 1-tile gaps between them for NPC and player navigation.
- For Artun's study, a single square table-set is placed centrally with a candle object (`object:candle.table`) and map prop (`object:book.open`) composed on top at the organism level.
- NPC-seat positions are used by the scene system to seat NPCs at specific tables during dialogue scenes. The NPC faces the table center when seated.
