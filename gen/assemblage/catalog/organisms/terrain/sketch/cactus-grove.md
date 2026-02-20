---
id: cactus-grove
size: [8, 8]
palette: desert-sketch
---
# Cactus Grove

A cluster of desert vegetation drawn with unusual commitment -- dark-leafed bushes, orange grass tufts, and scattered rocks arranged in a pattern that is almost deliberate. The Preserver who sketched this grove must have loved gardens, because every plant feels intentional, each positioned with care even as the surrounding sand fades to blankness.

The grove provides shade and concealment in a realm where both are rare. Travelers camp here between void crossings, and the nomads consider it neutral ground. Small creatures that exist only as suggestions of movement dart between the bushes.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       tallgrass.orange  ground.sand       ground.sand       tallgrass.orange  ground.sand       ground.sand
ground.sand       tallgrass.orange  ground.dark-sand  tallgrass.orange  ground.sand       ground.dark-sand  tallgrass.orange  ground.sand
ground.sand       ground.sand       tallgrass.orange  ground.dark-sand  ground.dark-sand  tallgrass.orange  ground.sand       ground.sand
ground.sand       ground.sand       tallgrass.orange  ground.dark-sand  ground.dark-sand  tallgrass.orange  ground.sand       ground.sand
ground.sand       tallgrass.orange  ground.dark-sand  tallgrass.orange  ground.sand       ground.dark-sand  tallgrass.orange  ground.sand
ground.sand       ground.sand       tallgrass.orange  ground.sand       ground.sand       tallgrass.orange  ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
```

## Collision
```
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
```

## Objects
- **bush.dark-1**: position (2, 2), type: decoration, description: "A low, thorny bush with leaves so dark they look like ink stains on the sand"
- **bush.dark-2**: position (5, 2), type: decoration, description: "Another dark bush, its branches spread wide to catch the absent rain"
- **bush.emerald-3**: position (2, 5), type: decoration, description: "A green bush that seems too lush for the desert, as if drawn from memory of a wetter place"
- **bush.red-1**: position (5, 5), type: decoration, description: "A reddish bush whose leaves rustle without wind"
- **rock.sand-1**: position (3, 3), type: decoration, description: "A sandstone rock at the grove's center, worn smooth by travelers who rest against it"
- **rock.sand-2**: position (4, 4), type: decoration, description: "A smaller companion stone beside the first"
- **prop.fireplace**: position (3, 4), type: decoration, description: "A ring of stones around ash and charcoal. Someone camped here recently."
- **grove-rest**: position (4, 3), type: trigger, description: "The grove offers shade that should not exist -- the bushes are not tall enough to cast it, yet the air is cooler here, the light softer. The Preserver who drew this place remembered what shade felt like and put that memory into the ground."
