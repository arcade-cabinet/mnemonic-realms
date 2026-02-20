---
id: forge-room
size: [22, 18]
palette: interior-premium
---
# Blacksmith's Forge (Hark's Workshop)

Heat rolls off the walls. The forge at the back of the room glows a dull
orange even when Hark isn't working -- the coals never fully die, as if
the fire remembers its purpose. An anvil stands on a raised stone platform
in the center, its surface scarred by ten thousand hammer strikes, each one
a memory of something made. Weapon racks line the walls, holding blades in
various stages of completion: some gleaming and sharp, others rough blanks
waiting for the smith's attention.

Hark speaks through his craft. He is not a man of many words, but every
piece he forges carries an echo of the metal's origin -- ore from Sunridge
holds the warmth of high-altitude sun, steel from Millbrook rings with the
sound of rushing water. As the world's vibrancy increases, the quality and
variety of Hark's inventory grows. He doesn't understand why. He just knows
the metal "tells him more" lately.

## Room Structure

A working forge divided into functional zones:
- **Forge area** (cols 3-8, rows 3-8): The furnace, bellows, and quenching
  trough. Intensely hot, visually distinct with stone flooring.
- **Anvil platform** (cols 9-13, rows 6-10): Raised stone dais with the
  central anvil. This is where the magic happens.
- **Display/sales area** (cols 14-19, rows 3-12): Weapon racks, armor
  stands, and the counter where Hark does business.
- **Storage** (cols 3-8, rows 10-14): Crates of raw ore, steel bars, and
  unfinished pieces.

### Floor
Mixed flooring: stone tiles around the forge and anvil (heat resistance),
wood planks in the display and storage areas. Scorch marks on the stone
near the furnace.

### Walls
Gray stone walls, darker and soot-stained near the forge. Two windows on
the east wall provide ventilation. The north wall holds weapon mounts and
a shield display.

## Objects
- **furnace**: position (3, 3), type: furniture -- `brazier.small-pot` (32x48)
- **anvil**: position (10, 7), type: furniture -- `barrel.steel-bars` (32x48)
- **counter**: position (14, 8), type: furniture -- `table.medium-green` sales counter
- **weapon-stand-1**: position (15, 3), type: furniture -- `weapon-stand.tall-6` (32x64)
- **weapon-stand-2**: position (17, 3), type: furniture -- `weapon-stand.tall-1` (32x64)
- **weapon-stand-3**: position (19, 3), type: furniture -- `weapon-stand.purple-5` (32x64)
- **armor-stand**: position (14, 5), type: furniture -- `armor-stand.purple` (32x32)
- **shield-wall**: position (7, 3), type: furniture -- `shield.swords-purple` (wall mount)
- **shield-front**: position (10, 3), type: furniture -- `shield.front-purple` (wall mount)
- **sword-wall**: position (12, 3), type: furniture -- `sword.wall` (wall mount)
- **barrel-water**: position (5, 6), type: furniture -- `barrel.water` (32x32, quenching trough)
- **barrel-steel-1**: position (3, 10), type: furniture -- `barrel.steel-bars` (32x48)
- **barrel-steel-2**: position (5, 10), type: furniture -- `barrel.steel-bars` (32x48)
- **barrel-covered**: position (7, 10), type: furniture -- `barrel.covered` (32x32)
- **barrel-swords**: position (3, 13), type: furniture -- `barrel.swords` (32x48)
- **crate-1**: position (5, 12), type: furniture -- `crate.large-closed` (32x32)
- **crate-2**: position (7, 12), type: furniture -- `crate.medium-left` (32x32)
- **crate-steel**: position (3, 12), type: furniture -- `crate.steel-1`
- **shelf-tall**: position (19, 7), type: furniture -- `shelf.tall-closet-2` (32x64)
- **shelf-short**: position (19, 10), type: furniture -- `shelf.short-bottles-3` (48x32)
- **shelf-side**: position (1, 8), type: furniture -- `shelf.side-medium-left-3` (16x64)
- **bench-1**: position (14, 9), type: furniture -- `bench.long-2` (32x16)
- **bench-2**: position (9, 12), type: furniture -- `bench.long-3` (32x16)
- **bottle-hanging-1**: position (16, 3), type: furniture -- `bottle.hanging-red`
- **bottle-hanging-2**: position (18, 3), type: furniture -- `bottle.hanging-blue`
- **sack-1**: position (7, 13), type: furniture -- `sack.large-1` (32x32)
- **sack-2**: position (19, 12), type: furniture -- `sack.small`
- **bucket**: position (6, 8), type: furniture -- `bucket.1`
- **chest**: position (17, 12), type: chest -- `chest.gold-closed` (32x32)
- **package**: position (18, 12), type: furniture -- `package.large` (32x32)
- **candle-1**: position (15, 8), type: furniture -- `candle.1` (on counter)
- **candle-2**: position (11, 3), type: furniture -- `candle.2`
- **candleholder-1**: position (8, 5), type: furniture -- `candleholder.steel-1`
- **candleholder-2**: position (13, 5), type: furniture -- `candleholder.steel-2`
- **carpet**: position (14, 10), type: furniture -- `carpet-obj.2` (64x48)
- **pot**: position (9, 13), type: furniture -- `pot.stone-tall-2`
- **vase**: position (14, 3), type: furniture -- `vase.large`
- **window-1**: position (20, 5), type: furniture -- `window.wood-3` (east wall)
- **window-2**: position (20, 9), type: furniture -- `window.wood-6` (east wall)
- **hark-spawn**: position (10, 8), type: npc -- Hark stands near the anvil
- **return-door**: position (11, 16), type: transition -- exit to Everwick square

## Notes

- Hark's forge is one of the first locations where the player sees how
  memory broadcasting enhances a craftsperson's work. Higher vibrancy
  means better equipment options -- the metal "remembers more" and Hark
  can draw on those memories during forging.
- The forge never fully cools. This is not magic -- it is the accumulated
  memory of ten thousand fires, embedded in the stone. A subtle early
  example of how memory shapes the physical world.
- The weapon racks and armor stands are not just decoration -- they
  represent Hark's actual inventory. As vibrancy increases, more stands
  are filled, and the quality of displayed weapons improves.
- Hark's dialogue is sparse and craft-focused: "This blade? Sunridge ore.
  You can feel the altitude in the edge." He lets his work speak.
- The gold chest behind the counter contains Hark's personal collection --
  masterwork pieces he won't sell to just anyone. Quest reward items live
  here.
- The adjacent weapon shop (shop-weapon-room) is the retail front; this
  forge is the workshop where things are actually made. Players may visit
  both, but the forge is where crafting and upgrades happen.
