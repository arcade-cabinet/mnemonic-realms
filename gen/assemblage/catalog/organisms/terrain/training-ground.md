---
id: training-ground
size: [10, 8]
palette: village-premium
---
# Training Ground

An open dirt yard ringed by wooden practice posts and straw dummies, where Everwick's militia drills and travelers sharpen their combat skills. The training ground is where Lira receives her first combat tutorial (Act 1, Scene 3) from the weapons master, learning the basic attack, defend, and memory-infused strike mechanics.

The ground is packed earth -- harder and smoother than the surrounding grass, worn flat by generations of boots. A low fence marks the perimeter, with a gap on the south side for entry. Practice targets (straw dummies on posts) stand at the north end, and a weapon rack sits near the entrance.

## Layers

### ground
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| terrain:fence | terrain:fence | terrain:fence | terrain:fence | terrain:fence | terrain:fence | terrain:fence | terrain:fence | terrain:fence | terrain:fence |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:fence | terrain:fence | terrain:fence | terrain:fence | 0 | 0 | terrain:fence | terrain:fence | terrain:fence | terrain:fence |

## Collision
| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 1 |

Top fence row and side fence posts block movement. Bottom fence has a 2-tile gate (columns 4-5). Row 1 has collision on the side pillars to keep the player inside the yard.

## Visuals
- **target-1**: `prop.board` at position (2, 1) -- straw practice dummy
- **target-2**: `prop.board` at position (5, 1) -- straw practice dummy
- **target-3**: `prop.board` at position (8, 1) -- straw practice dummy
- **weapon-rack**: `prop.crate-medium` at position (1, 6) -- weapon storage (placeholder)
- **barrel**: `prop.barrel-water` at position (8, 6) -- water barrel for the trainees

## Objects
- **trainer-npc**: position (5, 3), type: npc -- the weapons master who teaches combat basics
- **combat-trigger**: position (2, 2), type: trigger, size: (6, 4) -- area trigger for the combat tutorial sequence
- **entrance-south**: position (4, 7), type: spawn -- player entry point

## Anchors
- **entrance**: position (4, 7) -- gate opening on south side
- **center**: position (5, 4) -- middle of the training yard

## Notes

- The `terrain:fence` references use the `Tileset_Fence_1` Wang set for auto-tiled fence rendering. The gap on the south row creates the entry gate.
- The training ground is a key Act 1 location where the combat system is introduced. The combat trigger fires a tutorial scene when the player first enters the inner area.
- Practice dummies use `prop.board` as a placeholder. Dedicated training dummy sprites can replace these when available.
- At higher vibrancy levels, the training ground shows more activity: additional NPC trainees, a banner from `Animation_Banner_1`, and torches from `Animation_Torch_1` for evening training.
