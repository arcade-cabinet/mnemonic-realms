---
id: outline-structure
size: [8, 7]
palette: desert-sketch
---
# Outline Structure

A building that exists only as pencil outlines -- walls drawn but never filled in. The sandstone blocks of what might have been a traveler's rest are sketched in cracked brickwork, but the interior is nothing but open sand. Wind passes through where doors should be. The roof was never imagined into existence.

In the Sketch Realm, this is how all architecture begins: as intention without completion. The Preservers drew the foundations but moved on before giving them substance. A few vases sit inside the outline, placed by some hopeful hand that believed the walls would come.

## Layers

### ground
```
ground.sand   ground.sand   ground.sand   ground.sand   ground.sand   ground.sand   ground.sand   ground.sand
ground.sand   ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand   ground.dark-sand  ground.sand   ground.sand   ground.sand   ground.sand   ground.dark-sand  ground.sand
ground.sand   ground.dark-sand  ground.sand   ground.sand   ground.sand   ground.sand   ground.dark-sand  ground.sand
ground.sand   ground.dark-sand  ground.sand   ground.sand   ground.sand   ground.sand   ground.dark-sand  ground.sand
ground.sand   ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand   ground.sand   ground.sand   ground.sand   ground.sand   ground.sand   ground.sand   ground.sand
```

## Collision
```
0 0 0 0 0 0 0 0
0 1 1 1 1 1 1 0
0 1 0 0 0 0 1 0
0 0 0 0 0 0 0 0
0 1 0 0 0 0 1 0
0 1 1 1 1 1 1 0
0 0 0 0 0 0 0 0
```

## Objects
- **ruin.bricks-cracked-1**: position (1, 1), type: decoration, description: "A fragment of sandstone wall, etched with lines that never became mortar"
- **ruin.bricks-cracked-3**: position (6, 1), type: decoration, description: "The corner of a wall that gave up halfway through being drawn"
- **ruin.bricks-broken-1**: position (1, 5), type: decoration, description: "Crumbled bricks that were never whole to begin with"
- **ruin.bricks-broken-3**: position (6, 5), type: decoration, description: "The outline of a wall dissolving into sand"
- **prop.vase-1**: position (3, 3), type: decoration, description: "A clay vase set inside walls that do not exist"
- **prop.vase-2**: position (4, 3), type: decoration, description: "Another vase, placed with faith that the building would follow"
- **examine-outline**: position (4, 2), type: trigger, description: "The walls are drawn in cracked sandstone outlines, but the space between them is nothing but sand and wind. Someone sketched the idea of a building here, but never gave it substance."
