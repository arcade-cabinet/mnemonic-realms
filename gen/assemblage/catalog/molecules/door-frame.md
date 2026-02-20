---
id: door-frame
size: [1, 2]
palette: village-premium
---
# Door Frame

A standard wooden door set into a building wall -- one tile wide, two tiles tall. The upper tile shows the door header and lintel; the lower tile shows the door itself, slightly ajar or closed depending on the building state.

The bottom tile is passable (collision 0) to allow the player to walk into the doorway, which triggers a map transition event. The upper tile is impassable since it sits within the wall line.

When composed into a house organism, the door-frame replaces one column of the wall section. A transition object is placed at the bottom tile position.

## Layers

### objects
| |
|---|
| object:door.wood-header |
| object:door.wood |

## Collision
| |
|---|
| 1 |
| 0 |

## Objects
- **door**: position (0, 1), type: transition, properties: { targetMap, targetX, targetY }

## Notes

- The door visual comes from `Atlas_Buildings_Bridges` or the corresponding color Atlas sheet, depending on the house variant.
- Interior transitions are defined at the organism level; the molecule just establishes the slot.
- For shops and inns, the door object carries additional `shopType` or `innId` properties.
- The player approaches from below (south-facing doors are the standard orientation in the premium tileset).
