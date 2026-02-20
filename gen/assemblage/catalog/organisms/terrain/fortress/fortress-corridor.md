---
id: fortress-corridor
size: [6, 16]
palette: fortress-castles
---
# Stone Passage

A long corridor cut from the fortress's inner wall. Iron sconces bolted into the stone cast jittering circles of torchlight that barely reach the floor. The walls are scarred with chisel marks from when this passage was widened -- hastily, judging by how uneven the stone is. Water seeps through a crack near the ceiling and pools in the grooves between flagstones. The Preservers' boots wore a dark path down the center over decades of patrol routes.

## Layers

### ground
```
terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle
```

## Collision
```
1 1 0 0 1 1
1 0 0 0 0 1
1 0 0 0 0 1
1 0 0 0 0 1
1 1 0 0 1 1
1 0 0 0 0 1
1 0 0 0 0 1
1 0 0 0 0 1
1 1 0 0 1 1
1 0 0 0 0 1
1 0 0 0 0 1
1 0 0 0 0 1
1 1 0 0 1 1
1 0 0 0 0 1
1 0 0 0 0 1
1 1 0 0 1 1
```

## Objects
- **sconce-left-1**: position (0, 2), type: prop, object: prop.lamp-1
- **sconce-right-1**: position (5, 2), type: prop, object: prop.lamp-2
- **sconce-left-2**: position (0, 6), type: prop, object: prop.lamp-1
- **sconce-right-2**: position (5, 6), type: prop, object: prop.lamp-2
- **sconce-left-3**: position (0, 10), type: prop, object: prop.lamp-1
- **sconce-right-3**: position (5, 10), type: prop, object: prop.lamp-2
- **barrel-nook**: position (1, 4), type: prop, object: prop.barrel-1
- **crate-nook**: position (4, 8), type: prop, object: prop.crate-small-1
- **entrance-north**: position (2, 0), type: anchor, direction: north
- **entrance-south**: position (2, 15), type: anchor, direction: south
- **patrol-guard**: position (2, 7), type: npc, npc: preserver-guard
