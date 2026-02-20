---
id: gallery-hall
size: [14, 10]
palette: fortress-castles
---
# Gallery of Moments

A grand hall where the Preservers display their most prized acquisitions -- memories crystallized into paintings that shimmer faintly when you pass. Stone columns line both sides, and the polished slab floor reflects the torchlight in long amber streaks. Each painting depicts a scene from the world's forgotten past, though the colors seem to shift when viewed from the corner of your eye.

## Layers

### ground
```
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
```

## Collision
```
1 1 1 1 1 1 1 1 1 1 1 1 1 1
1 0 0 0 0 0 0 0 0 0 0 0 0 1
1 0 1 0 0 0 0 0 0 0 0 1 0 1
1 0 0 0 0 0 0 0 0 0 0 0 0 1
1 0 1 0 0 0 0 0 0 0 0 1 0 1
1 0 0 0 0 0 0 0 0 0 0 0 0 1
1 0 1 0 0 0 0 0 0 0 0 1 0 1
1 0 0 0 0 0 0 0 0 0 0 0 0 1
1 0 0 0 0 0 0 0 0 0 0 0 0 1
1 1 1 1 1 1 0 0 1 1 1 1 1 1
```

## Objects
- **column-left-1**: position (2, 2), type: prop, object: prop.lamp-1
- **column-right-1**: position (11, 2), type: prop, object: prop.lamp-1
- **column-left-2**: position (2, 4), type: prop, object: prop.lamp-2
- **column-right-2**: position (11, 4), type: prop, object: prop.lamp-2
- **column-left-3**: position (2, 6), type: prop, object: prop.lamp-1
- **column-right-3**: position (11, 6), type: prop, object: prop.lamp-1
- **entrance**: position (6, 9), type: anchor, direction: south
- **painting-alcove-1**: position (4, 0), type: event-zone, event: examine-painting-1
- **painting-alcove-2**: position (7, 0), type: event-zone, event: examine-painting-2
- **painting-alcove-3**: position (10, 0), type: event-zone, event: examine-painting-3
