---
id: archive-room
size: [10, 10]
palette: fortress-castles
---
# The Binding Archive

A cramped chamber thick with the smell of old vellum and lamp oil. Shelves line every wall from floor to ceiling, crammed with scrolls, ledgers, and loose parchments held together with fraying cord. A heavy oak table dominates the center, its surface buried under half-finished catalogues and ink-stained quills. The Preservers logged every memory they confiscated here -- dates, locations, the names of the people they took them from. Some entries have been scratched out so thoroughly the parchment has torn through.

## Layers

### ground
```
terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.slab terrain:floor.mid-slab
terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab terrain:floor.mid-slab
```

## Collision
```
1 1 1 1 1 1 1 1 1 1
1 1 1 0 0 0 0 1 1 1
1 1 0 0 0 0 0 0 1 1
1 0 0 0 0 0 0 0 0 1
1 0 0 0 1 1 0 0 0 1
1 0 0 0 1 1 0 0 0 1
1 0 0 0 0 0 0 0 0 1
1 1 0 0 0 0 0 0 1 1
1 1 1 0 0 0 0 1 1 1
1 1 1 1 0 0 1 1 1 1
```

## Objects
- **archive-table**: position (4, 4), type: prop, object: prop.table-large, size: [2, 2]
- **crate-stack-nw**: position (1, 1), type: prop, object: prop.crate-medium-1
- **crate-stack-ne**: position (8, 1), type: prop, object: prop.crate-medium-2
- **crate-stack-sw**: position (1, 7), type: prop, object: prop.crate-medium-1
- **crate-stack-se**: position (8, 7), type: prop, object: prop.crate-medium-2
- **barrel-left**: position (1, 4), type: prop, object: prop.barrel-1
- **barrel-right**: position (8, 5), type: prop, object: prop.barrel-2
- **entrance**: position (4, 9), type: anchor, direction: south
- **ledger-inspect**: position (4, 3), type: event-zone, event: examine-archive-ledger
- **scratched-entry**: position (7, 2), type: event-zone, event: examine-scratched-entry
