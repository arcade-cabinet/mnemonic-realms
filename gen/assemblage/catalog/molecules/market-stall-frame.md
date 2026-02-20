---
id: market-stall-frame
size: [3, 2]
palette: village-premium
variants:
  - id: market-stall-1
    objectRef: market.stand-1
    description: Canvas-awning stall with wooden counter
  - id: market-stall-2
    objectRef: market.stand-2
    description: Tented stall with fabric drapes
---
# Market Stall Frame

A three-by-two open-air market stand consisting of a canopy, counter surface, and display space. The northern row is the merchant's side (impassable, where the NPC stands behind the counter); the southern row is the customer's approach (passable).

Market stalls are simpler than full shop buildings -- no interior transitions, no doors. All interaction happens face-to-face at the counter. They cluster together in market squares and along main roads during vibrancy-gated market day events.

## Layers

### ground
| | | |
|---|---|---|
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |

## Collision
| | | |
|---|---|---|
| 1 | 1 | 1 |
| 0 | 0 | 0 |

## Visuals
- **stall-canopy**: object from `Objects_Buildings` at position (0, 0)
  - Variant 1: `market.stand-1` (localTileId 285)
  - Variant 2: `market.stand-2` (localTileId 286)

## Anchors
- **customer**: position (1, 1) -- player approaches from the south

## Notes

- The `Animation_MarketStand_1` and `Animation_MarketStand_2` TSX files provide animated variants with swaying fabric. Use these for active market stalls; use the static `Objects_Buildings` refs for closed/empty stalls.
- Wares displays (crates, barrels, produce baskets) from `Objects_Props` compose alongside the stall frame as additional visuals.
- In Everwick, market stalls appear near the quest board area during the vibrancy-gated market day. In Millbrook, Lissa's Fish Market uses a stall at the waterfront.
- The merchant NPC object is defined at the organism level when the stall is configured with a specific shopkeeper.
