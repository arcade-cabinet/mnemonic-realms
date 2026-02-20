---
id: library-room
size: [24, 18]
palette: interior-premium
---
# Library Interior (Archive of the Settled Lands)

The largest collection of written memory in the known world -- which is
not saying much, given how much has been lost. Tall bookshelves form narrow
corridors of knowledge, their upper reaches lost in shadow despite the
brass candleholders placed at every junction. The shelves are perhaps a
third full; the empty spaces are not emptiness but absence, visible proof
of everything the Dissolved civilizations left behind and the Preservers
failed to protect.

A central reading table sits beneath the room's only skylight, bathed in
a column of natural light. Scrolls are weighted down with polished stones.
The library's keeper -- a quiet, methodical scholar -- maintains the
collection with a devotion that borders on reverence. The air is cool and
still, heavy with the particular silence of places where people come to
remember.

## Room Structure

A grand rectangular room organized around the central reading area:
- **North stacks** (cols 2-22, rows 3-7): Tall bookshelves in two rows
  with a narrow aisle between them. The oldest and most fragile texts.
- **Central reading area** (cols 6-18, rows 8-12): Open space with a large
  table, benches, and good lighting. Where visitors study.
- **South stacks** (cols 2-10, rows 13-15): Lower shelves with more
  recent acquisitions and scroll storage.
- **Curator's alcove** (cols 14-22, rows 13-15): The librarian's desk,
  personal collection, and a locked cabinet of restricted texts.

### Floor
Stone tile flooring throughout -- wood would be a fire risk in a building
full of irreplaceable documents. Carpet runners (`carpet-obj.1`, `carpet-obj.2`)
define the reading area and the path from door to desk.

### Walls
Gray stone walls, undecorated. The walls are intentionally bare -- every
surface that could hold a shelf does hold a shelf. Two windows on the east
wall and one on the west provide supplementary light.

