---
id: half-built-village
size: [14, 12]
palette: desert-sketch
---
# Half-Built Village

A settlement caught between existence and absence. Three buildings stand in various states of completion: one with walls and a partial roof, one with only a foundation of dark sand, and one that is nothing more than a market stand beside an empty lot. A road of packed earth connects them, trailing off into unmarked sand where a fourth building should be.

The villagers who live here -- if they can be called that -- go about routines in half-finished spaces. A merchant tends a stall with no back wall. A well provides water from a depth that was never properly dug. The whole place feels like a sketch that the artist set aside, meaning to return.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  road              road              road              road              ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       road              road              ground.sand       ground.sand       road              road              ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       road              road              ground.sand       ground.sand       road              road              ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  road              road              road              road              ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
```

## Collision
```
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 1 1 1 1 0 0 0 0 1 1 1 1 0
0 1 0 0 1 0 0 0 0 1 0 0 1 0
0 1 0 0 0 0 0 0 0 1 0 0 1 0
0 1 1 1 1 0 0 0 0 1 1 1 1 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 1 1 1 1 0 0 0 0 0 0 0 0 0
0 1 0 0 0 0 0 0 0 0 0 0 0 0
0 1 0 0 0 0 0 0 0 0 0 0 0 0
0 1 1 1 1 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
```

## Objects
- **building.redstone-1**: position (1, 1), type: decoration, description: "A desert dwelling with three walls. The fourth was never drawn."
- **building.redstone-4**: position (9, 1), type: decoration, description: "A more complete structure, though the roof sags where imagination ran thin"
- **building.market-small**: position (9, 7), type: npc-anchor, description: "A market stall standing alone where a row of shops should be"
- **building.well-desert**: position (6, 5), type: interaction, description: "A well sketched in sandstone. The rope descends into darkness that was never given a bottom."
- **ruin.bricks-broken-1**: position (11, 8), type: decoration, description: "Foundation stones for a building that was abandoned mid-thought"
- **ruin.bricks-broken-3**: position (12, 9), type: decoration, description: "More scattered bricks, trailing off into unmarked sand"
- **prop.sign-1**: position (7, 4), type: interaction, description: "A wooden sign planted at the crossroads. The words are half-formed, as if the writer forgot what they meant to say."
- **village-center**: position (6, 6), type: spawn, description: "The center of a village that never finished becoming one"
