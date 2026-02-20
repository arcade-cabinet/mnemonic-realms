---
id: void-border
size: [12, 5]
palette: desert-sketch
---
# Void Border

The boundary where the drawn world meets the void. On one side: sand, rocks, the occasional determined tuft of orange grass. On the other: nothing. Not darkness -- nothing. The sand grains at the edge thin out and then simply stop, as if the artist's pen lifted from the page mid-stroke.

A fence runs along part of the border, placed by someone who understood that the void is not dangerous so much as final. Beyond it, there is no ground to stand on, no air to breathe, no concept of distance. The world was simply never drawn that far.

Scattered broken bricks suggest that something once extended further. Fragments of a wall, maybe a road, dissolving into the white. Occasionally a crystal pulses at the edge, as if marking where reality resumes.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand
ground.void       ground.void       ground.void       ground.void       ground.void       ground.void       ground.void       ground.void       ground.void       ground.void       ground.void       ground.void
```

## Collision
```
0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0
1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1
```

## Objects
- **ruin.bricks-broken-1**: position (1, 2), type: decoration, description: "Bricks that dissolve into the edge of existence"
- **ruin.bricks-broken-5**: position (5, 2), type: decoration, description: "A fragment of road surface that reaches toward the void and stops"
- **ruin.bricks-cracked-1**: position (9, 2), type: decoration, description: "Cracked sandstone that crumbles to nothing at the border"
- **crystal.small**: position (3, 2), type: decoration, description: "A faint crystal marks where the world ends, pulsing like a heartbeat"
- **crystal.medium**: position (8, 2), type: decoration, description: "A taller crystal at the void's edge, humming with the resonance of undrawn things"
- **prop.skull-1**: position (6, 2), type: decoration, description: "A bleached skull resting at the border. Did someone try to walk past the edge?"
- **void-edge**: position (0, 3), type: trigger, description: "The sand thins to individual grains and then stops. Beyond is not darkness or light but pure absence -- the blank page where the world was never written."
