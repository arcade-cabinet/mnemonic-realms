---
id: residence-room
size: [18, 14]
palette: interior-premium
---
# Elder's Residence (Artun's House)

The home of Everwick's oldest living memory -- Elder Artun. Every surface
tells a story. Bookshelves buckle under decades of journals, maps, and
collected fragments of Dissolved-era writing. A heavy oak desk sits beneath
the window, its surface barely visible under open volumes and scattered
notes. The hearth in the corner hasn't gone cold in thirty years; Artun
says the fire remembers how to burn.

The air smells of old paper, pipe tobacco, and the faintest trace of amber
-- the scent of memory fragments kept too long in one place. A leather
armchair faces the fireplace, worn smooth by years of evening reading. This
is where the game begins: Scene 1, Act I.

## Room Structure

Two areas divided by furniture rather than walls:
- **Study area** (cols 2-10, rows 3-10): Desk, bookshelves, and the
  leather armchair. This is where Artun works and receives visitors.
- **Living area** (cols 11-16, rows 3-10): Bed, wardrobe, personal
  effects. Artun lives simply despite his learning.

### Floor
Wood plank flooring with a large red carpet (`carpet-obj.1`) covering
most of the study area. A smaller carpet near the bed.

### Walls
Gray stone walls. Two windows (`window.wood-2`, `window.wood-3`) on the
north wall flood the desk with morning light. Wall-mounted bookshelves
supplement the freestanding ones.

## Objects
- **desk**: position (3, 5), type: furniture -- `writing-desk.map-1` (32x48)
- **desk-chair**: position (4, 6), type: furniture -- `chair.right-1`
- **armchair**: position (7, 7), type: furniture -- `bench.front` (16x32)
- **shelf-tall-1**: position (2, 3), type: furniture -- `shelf.tall-scrolls-2` (32x64)
- **shelf-tall-2**: position (8, 3), type: furniture -- `shelf.tall-bottles-2` (32x64)
- **shelf-wall**: position (5, 3), type: furniture -- `shelf.wall-3` (32x32)
- **books-desk-1**: position (3, 4), type: furniture -- `books.row-3`
- **books-desk-2**: position (4, 4), type: furniture -- `books.row-5`
- **books-floor**: position (6, 8), type: furniture -- `books.row-9`
- **scroll**: position (5, 5), type: furniture -- `scroll.single`
- **bed**: position (12, 3), type: furniture -- `bed.simple-2` (48x64)
- **bedtable**: position (11, 4), type: furniture -- `bedtable.medium` (32x32)
- **wardrobe**: position (15, 3), type: furniture -- `wardrobe.side` (16x64)
- **shelf-side**: position (16, 6), type: furniture -- `shelf.side-medium-right-3` (16x64)
- **pot-1**: position (10, 3), type: furniture -- `pot.ceramic-tall-1`
- **pot-2**: position (2, 8), type: furniture -- `pot.stone-tall-2`
- **candle-desk**: position (3, 5), type: furniture -- `candle.1`
- **candle-shelf**: position (9, 3), type: furniture -- `candle.2`
- **candleholder**: position (14, 7), type: furniture -- `candleholder.steel-1`
- **lantern**: position (7, 5), type: furniture -- `lantern.small`
- **carpet-study**: position (4, 6), type: furniture -- `carpet-obj.1` (64x48)
- **carpet-bed**: position (12, 6), type: furniture -- `carpet-obj.3` (64x48)
- **vase**: position (11, 3), type: furniture -- `vase.tall`
- **chest**: position (14, 9), type: chest -- `chest.wood-closed` (32x32)
- **sack**: position (16, 9), type: furniture -- `sack.small`
- **package**: position (15, 9), type: furniture -- `package.small`
- **map-wall**: position (5, 3), type: furniture -- `wall-art.map-medium` (32x32)
- **painting**: position (13, 3), type: furniture -- `wall-art.painting-small-2` (32x16)
- **window-1**: position (4, 2), type: furniture -- `window.wood-2` (north wall)
- **window-2**: position (10, 2), type: furniture -- `window.wood-3` (north wall)
- **artun-spawn**: position (4, 5), type: npc -- Artun stands at his desk
- **return-door**: position (9, 12), type: transition -- exit to Everwick square

## Notes

- This is the FIRST interior the player sees in the entire game. It must
  feel warm, scholarly, and inviting -- not like a tutorial box.
- Artun's house establishes the world's tone: knowledge matters, the past
  matters, and this old man's lifetime of study is about to pay off because
  he recognized the player's talent.
- The overflowing bookshelves and scattered notes are not clutter -- they
  are visual proof of Artun's decades studying the Dissolved civilizations.
- The wall map near the desk is partially drawn, foreshadowing the
  cartographer's role and the theme of an unfinished world.
- "A memory you can't change isn't a memory. It's a tombstone." -- Artun's
  defining quote, spoken in this room.
- The chest near the bed can be examined but not opened in Scene 1. In a
  later return visit (Scene 10), Artun offers its contents as a reward.
