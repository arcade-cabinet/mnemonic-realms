---
id: farm-field
size: [12, 10]
palette: village-premium
parameterized: true
params:
  width: 8-20
  height: 6-16
  variant: [wheat, crops, orchard, irrigated]
  fence: boolean
  scarecrow: boolean
  farmers: array | null
  resonanceStone: { id, fragments, x, y } | null
---
# Farm Field

A rectangular patch of cultivated land -- the fundamental terrain unit of Heartfield and the surrounding agricultural zones. Farm fields produce the golden wheat, root vegetables, and hay that sustain the Settled Lands. They are walkable spaces where random encounters with field creatures (Meadow Sprites, Grass Serpents) occur.

## Variants

### Wheat (`terrain:farm`)
Golden rows of wheat using the `Tileset_FarmField` Wang set. The classic Heartfield look: endless tilled rows catching the afternoon light. Hay borders (`terrain:tallgrass.hay`) frame the field edges.

### Crops (mixed)
Alternating strips of different crop types separated by dirt walking paths. Each 3-tile-high strip gets a crop type, with a 1-tile dirt separator. Includes an optional scarecrow visual.

### Orchard
Fruit trees in a regular grid pattern (spaced 4 tiles apart) over a grass floor. The trees are visual objects with collision at their trunks. The space between trees is walkable.

### Irrigated
Crop rows intersected by narrow irrigation ditches (1-tile-wide shallow water channels running north-south or east-west at 6-tile intervals). The ditches are impassable.

## Layers

### ground (wheat example, 12x10)
| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay |
| tallgrass.hay | farm | farm | farm | farm | farm | farm | farm | farm | farm | farm | tallgrass.hay |
| tallgrass.hay | farm | farm | farm | farm | farm | farm | farm | farm | farm | farm | tallgrass.hay |
| tallgrass.hay | farm | farm | farm | farm | farm | farm | farm | farm | farm | farm | tallgrass.hay |
| tallgrass.hay | farm | farm | farm | farm | farm | farm | farm | farm | farm | farm | tallgrass.hay |
| tallgrass.hay | farm | farm | farm | farm | farm | farm | farm | farm | farm | farm | tallgrass.hay |
| tallgrass.hay | farm | farm | farm | farm | farm | farm | farm | farm | farm | farm | tallgrass.hay |
| tallgrass.hay | farm | farm | farm | farm | farm | farm | farm | farm | farm | farm | tallgrass.hay |
| tallgrass.hay | farm | farm | farm | farm | farm | farm | farm | farm | farm | farm | tallgrass.hay |
| tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay | tallgrass.hay |

All terrain references are prefixed with `terrain:` at generation time.

## Collision
All 0 (fully walkable). Random encounters are zone-based, not collision-based. Fenced fields have collision 1 on the fence border tiles.

## Visuals
- Scarecrow prop at a random interior position (crops and wheat variants)
- Hay bale visuals (`prop.barrel-empty` placeholder) scattered in larger fields
- Fence post visuals at corners when `fence: true`
- Fruit tree objects in grid pattern (orchard variant)

## Objects
- **Farmer NPCs**: positioned at field edges, with sprites and dialogue about the harvest
- **Resonance stone**: hidden among the crops, trigger with fragments

## Anchors
- **north**: (center_x, 0)
- **south**: (center_x, height-1)
- **east**: (width-1, center_y)
- **west**: (0, center_y)

## Notes

- `terrain:farm` maps to the `Tileset_FarmField` Wang set which auto-tiles tilled row patterns. Adjacent farm tiles seamlessly merge.
- `terrain:tallgrass.hay` maps to `Tileset_TallGrass` Wang set "Hay" color -- creates a natural border of dried grass around field edges.
- The existing TypeScript factories (`wheat-field.ts` and `farmland.ts`) implement the wheat and variant logic respectively.
- For stagnation zones, replace farm terrain with `terrain:sand` + `terrain:shadow.light` to show crystallized fields.
