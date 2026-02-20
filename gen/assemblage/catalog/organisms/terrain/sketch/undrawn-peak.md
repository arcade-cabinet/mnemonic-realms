---
id: undrawn-peak
size: [10, 12]
palette: desert-sketch
---
# Undrawn Peak

A mountain that trails off into unfinished lines. The base is rendered in solid rock -- gray stones and dark sand packed tight against the slope. Halfway up, the detail begins to thin. The boulders become suggestions. The cliff face loses its texture. Near the summit, the mountain is nothing but an outline against white void, a few confident strokes implying height and mass without committing to either.

The peak is a landmark visible across the Sketch Realm, a waypoint for nomads navigating between oases and camps. But no one climbs to the top. The higher you go, the less real the ground becomes, until your feet find nothing to stand on and you slide back down to where the world is still drawn.

Wind sweeps down from the undrawn summit carrying a sound like pages turning.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.void       ground.void       ground.void       ground.void       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.void       ground.void       ground.void       ground.void       ground.void       ground.void       ground.sand       ground.sand
ground.sand       ground.sand       ground.void       ground.void       ground.void       ground.void       ground.void       ground.void       ground.sand       ground.sand
ground.sand       ground.void       ground.void       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.void       ground.void       ground.sand
ground.sand       ground.void       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.void       ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
```

## Collision
```
1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1
1 1 1 1 1 1 1 1 1 1
0 1 1 1 1 1 1 1 1 0
0 1 1 0 0 0 0 1 1 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
```

## Objects
- **rock.gray-large**: position (4, 5), type: decoration, description: "A massive gray boulder at the mountain's base, solid and unyielding"
- **rock.gray-1**: position (2, 7), type: decoration, description: "A stone at the foot of the slope, half-buried in dark sand"
- **rock.gray-2**: position (7, 7), type: decoration, description: "A tall narrow rock, standing like a sentinel at the mountain's skirt"
- **rock.gray-4**: position (5, 8), type: decoration, description: "A weathered stone with lichen that was drawn in three different greens"
- **rock.sand-tall-1**: position (3, 6), type: decoration, description: "A column of sandstone leaning against the mountain's flank"
- **rock.sand-tall-2**: position (6, 6), type: decoration, description: "Another tall sandstone formation, its peak still textured while the mountain above it fades to outline"
- **rock.sand-1**: position (4, 9), type: decoration, description: "A loose stone at the base of the scree slope"
- **rock.sand-3**: position (6, 9), type: decoration, description: "A flat-topped rock that nomads use as a rest stop before attempting the climb"
- **crystal.large**: position (5, 4), type: interaction, description: "A resonance crystal grows from the rock where detail begins to fade. It vibrates with a frequency that makes your teeth ache. Touch it, and you glimpse the mountain as it was meant to be: snowcapped, forested, alive with birds that were never drawn."
- **peak-base**: position (5, 10), type: trigger, description: "You stand at the base of the Undrawn Peak. Above you, the mountain dissolves from solid rock into sketch lines into nothing. Wind pours down from the unfinished summit, carrying a sound like pages being turned by an unseen hand."
