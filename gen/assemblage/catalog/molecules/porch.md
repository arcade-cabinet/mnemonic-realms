---
id: porch
size: [2, 1]
palette: village-premium
---
# Porch

A two-tile-wide covered front porch extending from a building's entrance. The porch consists of a raised wooden platform with a narrow roof overhang supported by slim timber posts. It provides a sheltered threshold between the interior and the village lane -- the kind of place where a farmer leans against the doorframe at dusk, watching the sun set over Heartfield's wheat.

The porch is placed directly below a door-frame molecule, extending the building's footprint by one row southward. Both tiles are passable, allowing the player to walk onto the porch and reach the door. The visual objects (posts and plank flooring) render above the ground layer.

## Layers

### ground
| | |
|---|---|
| terrain:ground.dirt | terrain:ground.dirt |

### objects
| | |
|---|---|
| object:porch.wood-plank | object:porch.wood-plank |

## Collision
| | |
|---|---|
| 0 | 0 |

## Anchors
- **left-post**: position (0, 0) -- left porch post, connects to building wall
- **right-post**: position (1, 0) -- right porch post, connects to building wall

## Notes

- Porch tiles come from the `Objects_Buildings` detail set, using plank-flooring overlay tiles.
- Porches are optional additions to medium and large house organisms. Small houses typically open directly onto the ground.
- In Everwick, Artun's medium red house has a porch where the elder sometimes stands during Scene 1 before the player enters.
- Hay-house porches in Heartfield are rougher -- raw timber posts with packed-earth flooring instead of planks. Use `object:porch.hay-plank` for the rustic variant.
- The porch does not have its own roof tiles; the building sprite's roof overhang visually covers it.
