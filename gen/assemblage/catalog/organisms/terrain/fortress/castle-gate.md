---
id: castle-gate
size: [12, 10]
palette: fortress-castles
---
# The Iron Threshold

The main gate of the Preserver Fortress. Massive oak doors banded with black iron stand between two squat guard towers. The portcullis above the doorway is raised just enough for a person to duck under -- never fully open, never fully closed. Scratches along the stone floor show where the iron teeth have been dropped in a hurry more than once. A pair of weapon stands flanks the inner passage, and a bored-looking guard leans against one of them, picking at his nails. The gate faces south, toward the road that winds down through the foothills.

## Layers

### ground
```
terrain:ground.dirt terrain:ground.dirt terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:ground.dirt terrain:ground.dirt
terrain:ground.dirt terrain:ground.dirt terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle terrain:ground.dirt terrain:ground.dirt
terrain:ground.dirt terrain:ground.dirt terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle terrain:ground.dirt terrain:ground.dirt
terrain:terrain:road.dark-brick terrain:road.dark-brick terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle terrain:road.dark-brick terrain:road.dark-brick
terrain:road.dark-brick terrain:road.dark-brick terrain:road.dark-brick terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:road.dark-brick terrain:road.dark-brick terrain:road.dark-brick
terrain:road.dark-brick terrain:road.dark-brick terrain:road.dark-brick terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:road.dark-brick terrain:road.dark-brick terrain:road.dark-brick
terrain:road.dark-brick terrain:road.dark-brick terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle terrain:road.dark-brick terrain:road.dark-brick
terrain:ground.dirt terrain:ground.dirt terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle terrain:ground.dirt terrain:ground.dirt
terrain:ground.dirt terrain:ground.dirt terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle terrain:ground.dirt terrain:ground.dirt
terrain:ground.dirt terrain:ground.dirt terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:ground.dirt terrain:ground.dirt
```

## Collision
```
1 1 1 1 1 1 1 1 1 1 1 1
1 1 1 0 0 0 0 0 0 1 1 1
1 1 1 0 0 0 0 0 0 1 1 1
0 0 1 0 0 0 0 0 0 1 0 0
0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0
0 0 1 0 0 0 0 0 0 1 0 0
1 1 1 0 0 0 0 0 0 1 1 1
1 1 1 0 0 0 0 0 0 1 1 1
1 1 1 1 1 1 1 1 1 1 1 1
```

## Objects
- **weapon-stand-left**: position (3, 2), type: prop, object: prop.weapon-stand
- **weapon-stand-right**: position (8, 2), type: prop, object: prop.weapon-stand
- **barrel-left**: position (3, 7), type: prop, object: prop.barrel-1
- **crate-right**: position (8, 7), type: prop, object: prop.crate-medium-1
- **gate-guard**: position (5, 4), type: npc, npc: gate-guard
- **entrance-outside**: position (5, 4), type: anchor, direction: south
- **entrance-inside**: position (5, 5), type: anchor, direction: north
- **portcullis-trigger**: position (5, 4), type: event-zone, event: gate-portcullis-check
