---
id: resonance-point
size: [5, 5]
palette: frontier-seasons
---
# Resonance Point

A glowing resonance stone set into a clearing of bare earth. The grass grows in a perfect circle around it, as if the land itself remembers the stone's presence more vividly than anything else nearby. Smaller stones and luminous mushrooms ring the central pillar. When touched, the stone hums with a warmth that fills the chest and sharpens the edges of nearby objects, making them feel more real.

## Layers

### ground
| | | | | |
|---|---|---|---|---|
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.light-grass | terrain:ground.light-grass | terrain:ground.light-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.light-grass | terrain:ground.dirt | terrain:ground.light-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.light-grass | terrain:ground.light-grass | terrain:ground.light-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |

## Collision
| | | | | |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 |

## Objects
- **resonance-stone**: position (2, 2), type: visual, ref: ruin.pillar-1
- **glow-mushroom-1**: position (1, 1), type: visual, ref: mushroom.4
- **glow-mushroom-2**: position (3, 1), type: visual, ref: mushroom.5
- **glow-mushroom-3**: position (1, 3), type: visual, ref: mushroom.1
- **glow-mushroom-4**: position (3, 3), type: visual, ref: mushroom.3
- **small-stone-1**: position (0, 2), type: visual, ref: rock.gray-small
- **small-stone-2**: position (4, 2), type: visual, ref: rock.gray-small
- **resonance-trigger**: position (2, 2), type: trigger, properties: { "type": "resonance-stone", "vibrancy": 15, "range": 8 }
