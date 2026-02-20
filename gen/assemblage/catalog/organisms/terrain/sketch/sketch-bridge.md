---
id: sketch-bridge
size: [8, 6]
palette: desert-sketch
---
# Sketch Bridge

A stone bridge that flickers between drawn and undrawn, spanning a channel of water that may or may not be real. The bridge's near end is solid -- you can feel the sandstone blocks beneath your feet, the rough handrail against your palm. But as it arches over the water, the lines grow thinner. The far end is translucent, its edges wavering like heat haze. Step carefully, and it holds. Look at it too directly, and the stones seem to dissolve.

The water below is drawn in confident, bold strokes -- deep blue with reflected light. The Preserver who made this bridge lavished attention on the water but grew uncertain about the crossing. Perhaps they doubted whether anyone would need to reach the other side.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.dark-sand  road.brick        road.brick        ground.dark-sand  ground.sand       ground.sand
water             water             ground.dark-sand  road.brick        road.brick        ground.dark-sand  water             water
water             water             ground.dark-sand  road.brick        road.brick        ground.dark-sand  water             water
ground.sand       ground.sand       ground.dark-sand  road.brick        road.brick        ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
```

## Collision
```
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
1 1 0 0 0 0 1 1
1 1 0 0 0 0 1 1
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
```

## Objects
- **building.bridge-stone-1**: position (3, 1), type: decoration, description: "The bridge's stone arch, its blocks fitted with ancient precision on the near side"
- **ruin.bricks-cracked-2**: position (3, 4), type: decoration, description: "Cracked blocks at the bridge's far end, where the sketch grows uncertain"
- **ruin.bricks-cracked-4**: position (4, 4), type: decoration, description: "More fragmentary stones, their edges blurring into suggestion"
- **rock.water-1**: position (0, 2), type: decoration, description: "A wet stone in the channel, drawn with surprising detail"
- **rock.water-2**: position (7, 3), type: decoration, description: "Another water-smoothed rock, its shadow perfectly rendered"
- **bridge-crossing**: position (3, 2), type: trigger, description: "The bridge stones are solid beneath your feet, but you can see through them to the water below. Each step feels like an act of faith -- believing that what was drawn will hold your weight. The far bank shimmers, uncertain whether it should exist."
