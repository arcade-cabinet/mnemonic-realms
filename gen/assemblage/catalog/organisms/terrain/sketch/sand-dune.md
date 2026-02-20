---
id: sand-dune
size: [10, 8]
palette: desert-sketch
---
# Sand Dune

A great shoulder of sand rising from the desert floor, sculpted by winds that blow from the void. The dune is rendered in sweeping curves of light and dark sand, with the crest catching an imagined sun. Rock outcroppings break through the surface near the base, half-buried formations that predate the sand.

From the dune's ridge, you can see the Sketch Realm stretching in all directions: half-drawn structures, the shimmer of distant oases, the hard white line of the void border. The sand here shifts constantly, as if the ground itself is being rewritten. Hay-colored grasses cling to the leeward slope where the wind cannot reach them.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
```

## Collision
```
0 0 0 0 0 0 0 0 0 0
0 0 0 0 1 1 1 0 0 0
0 0 0 1 1 1 1 1 0 0
0 0 1 1 1 1 1 1 1 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
```

## Objects
- **rock.sand-1**: position (1, 5), type: decoration, description: "A sandstone boulder half-swallowed by the dune's base"
- **rock.sand-2**: position (2, 6), type: decoration, description: "A smaller rock emerging from the leeward slope"
- **rock.sand-4**: position (8, 4), type: decoration, description: "A wind-carved stone on the dune's flank, smooth as a river pebble"
- **rock.sand-large**: position (7, 5), type: decoration, description: "A massive formation jutting through the sand, too ancient to be fully buried"
- **prop.skull-1**: position (5, 6), type: decoration, description: "A sun-bleached skull at the dune's foot. The sand buries it a little more each day."
- **dune-crest**: position (5, 2), type: trigger, description: "From the crest of the dune, the Sketch Realm unfolds beneath you. The drawn world is a patchwork -- vivid where the Preservers lingered, pale where they hurried, and white where they never reached at all. The horizon is not a line but an edge, like the margin of a page."
