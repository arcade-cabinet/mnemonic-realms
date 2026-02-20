---
id: bed-corner
size: [3, 2]
palette: interior-premium
variants:
  - id: bed-corner-simple
    description: A straw mattress on a low wooden frame with a plain nightstand
  - id: bed-corner-fine
    description: A quilted bed with turned posts and a polished nightstand
---
# Bed Corner

A sleeping alcove composed of a bed and a small nightstand, tucked against a wall corner in any interior room. The bed occupies the left two columns (2x2 tiles); the nightstand sits on the right column's lower tile with a candle or water jug on top. The upper-right tile is empty floor, providing breathing room.

Every bedroom in the Settled Lands -- from the cramped cots above Hark's forge to the quilted four-poster in Artun's study -- uses some arrangement of this molecule. The simple variant appears in farmsteads and common houses; the fine variant in the elder's residence, the inn's guest rooms, and the grove-keeper's lodge.

## Layers

### objects (simple variant)
| | | |
|---|---|---|
| object:bed.simple-tl | object:bed.simple-tr | 0 |
| object:bed.simple-bl | object:bed.simple-br | object:nightstand.simple |

### objects (fine variant)
| | | |
|---|---|---|
| object:bed.fine-tl | object:bed.fine-tr | 0 |
| object:bed.fine-bl | object:bed.fine-br | object:nightstand.fine |

## Collision
| | | |
|---|---|---|
| 1 | 1 | 0 |
| 1 | 1 | 1 |

## Objects
- **bed-interact**: position (1, 1), type: trigger, properties: { eventType: action, description: "A well-made bed. The blankets are still warm." }
- **nightstand-interact**: position (2, 1), type: trigger, properties: { eventType: action, description: "A small bedside table. A half-melted candle sits in a clay dish." }

## Anchors
- **bedside**: position (2, 0) -- the open floor tile where the player stands to interact

## Notes

- Bed objects are drawn from the `Objects_InteriorFurniture` sheet. The simple bed uses `bed.simple-*` (localTileId range 40-43); the fine bed uses `bed.fine-*` (localTileId range 48-51).
- The nightstand's top tile (2, 0) is the only walkable tile in the molecule, serving as the approach point.
- In the Bright Hearth inn's guest rooms, bed-corner molecules line the east wall with 1-tile gaps between them. Each gap holds a rug object for visual warmth.
- For the player's own room (acquired in Act 2), the fine bed-corner gets a save point trigger on the bed-interact object, allowing the player to rest and save.
- Pillow and blanket detail objects compose at the organism level for visual variety between rooms.
