---
id: shop-fish-room
size: [14, 16]
palette: interior-premium
---
# Fisherman's Hut Interior

A compact, weathered shack that smells of salt and smoked fish. Nets hang
from the ceiling, rods lean against the walls, and barrels of the day's
catch line the back wall. A simple wooden table serves as both workbench
and dining surface.

Derived from **FishermanHut_1.tmx** (14x16, 16px tiles).

## Room Structure

A single small room -- the smallest interior in the tileset. No room
divisions, just a cramped but functional fisherman's dwelling.

### Floor
Wood plank flooring (`floor.wood-*` 2x2 pattern).

### Walls
Gray stone walls with a single window (`window.wood-6`) on the west wall.

## Objects
- **table**: position (4, 9), type: furniture -- `table.small-1` (48x32)
- **bed**: position (9, 4), type: furniture -- `bed.simple-2` (48x64)
- **barrel-fish-1**: position (2, 4), type: furniture -- `barrel.fish` (32x32)
- **barrel-fish-2**: position (10, 10), type: furniture -- `barrel.small-fish`
- **barrel-fishing-rod**: position (2, 6), type: furniture -- `barrel.fishing-rod` (32x48)
- **barrel-covered**: position (10, 9), type: furniture -- `barrel.small-covered` (32x32)
- **fishing-net**: position (4, 3), type: furniture -- `fishing-net.1` (32x48)
- **fishing-rod**: position (7, 3), type: furniture -- `fishing-rod.1` (32x48)
- **fish-hanging-1**: position (4, 4), type: furniture -- `fish.hanging-white`
- **fish-hanging-2**: position (6, 4), type: furniture -- `fish.hanging-purple`
- **bottle-hanging-1**: position (8, 4), type: furniture -- `bottle.hanging-blue`
- **bottle-hanging-2**: position (3, 8), type: furniture -- `bottle.hanging-purple`
- **desk-side**: position (2, 8), type: furniture -- `desk.side-1` (16x48)
- **chest**: position (8, 11), type: chest -- `chest.steel-closed` (32x32)
- **bucket**: position (10, 11), type: furniture -- `bucket.1`
- **pot**: position (2, 10), type: furniture -- `pot.ceramic-tall-2`
- **vase-1**: position (6, 9), type: furniture -- `vase.small`
- **vase-2**: position (8, 8), type: furniture -- `vase.tall`
- **lantern**: position (5, 7), type: furniture -- `lantern.small`
- **candle**: position (5, 9), type: furniture -- `candle.4`
- **carpet**: position (5, 10), type: furniture -- `carpet-obj.3` (64x48)
- **chair**: position (4, 10), type: furniture -- `chair.right-1`
- **window**: position (1, 7), type: furniture -- `window.wood-6` (west wall)
- **npc-spawn**: position (3, 9), type: npc -- fisherman sits at table
- **door-south**: position (6, 14), type: transition -- exit to docks/village

## Notes

- The fisherman's hut is one of the simplest interiors -- appropriate for a
  humble waterfront dwelling near Millbrook's docks.
- The hanging fish and nets give immediate visual storytelling about the occupant's trade.
- The single chest is the only loot point -- fishermen don't accumulate wealth.
- The bed in the corner suggests the fisherman lives and works in the same room.
