---
id: shop-cartographer-room
size: [20, 17]
palette: interior-premium
---
# Cartographer's Study

A scholar's den drowning in parchment. Maps cover every wall surface, scrolls
overflow from tall shelves, and a large writing desk dominates the center of the
room. The air is thick with the smell of ink and old paper. A brass candleholder
provides focused light over the cartographer's current project.

Derived from **Cartographer_1.tmx** (20x17, 16px tiles).

## Room Structure

Single room with a generous work area. The cartographer's desk sits in the middle,
surrounded by map-covered walls and scroll storage.

### Floor
Wood plank flooring with a decorative carpet near the desk and a second carpet
near the entrance.

### Walls
Gray stone walls. The most notable feature is the extensive wall decoration --
three sizes of maps mounted on the north wall: `wall-art.map-large` (48x32),
`wall-art.map-medium` (32x32), and `wall-art.map-small` (32x16).

## Objects
- **writing-desk**: position (7, 8), type: furniture -- `writing-desk.map-1` (32x48)
- **writing-desk-2**: position (5, 7), type: furniture -- `writing-desk.map-3` (16x48)
- **table**: position (10, 11), type: furniture -- `table.small-white-stripe` (48x32)
- **shelf-scrolls-1**: position (14, 4), type: furniture -- `shelf.tall-scrolls-2` (32x64)
- **shelf-scrolls-2**: position (16, 4), type: furniture -- `shelf.tall-scrolls-3` (48x64)
- **candleholder-1**: position (3, 5), type: furniture -- `candleholder.steel-1`
- **candleholder-2**: position (16, 9), type: furniture -- `candleholder.steel-2`
- **candleholder-3**: position (12, 5), type: furniture -- `candleholder.steel-3`
- **candle-1**: position (8, 8), type: furniture -- `candle.1`
- **candle-2**: position (13, 8), type: furniture -- `candle.2`
- **candle-3**: position (6, 11), type: furniture -- `candle.3`
- **candle-4**: position (14, 11), type: furniture -- `candle.4`
- **bench-1**: position (10, 12), type: furniture -- `bench.side` (32x16)
- **bench-2**: position (3, 12), type: furniture -- `bench.long-3` (32x16)
- **bench-3**: position (3, 8), type: furniture -- `bench.small`
- **map-wall-large**: position (5, 3), type: furniture -- `wall-art.map-large` (48x32)
- **map-wall-medium**: position (9, 4), type: furniture -- `wall-art.map-medium` (32x32)
- **map-wall-small**: position (12, 3), type: furniture -- `wall-art.map-small` (32x16)
- **chest-steel**: position (14, 12), type: chest -- `chest.steel-closed` (32x32)
- **chest-wood**: position (2, 12), type: chest -- `chest.wood-closed` (32x32)
- **crate**: position (16, 11), type: furniture -- `crate.medium-right` (32x32)
- **sack**: position (2, 11), type: furniture -- `sack.large-1` (32x32)
- **carpet-1**: position (7, 9), type: furniture -- `carpet-obj.1` (64x48)
- **carpet-2**: position (10, 13), type: furniture -- `carpet-obj.3` (64x48)
- **pot-1**: position (2, 6), type: furniture -- `pot.ceramic-small-2`
- **pot-2**: position (16, 12), type: furniture -- `pot.ceramic-tall-3`
- **pot-3**: position (3, 10), type: furniture -- `pot.stone-tall-2`
- **books-1**: position (10, 8), type: furniture -- `books.row-3`
- **books-2**: position (11, 8), type: furniture -- `books.row-4`
- **books-3**: position (12, 8), type: furniture -- `books.row-5`
- **books-4**: position (11, 11), type: furniture -- `books.row-9`
- **scroll**: position (7, 9), type: furniture -- `scroll.single`
- **bottle**: position (14, 8), type: furniture -- `bottle.round-red`
- **lantern**: position (9, 6), type: furniture -- `lantern.small`
- **package**: position (15, 12), type: furniture -- `package.small`
- **window**: position (17, 6), type: furniture -- `window.wood-3` (east wall)
- **keeper-spawn**: position (6, 8), type: npc -- cartographer bent over desk
- **door-south**: position (9, 15), type: transition -- exit to village

## Notes

- The cartographer's study is where the player can buy/view the world map in
  later acts. Early on, the map is incomplete -- reflecting the unfinished world.
- The map-covered walls are the visual centerpiece and reinforce the "world being
  drawn into existence" theme of Mnemonic Realms.
- Scroll shelves hint at ancient records the cartographer has collected from
  expeditions to the frontier zones.
- The writing desk with map is the cartographer's active project -- could be
  interactive (examine to see partially-drawn world map).
