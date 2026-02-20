---
id: shop-weapon-room
size: [25, 22]
palette: interior-premium
---
# Weapon Shop Interior

A well-stocked armory with crossed swords on the walls and the smell of oiled
leather. The back room bristles with weapon racks and armor stands; a sturdy
oak counter separates the display from the sales floor. Crates of unfinished
steel sit in the corners, and a purple banner hangs behind the keeper's post.

Derived from **WeaponSeller_1.tmx** (25x22, 16px tiles).

## Room Structure

The weapon shop has an L-shaped layout:
- **North room** (cols 3-13, rows 7-18): Main sales floor with weapon displays
- **East alcove** (cols 15-22, rows 11-18): Counter area and additional storage
- A narrow corridor (cols 8-9, rows 18-19) leads to the entrance door at the south

### Floor
Wood plank flooring throughout (`floor.wood-*` 2x2 repeating pattern).
A small decorative carpet (`carpet-obj.4`) placed near the counter.

### Walls
Gray stone walls (`wall.gray-*`) forming the L-shaped perimeter:
- North wall: rows 2-6, cols 2-13 (with ceiling edge and decorative strip)
- East extension wall: rows 6-10, cols 14-22
- South wall: row 18 (with door opening at cols 8-9)
- Left/right side walls connecting the rooms

### Wall Decorations
- Two windows on the north wall (cols 5, 9) -- `window.wood-3`
- Shield and swords display (`shield.swords-purple`) on east wall
- Shield front mount (`shield.front-purple`) on side wall
- Sword rack (`sword.wall`) on north wall

## Objects
- **counter**: position (13, 11), extends south 7 tiles -- L-shaped counter dividing keeper/customer
- **weapon-stand-1**: position (3, 7), type: furniture -- `weapon-stand.tall-6` (32x64)
- **weapon-stand-2**: position (11, 7), type: furniture -- `weapon-stand.purple-5` (32x64)
- **weapon-stand-3**: position (5, 12), type: furniture -- `weapon-stand.tall-1` (32x64)
- **armor-stand**: position (11, 9), type: furniture -- `armor-stand.purple` (32x32)
- **shelf-bottles**: position (15, 7), type: furniture -- `shelf.tall-bottles-2` (32x64)
- **shelf-closet**: position (15, 9), type: furniture -- `shelf.short-closet-2` (32x32)
- **shelf-glass**: position (15, 10), type: furniture -- `shelf.short-glass-1` (16x32)
- **shelf-books**: position (3, 11), type: furniture -- `shelf.medium-books-2` (32x48)
- **wardrobe**: position (3, 16), type: furniture -- `wardrobe.side` (16x64)
- **chest-gold**: position (20, 15), type: chest -- `chest.gold-closed` (32x32)
- **chest-wood**: position (16, 17), type: chest -- `chest.wood-closed` (32x32)
- **crate-1**: position (20, 14), type: furniture -- `crate.large-closed` (32x32)
- **crate-2**: position (18, 16), type: furniture -- `crate.medium-closed` (16x32)
- **crate-3**: position (5, 15), type: furniture -- `crate.medium-left` (32x32)
- **barrel-1**: position (18, 11), type: furniture -- `barrel.covered` (32x32)
- **barrel-2**: position (18, 13), type: furniture -- `barrel.steel-bars` (32x48)
- **barrel-swords**: position (3, 17), type: furniture -- `barrel.swords` (32x48)
- **sack**: position (20, 17), type: furniture -- `sack.small` (16x16)
- **package-1**: position (10, 15), type: furniture -- `package.large` (32x32)
- **package-2**: position (10, 16), type: furniture -- `package.small` (16x16)
- **candle-1**: position (5, 8), type: furniture -- `candle.1`
- **candle-2**: position (11, 8), type: furniture -- `candle.2`
- **candle-3**: position (18, 15), type: furniture -- `candle.5`
- **lantern**: position (8, 12), type: furniture -- `lantern.small`
- **carpet-1**: position (18, 17), type: furniture -- `carpet-obj.4` (48x64)
- **carpet-2**: position (5, 11), type: furniture -- `carpet-obj.3` (64x48)
- **pot**: position (7, 17), type: furniture -- `pot.ceramic-tall-3`
- **vase**: position (20, 12), type: furniture -- `vase.large`
- **window-n-1**: position (5, 5), type: furniture -- `window.wood-3` (on north wall)
- **window-n-2**: position (9, 5), type: furniture -- `window.wood-1` (on north wall)
- **keeper-spawn**: position (14, 12), type: npc -- weapon seller stands behind counter
- **door-south**: position (8, 19), type: transition -- exit to village exterior

## Collision

Walls and all furniture objects are impassable. The walkable area forms the
sales floor south of the counter and the corridor to the door. The area behind
the counter (north/east) is NPC-only space.

## Notes

- In Mnemonic Realms, the Everwick weapon shop is run by **Hark**, a gruff
  retired soldier who values craftsmanship over flashy enchantments.
- The purple color scheme (banners, shields, armor stand) matches Hark's
  faction affiliation.
- The L-shaped layout forces the player to browse past the weapon displays
  before reaching the counter -- good shop design.
- Barrel with swords and steel bars crates suggest an active forge nearby
  (Hark's forge exterior is adjacent).
