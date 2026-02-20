---
id: flickering-structure
size: [7, 7]
palette: frontier-seasons
---
# Flickering Structure

A ruined building caught between states of existence. Broken pillars stand beside intact ones. Crumbled walls phase in and out of solidity. Mushrooms colonize the rubble, feeding on whatever half-forgotten magic still pulses through the stones. At Flickerveil, these structures are the norm: buildings the world tried to remember but only got halfway right.

## Layers

### ground
| | | | | | | |
|---|---|---|---|---|---|---|
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dark-grass |
| terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass | terrain:ground.dark-grass |

## Collision
| | | | | | | |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Objects
- **pillar-intact**: position (1, 1), type: visual, ref: ruin.pillar-1
- **pillar-broken**: position (5, 1), type: visual, ref: ruin.pillar-2
- **wall-fragment**: position (3, 2), type: visual, ref: ruin.wall-small
- **rubble-1**: position (2, 3), type: visual, ref: ruin.block
- **rubble-2**: position (4, 3), type: visual, ref: rock.gray-1
- **mushroom-cluster-1**: position (1, 4), type: visual, ref: mushroom.4
- **mushroom-cluster-2**: position (5, 4), type: visual, ref: mushroom.5
- **stump-overgrown**: position (3, 5), type: visual, ref: stump.mushroom
- **flicker-trigger**: position (3, 3), type: trigger, properties: { "effect": "phase-shift", "frequency": "slow" }
- **examine-ruin**: position (3, 2), type: trigger, properties: { "dialogue": "The stones shimmer at the edges, as if the building can't decide whether it exists." }
