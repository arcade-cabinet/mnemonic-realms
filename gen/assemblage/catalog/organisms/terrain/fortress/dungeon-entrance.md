---
id: dungeon-entrance
size: [10, 8]
palette: fortress-castles
---
# The Descent

A heavy stone archway leads down into the fortress dungeons. The air shifts here -- warmer, damper, carrying the faint mineral smell of deep stone. Iron torch brackets are bolted into the walls at intervals, but only half of them hold torches. The stairway is narrow and worn concave from generations of boots. A rusted iron gate hangs open on broken hinges, a padlock dangling uselessly from a chain that has been cut. Whatever the Preservers kept down here, they stopped locking it away some time ago. A sign nailed to the wall reads "AUTHORIZED ONLY" in faded paint, the letters peeling.

## Layers

### ground
```
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle terrain:floor.mid-slab terrain:floor.mid-slab terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle terrain:floor.mid-slab terrain:floor.mid-slab terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
```

## Collision
```
1 1 1 1 1 1 1 1 1 1
0 0 0 1 0 0 1 0 0 0
0 0 0 1 0 0 1 0 0 0
0 0 0 0 0 0 0 0 0 0
0 1 0 0 0 0 0 0 1 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
```

## Objects
- **sign-authorized**: position (3, 0), type: prop, object: prop.sign-1
- **torch-left**: position (3, 2), type: prop, object: prop.lamp-1
- **torch-right**: position (6, 2), type: prop, object: prop.lamp-2
- **barrel-left**: position (1, 4), type: prop, object: prop.barrel-1
- **crate-right**: position (8, 4), type: prop, object: prop.crate-medium-2
- **broken-gate**: position (4, 3), type: prop, size: [2, 1]
- **descent-stairs**: position (4, 0), type: anchor, direction: north, transition: depths-l1
- **approach-south**: position (4, 7), type: anchor, direction: south
- **dungeon-guard**: position (7, 5), type: npc, npc: dungeon-warden
- **gate-examine**: position (4, 3), type: event-zone, event: dungeon-gate-examine
