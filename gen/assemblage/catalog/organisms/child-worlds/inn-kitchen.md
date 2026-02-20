---
id: inn-kitchen
size: [18, 14]
palette: interior-premium
---
# Tavern Kitchen (Bright Hearth Back Room)

The heart behind the hearth. Steam rises from a bubbling pot over the
cooking fire, and the smell of slow-roasted root vegetables and rosemary
fills every corner. Nyro's kitchen is organized chaos -- barrels of salted
fish share shelf space with jars of honey, crates of seasonal vegetables
crowd the floor near the pantry, and a flour-dusted prep table bears the
evidence of this morning's bread. A side of cured venison hangs from a
ceiling hook near the smoke vent, turning slowly in the updraft.

The kitchen tells you everything about Nyro's character that his warm
smile doesn't: he is meticulous about his ingredients, generous with his
portions, and deeply proud of a craft most people overlook. A handwritten
recipe board hangs on the wall, its entries added over years in increasingly
confident script. The oldest recipe reads simply "Mother's stew." The
newest reads "Frontier game pie -- for when the hunters bring back
something interesting."

## Room Structure

A functional kitchen layout optimized for cooking and storage:
- **Cooking station** (cols 2-6, rows 3-7): Fire, cooking pot, prep
  surface, and hanging ingredients within arm's reach
- **Prep table** (cols 8-13, rows 5-8): Central work surface for
  chopping, mixing, and plating
- **Pantry storage** (cols 14-16, rows 3-10): Barrels, crates, and
  shelves of preserved goods along the east wall
- **Fresh goods** (cols 2-6, rows 9-11): Crates of vegetables, baskets
  of produce, and a water barrel

### Floor
Stone tile flooring -- practical for a room with open flame and frequent
spills. A small carpet near the doorway catches tracked-in mud.

### Walls
Gray stone walls darkened by years of smoke near the cooking station.
A single window on the west wall provides ventilation. The recipe board
and hanging utensils cover the north wall.

## Objects
- **cooking-pot**: position (3, 4), type: furniture -- `brazier.small-pot` (32x48)
- **prep-table**: position (8, 5), type: furniture -- `table.large-1` (64x48)
- **shelf-pantry-1**: position (14, 3), type: furniture -- `shelf.tall-bottles-3` (48x64)
- **shelf-pantry-2**: position (14, 7), type: furniture -- `shelf.tall-closet-2` (32x64)
- **shelf-wall-1**: position (5, 3), type: furniture -- `shelf.wall-3` (32x32)
- **shelf-wall-2**: position (8, 3), type: furniture -- `shelf.wall-large-3` (48x32)
- **shelf-side**: position (16, 5), type: furniture -- `shelf.side-medium-right-2` (16x48)
- **barrel-water**: position (2, 9), type: furniture -- `barrel.water` (32x32)
- **barrel-meat**: position (14, 9), type: furniture -- `barrel.meat` (32x48)
- **barrel-horizontal**: position (5, 6), type: furniture -- `barrel.horizontal-1` (32x32)
- **barrel-small-fish**: position (15, 10), type: furniture -- `barrel.small-fish`
- **barrel-small-covered**: position (16, 10), type: furniture -- `barrel.small-covered`
- **barrel-small-meat**: position (14, 10), type: furniture -- `barrel.small-meat`
- **crate-tomatoes**: position (2, 10), type: furniture -- `crate.small-tomatoes`
- **crate-carrots**: position (3, 10), type: furniture -- `crate.small-carrots`
- **crate-eggplants**: position (4, 10), type: furniture -- `crate.small-eggplants`
- **crate-large**: position (6, 9), type: furniture -- `crate.large-empty` (32x32)
- **basket-tomatoes**: position (5, 9), type: furniture -- `basket.tomatoes` (32x32)
- **basket-carrots**: position (7, 9), type: furniture -- `basket.carrots` (32x32)
- **fish-hanging**: position (3, 3), type: furniture -- `fish.hanging-white`
- **food-meat**: position (9, 5), type: furniture -- `food.meat` (on prep table)
- **food-steak**: position (10, 5), type: furniture -- `food.steak-1` (on prep table)
- **food-cheese**: position (11, 5), type: furniture -- `food.cheese` (on prep table)
- **cleaver**: position (9, 6), type: furniture -- `cleaver.1` (16x32, on prep table)
- **bottle-hanging-1**: position (6, 3), type: furniture -- `bottle.hanging-green`
- **bottle-hanging-2**: position (8, 3), type: furniture -- `bottle.hanging-red`
- **bottle-1**: position (12, 5), type: furniture -- `bottle.green` (on prep table)
- **bottle-2**: position (10, 7), type: furniture -- `bottle.round-red`
- **plate-1**: position (10, 6), type: furniture -- `plate.1` (on prep table)
- **plate-2**: position (12, 6), type: furniture -- `plate.2`
- **pot-ceramic-1**: position (2, 6), type: furniture -- `pot.ceramic-tall-1`
- **pot-ceramic-2**: position (7, 3), type: furniture -- `pot.ceramic-small-2`
- **bucket**: position (6, 7), type: furniture -- `bucket.1`
- **sack-1**: position (8, 9), type: furniture -- `sack.large-1` (32x32)
- **sack-2**: position (16, 9), type: furniture -- `sack.small`
- **cloth-rolled**: position (12, 9), type: furniture -- `cloth.rolled-red`
- **candle-1**: position (9, 5), type: furniture -- `candle.1` (on prep table)
- **candle-2**: position (2, 7), type: furniture -- `candle.5`
- **candleholder**: position (12, 3), type: furniture -- `candleholder.steel-1`
- **lantern**: position (11, 7), type: furniture -- `lantern.small`
- **carpet**: position (9, 10), type: furniture -- `carpet-obj.3` (64x48)
- **window**: position (1, 5), type: furniture -- `window.wood-6` (west wall)
- **cook-spawn**: position (4, 5), type: npc -- kitchen helper tends the fire
- **return-door**: position (9, 12), type: transition -- back to tavern main room

## Notes

- The kitchen connects to the tavern main room (inn-tavern-room) through
  a doorway, not an exterior door. The return-door transition leads back
  to the Bright Hearth's dining hall.
- Nyro does most of the cooking himself, but a kitchen helper NPC stirs
  the pot and manages prep work. The helper rotates based on story state --
  in early acts it might be a village youth; later, a traveling cook who
  heard about the inn's growing reputation.
- The recipe board on the wall is examinable. Early game it shows simple
  comfort food. As vibrancy increases, new recipes appear using ingredients
  from awakened zones -- marsh mushroom soup, ridge-berry tart, grove-honey
  mead. Each recipe is a small story about the world opening up.
- The hanging fish and cured meat tell a supply story: Millbrook provides
  the fish, Heartfield the vegetables, Sunridge the game meat. If those
  zones are still dormant, the kitchen looks sparser.
- The cooking pot is always bubbling. In a world where memory fades, the
  smell of a good meal is an anchor. Nyro knows this instinctively, even
  if he can't articulate it the way Artun would.
