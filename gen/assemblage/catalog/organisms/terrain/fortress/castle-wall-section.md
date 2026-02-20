---
id: castle-wall-section
size: [16, 6]
palette: fortress-castles
---
# The Rampart Walk

A stretch of castle wall with crenellated battlements overlooking the lands beyond. Wind snaps at the Preserver banners mounted along the parapet. The walkway is wide enough for two soldiers abreast but not three -- a deliberate design, so attackers who breach the wall cannot bring their numbers to bear. Arrow slits punctuate the merlon stones at regular intervals, each one stained dark from old pitch. On clear days you can see all the way to the Settled Lands from here, though the Preservers would rather you did not look.

## Layers

### ground
```
terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.slab
terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab
terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle terrain:wall.castle
```

## Collision
```
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
```

## Objects
- **banner-1**: position (3, 1), type: prop, object: prop.banner-standing
- **banner-2**: position (8, 1), type: prop, object: prop.banner-standing
- **banner-3**: position (13, 1), type: prop, object: prop.banner-standing
- **weapon-rack**: position (6, 4), type: prop, object: prop.weapon-stand
- **archery-target**: position (11, 4), type: prop, object: prop.archery-target
- **entrance-west**: position (0, 2), type: anchor, direction: west
- **entrance-east**: position (15, 2), type: anchor, direction: east
- **lookout-point**: position (8, 1), type: event-zone, event: wall-lookout-vista
