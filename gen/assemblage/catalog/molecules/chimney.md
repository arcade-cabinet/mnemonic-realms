---
id: chimney
size: [1, 2]
palette: village-premium
---
# Chimney

A stone chimney stack rising from a building's roof ridge. One tile wide, two tiles tall -- the lower tile sits on the roofline, the upper tile extends above it. A faint plume of smoke (handled by the Animation_Campfire or a particle effect) indicates an occupied dwelling.

Chimneys are placed on roof sections at a specified X offset. They are always impassable since they occupy rooftop space.

## Layers

### objects
| |
|---|
| object:chimney.stone-top |
| object:chimney.stone-base |

## Collision
| |
|---|
| 1 |
| 1 |

## Notes

- Chimney tiles come from `Atlas_Buildings_Bridges` (shared building detail tiles).
- Not every house needs a chimney. Use them on medium and large houses, workshops, and the inn.
- The smoke particle attaches to the top tile's pixel center. The animation system handles rendering.
- For the Bright Hearth inn in Everwick, the chimney is double-width (two chimney molecules side by side) to convey the large hearth within.
