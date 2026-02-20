---
id: forge-anvil
size: [3, 2]
palette: village-premium
---
# Forge Anvil

An outdoor blacksmith's workstation consisting of a brick forge with bellows on the left, a heavy iron anvil in the center, and a quenching barrel on the right. The upper row holds the forge and anvil -- heavy, immovable equipment that defines the smith's territory. The lower row is the working floor where the smith stands and the player approaches.

In Everwick, Hark's forge sits beside his medium red house on the west side of the village square. The clang of hammer on anvil carries across the settlement, and the forge's glow is visible from the main road at dusk. In Millbrook, a smaller riverside forge serves the boat-builders who need iron rivets and anchor fittings.

## Layers

### ground
| | | |
|---|---|---|
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |

### objects
| | | |
|---|---|---|
| object:forge.brick | object:anvil.iron | object:barrel.water |
| 0 | 0 | 0 |

## Collision
| | | |
|---|---|---|
| 1 | 1 | 1 |
| 0 | 0 | 0 |

## Visuals
- **forge-fire**: `Animation_Campfire` at position (0, 0), animated forge glow (vibrancy-gated)

## Objects
- **anvil-interact**: position (1, 1), type: trigger, properties: { eventType: action, description: "A pitted iron anvil. Dents and hammer-marks tell the story of a thousand blades." }
- **forge-interact**: position (0, 1), type: trigger, properties: { eventType: action, description: "The forge radiates waves of heat. Coals pulse orange beneath the bellows." }
- **smith-spawn**: position (1, 1), type: npc -- blacksmith NPC stands at the working floor

## Anchors
- **customer**: position (1, 1) -- player interaction point
- **bellows**: position (0, 0) -- forge fire position, animation anchor

## Notes

- The forge object uses `Objects_Buildings` detail tiles. The anvil is from `Objects_Props` (`anvil.iron`, localTileId 198).
- The forge fire animation is the same `Animation_Campfire` TSX used in fireplaces but tinted orange-red at the organism level. At vibrancy 0, the forge is cold and dark.
- In Hark's forge scene (Act 1, Scene 4 area), the anvil-interact trigger leads to the weapon upgrade dialogue. Hark stands at smith-spawn when not inside his shop interior.
- Tool rack visual objects (`object:rack.tools`, `object:rack.weapons`) compose alongside the forge at the organism level, hung on the adjacent building wall.
- The quenching barrel (`object:barrel.water`) on the right doubles as a prop the player can examine: "Steam rises from the barrel. The water is black with iron dust."