## Objects
- **shelf-north-1**: position (2, 3), type: furniture -- `shelf.tall-scrolls-3` (48x64)
- **shelf-north-2**: position (5, 3), type: furniture -- `shelf.tall-scrolls-2` (32x64)
- **shelf-north-3**: position (8, 3), type: furniture -- `shelf.tall-bottles-2` (32x64)
- **shelf-north-4**: position (11, 3), type: furniture -- `shelf.tall-scrolls-3` (48x64)
- **shelf-north-5**: position (15, 3), type: furniture -- `shelf.tall-scrolls-2` (32x64)
- **shelf-north-6**: position (18, 3), type: furniture -- `shelf.tall-closet-2` (32x64)
- **shelf-north-7**: position (21, 3), type: furniture -- `shelf.tall-bottles-3` (48x64)
- **shelf-south-1**: position (2, 13), type: furniture -- `shelf.tall-scrolls-2` (32x64)
- **shelf-south-2**: position (5, 13), type: furniture -- `shelf.tall-scrolls-3` (48x64)
- **shelf-south-3**: position (8, 13), type: furniture -- `shelf.tall-closet-2` (32x64)
- **shelf-side-w**: position (1, 8), type: furniture -- `shelf.side-tall-left-3` (16x64)
- **shelf-side-e**: position (22, 8), type: furniture -- `shelf.side-medium-right-2` (16x48)
- **reading-table**: position (8, 8), type: furniture -- `table.large-white-stripe` (64x48)
- **reading-table-2**: position (14, 8), type: furniture -- `table.large-1` (64x48)
- **bench-n-1**: position (8, 7), type: furniture -- `bench.long-1` (32x16)
- **bench-n-2**: position (14, 7), type: furniture -- `bench.long-2` (32x16)
- **bench-s-1**: position (8, 10), type: furniture -- `bench.long-3` (32x16)
- **bench-s-2**: position (14, 10), type: furniture -- `bench.long-2` (32x16)
- **bench-side**: position (10, 8), type: furniture -- `bench.front` (16x32)
- **curator-desk**: position (16, 13), type: furniture -- `writing-desk.map-1` (32x48)
- **curator-chair**: position (17, 14), type: furniture -- `chair.right-1`
- **books-table-1**: position (9, 8), type: furniture -- `books.row-3`
- **books-table-2**: position (11, 8), type: furniture -- `books.row-4`
- **books-table-3**: position (15, 8), type: furniture -- `books.row-5`
- **books-table-4**: position (10, 9), type: furniture -- `books.row-9`
- **books-desk**: position (16, 13), type: furniture -- `books.row-3`
- **scroll-1**: position (9, 9), type: furniture -- `scroll.single`
- **scroll-2**: position (17, 13), type: furniture -- `scroll.single`
- **map-wall**: position (14, 3), type: furniture -- `wall-art.map-large` (48x32)
- **painting**: position (20, 3), type: furniture -- `wall-art.painting-small-2` (32x16)
- **chest-locked**: position (20, 14), type: chest -- `chest.steel-closed` (32x32)
- **chest-open**: position (2, 14), type: chest -- `chest.wood-closed` (32x32)
- **crate**: position (20, 13), type: furniture -- `crate.medium-closed` (16x32)
- **candle-table-1**: position (10, 8), type: furniture -- `candle.1`
- **candle-table-2**: position (16, 8), type: furniture -- `candle.2`
- **candle-desk**: position (18, 13), type: furniture -- `candle.3`
- **candleholder-1**: position (4, 7), type: furniture -- `candleholder.steel-1`
- **candleholder-2**: position (12, 3), type: furniture -- `candleholder.steel-2`
- **candleholder-3**: position (20, 7), type: furniture -- `candleholder.steel-3`
- **lantern-1**: position (6, 10), type: furniture -- `lantern.small`
- **lantern-2**: position (18, 10), type: furniture -- `lantern.small`
- **carpet-reading**: position (9, 9), type: furniture -- `carpet-obj.1` (64x48)
- **carpet-path**: position (14, 13), type: furniture -- `carpet-obj.2` (64x48)
- **pot-1**: position (2, 8), type: furniture -- `pot.ceramic-tall-1`
- **pot-2**: position (22, 14), type: furniture -- `pot.stone-tall-2`
- **vase**: position (11, 3), type: furniture -- `vase.small`
- **package**: position (21, 14), type: furniture -- `package.small`
- **window-e-1**: position (23, 5), type: furniture -- `window.wood-2` (east wall)
- **window-e-2**: position (23, 11), type: furniture -- `window.wood-3` (east wall)
- **window-w**: position (1, 5), type: furniture -- `window.wood-6` (west wall)
- **keeper-spawn**: position (17, 14), type: npc -- librarian at the curator's desk
- **scholar-spawn**: position (10, 9), type: npc -- a visiting scholar, reading
- **return-door**: position (12, 16), type: transition -- exit to village exterior

## Notes

- The library is a late Act I / early Act II destination. It becomes
  important when the player needs to research the Dissolved civilizations,
  the dormant gods, or the Preservers' origins.
- The half-empty shelves are the visual thesis of the entire game: the
  world has lost more than it remembers, and the player's job is to restore
  what can be restored -- not to fill the shelves back up, but to make the
  remaining knowledge vital again.
- The locked chest in the curator's alcove contains restricted texts about
  the Preservers. The librarian will not open it until the player has
  proven their intentions (quest gate).
- The wall map is a larger version of what the cartographer is working on.
  It shows the known world with vast blank spaces at the edges -- the
  Undrawn Lands.
- As vibrancy increases, the shelves slowly fill: not with new books, but
  with texts that "reappear" as the world remembers they existed. This is
  one of the most visible vibrancy effects in the game.
- The visiting scholar NPC rotates based on story progress -- different
  characters appear studying at different points in the narrative.
