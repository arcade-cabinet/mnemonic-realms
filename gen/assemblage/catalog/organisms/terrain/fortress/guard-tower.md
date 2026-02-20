---
id: guard-tower
size: [8, 8]
palette: fortress-castles
---
# The Watch

A circular guard tower rising above the fortress walls. The interior is cramped -- barely room for the spiral stair, a weapon rack, and the narrow cot where the night watch sleeps between shifts. The upper platform provides a commanding view of the approach road and the surrounding terrain. A signal brazier sits at the top, cold and dark. Nobody has lit it in years; the Preservers do not expect visitors, and they prefer it that way. Scratched tallies on the wall near the cot count out someone's long rotation. The most recent mark looks old.

## Layers

### ground
```
terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:wall.castle
terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:floor.slab terrain:floor.slab terrain:wall.castle terrain:wall.castle terrain:wall.castle
```

## Collision
```
1 1 1 1 1 1 1 1
1 0 0 0 0 0 0 1
1 0 0 0 0 0 0 1
1 0 0 1 1 0 0 1
1 0 0 1 1 0 0 1
1 0 0 0 0 0 0 1
1 0 0 0 0 0 0 1
1 1 1 0 0 1 1 1
```

## Objects
- **weapon-rack**: position (1, 1), type: prop, object: prop.weapon-stand
- **crate-supplies**: position (6, 1), type: prop, object: prop.crate-medium-1
- **barrel-water**: position (6, 5), type: prop, object: prop.barrel-1
- **bench-cot**: position (1, 5), type: prop, object: prop.bench-side
- **stair-center**: position (3, 3), type: prop, size: [2, 2]
- **entrance**: position (3, 7), type: anchor, direction: south
- **lookout-post**: position (3, 1), type: event-zone, event: tower-lookout-view
- **tower-guard**: position (4, 5), type: npc, npc: tower-watchman
