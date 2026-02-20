---
id: shop-provisions-room
size: [18, 16]
palette: interior-premium
---
# Provisions Shop Interior

A sturdy, no-nonsense supply depot that smells of burlap, dried grain,
and lamp oil. Crates and barrels are stacked with quartermaster precision
along every wall -- rope coils hang from ceiling hooks, lanterns swing
gently from iron brackets, and a large set of merchant scales sits on the
counter, its brass pans polished to a high shine. This is not a place for
browsing. This is a place for people who know what they need and want it
packed before sunset.

The provisions keeper runs this shop like a supply line. Every item has a
designated place, every barrel is labeled in tight block script, and the
inventory ledger behind the counter is updated daily. When adventurers
pass through Everwick on their way to the frontier, this is their last
stop. The keeper has heard every expedition plan and seen most of them
fail. They sell supplies without sentiment but always add an extra coil
of rope. "You'll want it," they say. "Everyone always wants it."

## Room Structure

A utilitarian layout built for efficiency rather than comfort:
- **Counter area** (cols 5-12, rows 4-6): Sales counter with scales,
  ledger, and the keeper's working space
- **Bulk storage west** (cols 2-5, rows 7-12): Heavy goods -- rope,
  lamp oil, tools, and hardware in barrels and crates
- **Dry goods east** (cols 12-16, rows 7-12): Food provisions, grain
  sacks, preserved rations, and bottled supplies on shelving
- **Customer floor** (cols 5-12, rows 7-12): Open space for customers
  to select and gather their purchases

### Floor
Stone tile flooring -- weight-bearing for heavy crates and barrels. A
narrow carpet runner (`carpet-obj.2`) leads from the door to the counter.

### Walls
Gray stone walls. Minimal decoration -- the merchandise IS the decoration.
Shelves mounted on every available wall surface hold overflow stock. A
single window on the east wall lets in working light.

## Objects
- **counter**: position (6, 4), type: furniture -- `table.large-white-stripe` (64x48) sales counter
- **scales**: position (8, 4), type: furniture -- `candle.2` (placeholder for merchant scales)
- **ledger**: position (7, 4), type: furniture -- `books.row-3` (inventory ledger)
- **shelf-tall-1**: position (13, 3), type: furniture -- `shelf.tall-bottles-3` (48x64)
- **shelf-tall-2**: position (2, 3), type: furniture -- `shelf.tall-closet-2` (32x64)
- **shelf-short-1**: position (13, 8), type: furniture -- `shelf.short-bottles-2` (32x32)
- **shelf-short-2**: position (15, 8), type: furniture -- `shelf.short-glass-1` (16x32)
- **shelf-wall**: position (6, 3), type: furniture -- `shelf.wall-large-3` (48x32)
- **shelf-side**: position (16, 5), type: furniture -- `shelf.side-medium-right-3` (16x64)
- **barrel-covered-1**: position (2, 7), type: furniture -- `barrel.covered` (32x32)
- **barrel-covered-2**: position (4, 7), type: furniture -- `barrel.covered` (32x32)
- **barrel-steel**: position (2, 9), type: furniture -- `barrel.steel-bars` (32x48)
- **barrel-horizontal**: position (4, 9), type: furniture -- `barrel.horizontal-1` (32x32)
- **barrel-small-water**: position (2, 11), type: furniture -- `barrel.small-water`
- **barrel-small-covered**: position (3, 11), type: furniture -- `barrel.small-covered`
- **crate-large-1**: position (4, 11), type: furniture -- `crate.large-closed` (32x32)
- **crate-large-2**: position (13, 10), type: furniture -- `crate.large-empty` (32x32)
- **crate-medium**: position (15, 10), type: furniture -- `crate.medium-right` (32x32)
- **crate-steel**: position (2, 12), type: furniture -- `crate.steel-1`
- **crate-water**: position (15, 12), type: furniture -- `crate.water` (16x32)
- **sack-1**: position (13, 11), type: furniture -- `sack.large-1` (32x32)
- **sack-2**: position (15, 11), type: furniture -- `sack.small`
- **sack-3**: position (6, 10), type: furniture -- `sack.large-1` (32x32)
- **basket-1**: position (13, 12), type: furniture -- `basket.empty` (32x32)
- **basket-2**: position (8, 10), type: furniture -- `basket.carrots` (32x32)
- **package-1**: position (4, 12), type: furniture -- `package.large` (32x32)
- **package-2**: position (10, 10), type: furniture -- `package.small`
- **bottle-hanging-1**: position (9, 3), type: furniture -- `bottle.hanging-green`
- **bottle-hanging-2**: position (11, 3), type: furniture -- `bottle.hanging-blue`
- **bottle-1**: position (14, 8), type: furniture -- `bottle.blue`
- **bottle-2**: position (14, 9), type: furniture -- `bottle.green`
- **chest**: position (10, 12), type: chest -- `chest.steel-closed` (32x32)
- **bucket**: position (6, 8), type: furniture -- `bucket.1`
- **pot**: position (2, 6), type: furniture -- `pot.stone-tall-2`
- **candle-counter**: position (9, 4), type: furniture -- `candle.1` (on counter)
- **candle-shelf**: position (14, 3), type: furniture -- `candle.4`
- **candleholder**: position (4, 5), type: furniture -- `candleholder.steel-1`
- **lantern**: position (10, 8), type: furniture -- `lantern.small`
- **carpet**: position (7, 8), type: furniture -- `carpet-obj.2` (64x48)
- **window**: position (17, 7), type: furniture -- `window.wood-3` (east wall)
- **keeper-spawn**: position (7, 5), type: npc -- provisions keeper behind counter
- **return-door**: position (9, 14), type: transition -- exit to village exterior

## Notes

- The provisions shop is the consumables vendor -- potions, rations, rope,
  torches, antidotes, and travel supplies. Distinct from Khali's general
  goods (cosmetics, fabrics, household items) and Hark's forge (weapons
  and armor).
- The keeper's personality is pragmatic and slightly world-weary. They've
  outfitted dozens of expeditions to the frontier and have a statistician's
  sense of what people actually need versus what they think they need.
  "Three healing salves? Take six. And a rope. And another rope."
- Inventory scales with game progression: early game stocks basic rations
  and torches. As Act II opens and the frontier becomes accessible, the
  shop stocks cold-weather gear, marsh boots, climbing picks, and
  resonance-shielding amulets.
- The shop's utilitarian aesthetic contrasts with the more colorful shops
  in Everwick. This is deliberate -- the provisions keeper deals in
  function, not form. Their one concession to decoration is the polished
  brass scales, which they maintain with visible pride.
- The steel-cased chest near the back holds premium supplies that unlock
  as zone vibrancy increases -- the keeper sources rare goods from
  newly-awakened regions but keeps them locked until demand warrants
  the markup.
