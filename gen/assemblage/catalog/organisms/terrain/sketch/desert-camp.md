---
id: desert-camp
size: [10, 8]
palette: desert-sketch
---
# Desert Camp

A nomadic camp in the desert, pitched by the wanderers who move through the Sketch Realm gathering memories and trading stories. Canvas tents are represented by market stalls -- the nomads repurpose whatever structures the Preservers left behind. A fireplace smolders at the center, ringed by crates and barrels. A sand-weathered cart sits at the camp's edge, loaded with supplies for the next crossing.

The nomads do not build. They cannot -- the Sketch Realm resists new construction. Instead they inhabit the drawn world's leftovers, draping cloth over ruined walls and sleeping in outline structures. This camp is temporary by nature, but the firepit and the worn paths suggest it has been used many times.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  road              road              ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  road              road              road              road              ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
```

## Collision
```
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
```

## Objects
- **building.market-small**: position (3, 2), type: npc-anchor, description: "A market stall repurposed as a tent, its canvas stretched over wooden poles. A nomad trader sorts dried herbs inside."
- **building.market-large**: position (6, 2), type: npc-anchor, description: "A larger stall serving as the camp's communal shelter. Blankets and packs are piled beneath its shade."
- **prop.fireplace**: position (4, 4), type: interaction, description: "The campfire crackles with warmth that radiates further than it should. The nomads say it burns with memory-fuel -- recollections of other fires in other places."
- **prop.cart-sand**: position (1, 4), type: decoration, description: "A sand-weathered cart packed with water skins, dried food, and rolled canvas. Ready for the next crossing."
- **prop.barrel-sand-1**: position (7, 3), type: decoration, description: "A barrel of water, precious in the Sketch Realm where rain was never drawn"
- **prop.barrel-sand-2**: position (7, 4), type: decoration, description: "A smaller barrel of preserved rations"
- **prop.crate-sand-1**: position (2, 5), type: decoration, description: "A supply crate stamped with symbols that might be a trade language"
- **prop.crate-sand-2**: position (3, 5), type: decoration, description: "Another crate, this one partially open, revealing bundles of orange grass"
- **prop.logs**: position (5, 4), type: decoration, description: "A stack of driftwood collected from the void borders, where dead trees sometimes wash up from nowhere"
- **prop.sack**: position (8, 5), type: decoration, description: "A bulging sack of grain or sand -- hard to tell which in the Sketch Realm"
- **camp-center**: position (5, 3), type: spawn, description: "The heart of the nomad camp, where travelers share water and stories around the fire"
