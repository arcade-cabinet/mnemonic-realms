---
id: inn-guest-room
size: [14, 12]
palette: interior-premium
---
# Inn Guest Room (Bright Hearth)

A small but tidy room upstairs at the Bright Hearth. The bed is narrow but
clean, dressed in faded blue linen that smells of lavender and woodsmoke.
A single window looks out over Everwick's rooftops, and a candle on the
nightstand burns with a steady, windless flame -- Nyro replaces them every
morning without being asked. A traveler's pack rests against the foot of
the bed, and a basin of water sits on the side table, still warm.

This is where the player rests between journeys. The room starts spare and
impersonal, but as zone vibrancy increases, small details appear: a vase
of wildflowers on the nightstand, a woven rug beside the bed, a book left
open by a previous guest. The room remembers its visitors.

## Room Structure

A single modest room with a warm, lived-in feeling. The bed occupies the
northeast corner, a writing desk sits by the window on the west wall, and
a small wardrobe stands near the door for the traveler's belongings.

### Floor
Wood plank flooring (`floor.wood-*` 2x2 pattern). A small carpet
(`carpet-obj.3`) lies beside the bed where bare feet touch down in the
morning.

### Walls
Gray stone walls with wood trim. A single window (`window.wood-3`) on
the west wall lets in afternoon light. The walls are mostly bare -- this
is a guest room, not a home.

## Objects
- **bed**: position (8, 3), type: furniture -- `bed.simple-2` (48x64)
- **nightstand**: position (11, 4), type: furniture -- `bedtable.medium` (32x32)
- **candle-nightstand**: position (11, 3), type: furniture -- `candle.1`
- **writing-desk**: position (2, 5), type: furniture -- `writing-desk.map-3` (16x48)
- **chair**: position (3, 6), type: furniture -- `chair.right-1`
- **wardrobe**: position (2, 3), type: furniture -- `wardrobe.side` (16x64)
- **basin-table**: position (5, 3), type: furniture -- `desk.side-1` (16x48)
- **vase**: position (6, 3), type: furniture -- `vase.small`
- **chest**: position (10, 8), type: chest -- `chest.wood-closed` (32x32)
- **sack**: position (8, 7), type: furniture -- `sack.small`
- **lantern**: position (4, 8), type: furniture -- `lantern.small`
- **carpet**: position (8, 5), type: furniture -- `carpet-obj.3` (64x48)
- **pot**: position (2, 8), type: furniture -- `pot.ceramic-small-2`
- **window**: position (1, 4), type: furniture -- `window.wood-3` (west wall)
- **candle-desk**: position (2, 5), type: furniture -- `candle.4`
- **return-door**: position (6, 10), type: transition -- hallway back to tavern main floor

## Notes

- The Bright Hearth guest room doubles as the player's save/rest point in
  Everwick. Interacting with the bed triggers the rest menu.
- Nyro rents this room to the player at no charge after Artun vouches for
  them in Act I, Scene 1. "Any friend of the Elder sleeps free. Just don't
  track mud on the linen."
- The chest serves as persistent player storage -- items left here persist
  between visits.
- As the world's vibrancy grows, the room gains subtle visual upgrades:
  flowers appear, the window view brightens, the candle burns warmer. This
  is environmental storytelling without dialogue.
- The room is intentionally small -- it should feel cozy, not luxurious.
  The player is a local kid, not a visiting noble.
