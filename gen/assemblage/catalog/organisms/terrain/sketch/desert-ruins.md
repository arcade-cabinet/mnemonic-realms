---
id: desert-ruins
size: [12, 10]
palette: desert-sketch
---
# Desert Ruins

Crumbling ancient structures half-buried in sand, remnants of a civilization that the Preservers drew from memory but could not sustain. Broken pillars rise at angles from the dunes. Walls stand in fragments, their sandstone surfaces still bearing faint patterns that might be writing or might be decoration -- it is impossible to tell where one ends and the other begins.

The ruins are older than the Sketch Realm's current inhabitants. Whatever was drawn here was drawn first, before the nomads and the oases, before the half-built villages. These structures were complete once. The sand reclaimed them not through erosion but through forgetting -- the Preservers' attention drifted, and the details dissolved.

Scattered among the rubble are cracked vases, toppled blocks, and the occasional gleam of a magic crystal embedded in a broken wall. The ruins hum faintly with residual creative energy, as if they remember what they used to be.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
```

## Collision
```
0 0 0 0 0 0 0 0 0 0 0 0
0 1 1 0 0 0 0 0 0 1 1 0
0 1 0 0 0 0 0 0 0 0 1 0
0 1 0 0 0 0 0 0 0 0 1 0
0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0
0 1 0 0 0 0 0 0 0 0 1 0
0 1 0 0 0 0 0 0 0 0 1 0
0 1 1 0 0 0 0 0 0 1 1 0
0 0 0 0 0 0 0 0 0 0 0 0
```

## Objects
- **ruin.wall-1**: position (1, 1), type: decoration, description: "A long stretch of crumbled wall, its sandstone blocks scattered like discarded thoughts"
- **ruin.wall-2**: position (9, 1), type: decoration, description: "Another wall fragment, shorter but thicker, still bearing faint carved patterns"
- **ruin.pillar-1**: position (3, 3), type: decoration, description: "A broken pillar rising from the sand at an angle, its capital long since buried"
- **ruin.pillar-2**: position (8, 3), type: decoration, description: "A matching pillar across what might have been a grand hall"
- **ruin.rock-block**: position (5, 5), type: decoration, description: "A massive dressed stone block, too heavy for the sand to swallow entirely"
- **ruin.bricks-broken-2**: position (2, 7), type: decoration, description: "Shattered bricks tumbled from a wall that collapsed into forgetting"
- **ruin.bricks-cracked-5**: position (9, 7), type: decoration, description: "Cracked sandstone pavers from a floor that once supported a roof"
- **prop.vase-large**: position (4, 4), type: decoration, description: "A large ceremonial vase, miraculously intact among the rubble"
- **prop.vase-3**: position (7, 6), type: decoration, description: "A smaller vase tilted against a fallen stone"
- **crystal.medium**: position (6, 2), type: interaction, description: "A magic crystal embedded in a broken wall, still pulsing with the creative energy that built this place. It remembers arches and domes and mosaics that the sand has swallowed."
- **prop.skeleton**: position (5, 8), type: decoration, description: "Bones half-buried in sand. Whoever this was, they came to the ruins looking for something."
- **ruins-center**: position (6, 5), type: trigger, description: "The ruins hum with a low resonance, like a song heard through water. This place was drawn with care and detail, once. Columns supported a vaulted ceiling. Mosaics covered the floor. Now the sand fills the spaces where beauty used to be."
