---
id: window-frame
size: [1, 1]
palette: village-premium
variants:
  - id: window-frame-red
    description: Shuttered window in a red wall
  - id: window-frame-blue
    description: Shuttered window in a blue wall
  - id: window-frame-green
    description: Shuttered window in a green wall
  - id: window-frame-hay
    description: Open window in a hay/thatch wall
---
# Window Frame

A single-tile window set into a building wall. Shows wooden shutters flanking a dark pane, with the wall color visible around the frame. Windows are purely decorative -- they break up the monotony of long wall runs and give buildings personality.

The tile is always impassable. Windows sit in the upper wall row of a building, at the same height as the door header.

## Layers

### objects (red variant)
| |
|---|
| object:window.red |

### objects (blue variant)
| |
|---|
| object:window.blue |

### objects (green variant)
| |
|---|
| object:window.green |

### objects (hay variant)
| |
|---|
| object:window.hay |

## Collision
| |
|---|
| 1 |

## Notes

- Window tiles are part of each Atlas building color sheet.
- Placement: compose into house organisms at wall-row height, spaced 2-3 tiles apart.
- Hay windows are simpler -- just an opening in the thatch rather than shuttered.
- Windows do not emit light in the current system but may gain a glow effect when the vibrancy system reaches full implementation.
