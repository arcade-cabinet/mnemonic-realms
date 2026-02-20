---
id: luminous-oasis
size: [10, 10]
palette: desert-sketch
---
# Luminous Oasis

A spring of impossible clarity in the heart of the desert, ringed by emerald palms that are far too vivid for a half-drawn world. The water glows with a soft luminescence that has no visible source -- as if the artist lingered here, lavishing detail on this one patch of life while the surrounding wastes remain sparse and unfinished.

The oasis is a memory anchor. It feels older than the rest of the Sketch Realm, more real, more present. The sand around it is darker and denser, packed down by the feet of travelers who have come here across eras. Rocks jut from the water's edge, smooth and deliberate. Leafy bushes cluster near the shore.

Nomads say that drinking from the oasis brings fragments of other memories -- not your own, but someone's. The Preservers may have used this place as a wellspring for the creative force that draws the world into being.

## Layers

### ground
```
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.grass      ground.grass      ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.grass      water.oasis       water.oasis       ground.grass      ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.grass      water.oasis       water.oasis       water.oasis       water.oasis       ground.grass      ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.grass      water.oasis       water.oasis       water.oasis       water.oasis       ground.grass      ground.dark-sand  ground.sand
ground.sand       ground.dark-sand  ground.dark-sand  ground.grass      water.oasis       water.oasis       ground.grass      ground.dark-sand  ground.dark-sand  ground.sand
ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.grass      ground.grass      ground.dark-sand  ground.dark-sand  ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.dark-sand  ground.sand       ground.sand       ground.sand
ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand       ground.sand
```

## Collision
```
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 1 1 0 0 0 0
0 0 0 1 1 1 1 0 0 0
0 0 0 1 1 1 1 0 0 0
0 0 0 0 1 1 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
```

## Objects
- **tree.palm-emerald-1**: position (2, 2), type: decoration, description: "A tall palm with fronds so green they look painted in fresh ink"
- **tree.palm-emerald-2**: position (7, 2), type: decoration, description: "A second palm, its trunk curving over the water as if reaching to drink"
- **tree.palm-light-1**: position (1, 5), type: decoration, description: "A pale palm at the oasis edge, its leaves catching impossible light"
- **tree.palm-yellow-1**: position (8, 6), type: decoration, description: "A golden-leafed palm, vibrant against the bleached sand"
- **bush.emerald-1**: position (2, 7), type: decoration, description: "Dense green brush that thrives on the oasis moisture"
- **bush.emerald-2**: position (7, 7), type: decoration, description: "Another cluster of bushes, impossibly lush for this parched land"
- **rock.water-1**: position (3, 3), type: decoration, description: "A smooth stone half-submerged at the spring's edge"
- **rock.water-2**: position (6, 6), type: decoration, description: "A wet rock jutting from the shallow water"
- **crystal.large**: position (5, 1), type: interaction, description: "A resonance crystal thrums above the oasis. Its light reflects across the water in patterns that look like half-remembered faces."
- **oasis-drink**: position (4, 7), type: trigger, description: "You cup the luminous water in your hands. It tastes like nothing and everything at once -- like the memory of a flavor you cannot name. For an instant, you see a city that does not exist yet."
