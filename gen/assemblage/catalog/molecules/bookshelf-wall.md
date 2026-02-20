---
id: bookshelf-wall
size: [6, 1]
palette: interior-premium
---
# Bookshelf Wall

A row of tall bookshelves placed against a north-facing wall. Used in libraries,
studies, and any room that needs a wall of knowledge. The shelves are placed as
objects in the TMX object layer, positioned to overlap the wall face tiles.

## Variants

### Full Wall (6 wide)

Six tiles of coverage using alternating tall bookshelf objects. Each shelf
object is 32-48px wide (2-3 tiles) and 64px tall (4 tiles), placed so their
bottom edge aligns with the wall baseboard.

## Objects
- **shelf-1**: position (0, 0), type: furniture -- shelf.tall-books-2 (32x64)
- **shelf-2**: position (2, 0), type: furniture -- shelf.tall-books-3 (48x64)
- **shelf-3**: position (5, 0), type: furniture -- shelf.tall-books-1 (16x64)

### Half Wall (3 wide)

Three tiles of coverage for smaller rooms or mixed wall compositions.

## Objects
- **shelf-1**: position (0, 0), type: furniture -- shelf.tall-books-2 (32x64)
- **shelf-2**: position (2, 0), type: furniture -- shelf.tall-scrolls-3 (48x64)

### With Scrolls

Alternates book shelves with scroll shelves for a scribe's workshop feel.

## Objects
- **shelf-1**: position (0, 0), type: furniture -- shelf.tall-scrolls-2 (32x64)
- **shelf-2**: position (2, 0), type: furniture -- shelf.tall-books-3 (48x64)
- **shelf-3**: position (5, 0), type: furniture -- shelf.tall-scrolls-3 (48x64)

## Collision

All shelf positions are impassable (collision = 1). The player cannot walk
through bookshelves.

| | | | | | |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 |

## Notes

- In Library_1.tmx, bookshelf walls line both the east and west walls of the main room.
- Side-facing shelf variants (`shelf.side-tall-left-*` / `shelf.side-tall-right-*`)
  are used along left/right walls instead of front-facing shelves.
- Wall-mounted shelves (`shelf.wall-*`) go on the wall face above the tall shelves
  for a floor-to-ceiling library effect.
- Candle holders (`candleholder.steel-1/2`) are placed between shelves for lighting.
- Individual books (`book.single-1/2`, `book.open`) and book rows (`books.row-*`)
  decorate tables and desks near the shelves.
