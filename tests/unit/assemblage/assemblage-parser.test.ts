import { describe, it, expect } from 'vitest';
import {
  parseAssemblageMarkdown,
  parseTileGrid,
  parseLayers,
  parseCollisionSection,
  parseObjectsSection,
  parseVisualsSection,
  parseAnchorsSection,
} from '../../../gen/assemblage/compiler/assemblage-parser';

// --- Tile grid parsing ---

describe('parseTileGrid', () => {
  it('parses markdown table format', () => {
    const section = `
| | | |
|---|---|---|
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | 0 | terrain:ground.dirt |
`;
    const grid = parseTileGrid(section);
    expect(grid).not.toBeNull();
    expect(grid!.width).toBe(3);
    expect(grid!.height).toBe(2);
    expect(grid!.tiles).toEqual([
      'terrain:ground.dirt', 'terrain:ground.dirt', 'terrain:ground.dirt',
      'terrain:ground.dirt', 0, 'terrain:ground.dirt',
    ]);
  });

  it('parses code block format', () => {
    const section = `
\`\`\`
ground.sand   ground.sand   ground.sand
ground.sand   ground.dark-sand   ground.sand
\`\`\`
`;
    const grid = parseTileGrid(section);
    expect(grid).not.toBeNull();
    expect(grid!.width).toBe(3);
    expect(grid!.height).toBe(2);
    expect(grid!.tiles).toEqual([
      'ground.sand', 'ground.sand', 'ground.sand',
      'ground.sand', 'ground.dark-sand', 'ground.sand',
    ]);
  });

  it('handles 0 values in code block', () => {
    const section = `
\`\`\`
0 0 0
0 terrain:water.shallow 0
0 0 0
\`\`\`
`;
    const grid = parseTileGrid(section);
    expect(grid).not.toBeNull();
    expect(grid!.width).toBe(3);
    expect(grid!.height).toBe(3);
    expect(grid!.tiles[4]).toBe('terrain:water.shallow');
    expect(grid!.tiles[0]).toBe(0);
  });

  it('handles single-column table', () => {
    const section = `
| |
|---|
| object:door.wood-header |
| object:door.wood |
`;
    const grid = parseTileGrid(section);
    expect(grid).not.toBeNull();
    expect(grid!.width).toBe(1);
    expect(grid!.height).toBe(2);
    expect(grid!.tiles).toEqual(['object:door.wood-header', 'object:door.wood']);
  });
});

// --- Layer parsing ---

describe('parseLayers', () => {
  it('parses multiple layers with table format', () => {
    const body = `
# Fountain Base

A stone fountain.

## Layers

### ground
| | | |
|---|---|---|
| terrain:road.brick | terrain:road.brick | terrain:road.brick |
| terrain:road.brick | terrain:road.brick | terrain:road.brick |

### water
| | | |
|---|---|---|
| 0 | 0 | 0 |
| 0 | terrain:water.shallow | 0 |

## Collision
| | | |
|---|---|---|
| 1 | 1 | 1 |
| 1 | 1 | 1 |
`;
    const layers = parseLayers(body);
    expect(Object.keys(layers)).toEqual(['ground', 'water']);
    expect(layers.ground.width).toBe(3);
    expect(layers.ground.height).toBe(2);
    expect(layers.water.tiles[3]).toBe(0);
    expect(layers.water.tiles[4]).toBe('terrain:water.shallow');
  });

  it('strips variant annotation from layer names', () => {
    const body = `
# Wall Section

## Layers

### objects (red variant)
| | | |
|---|---|---|
| object:wall.red-upper-l | object:wall.red-upper-m | object:wall.red-upper-r |
| object:wall.red-lower-l | object:wall.red-lower-m | object:wall.red-lower-r |

### objects (blue variant)
| | | |
|---|---|---|
| object:wall.blue-upper-l | object:wall.blue-upper-m | object:wall.blue-upper-r |
| object:wall.blue-lower-l | object:wall.blue-lower-m | object:wall.blue-lower-r |

## Collision
`;
    const layers = parseLayers(body);
    // Both variants share the 'objects' key — last one wins
    expect(layers.objects).toBeDefined();
    expect(layers.objects.width).toBe(3);
  });

  it('handles code block format in layers', () => {
    const body = `
# Outline Structure

## Layers

### ground
\`\`\`
ground.sand   ground.sand   ground.sand
ground.sand   ground.dark-sand   ground.sand
ground.sand   ground.sand   ground.sand
\`\`\`

## Collision
`;
    const layers = parseLayers(body);
    expect(layers.ground).toBeDefined();
    expect(layers.ground.width).toBe(3);
    expect(layers.ground.height).toBe(3);
    expect(layers.ground.tiles[4]).toBe('ground.dark-sand');
  });
});

// --- Collision parsing ---

describe('parseCollisionSection', () => {
  it('parses table-format collision', () => {
    const body = `
## Layers
### ground
| |
|---|
| terrain:grass |

## Collision
| | | | |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 |
`;
    const collision = parseCollisionSection(body);
    expect(collision).not.toBeNull();
    expect(collision!.width).toBe(4);
    expect(collision!.height).toBe(3);
    expect(collision!.data).toEqual([
      1, 1, 1, 1,
      1, 0, 1, 1,
      0, 0, 0, 0,
    ]);
  });

  it('parses code block collision', () => {
    const body = `
## Collision
\`\`\`
0 0 0 0
0 1 1 0
0 1 1 0
0 0 0 0
\`\`\`
`;
    const collision = parseCollisionSection(body);
    expect(collision).not.toBeNull();
    expect(collision!.width).toBe(4);
    expect(collision!.height).toBe(4);
    expect(collision!.data[5]).toBe(1);
    expect(collision!.data[0]).toBe(0);
  });
});

// --- Objects parsing ---

describe('parseObjectsSection', () => {
  it('parses transition objects', () => {
    const body = `
## Objects
- **door**: position (1, 2), type: transition
`;
    const objects = parseObjectsSection(body);
    expect(objects).toHaveLength(1);
    expect(objects[0]).toEqual({
      name: 'door',
      type: 'transition',
      x: 1,
      y: 2,
    });
  });

  it('parses objects with descriptions', () => {
    const body = `
## Objects
- **ruin.bricks-cracked-1**: position (1, 1), type: decoration, description: "A fragment of sandstone wall"
- **examine-outline**: position (4, 2), type: trigger, description: "The walls are drawn in cracked outlines"
`;
    const objects = parseObjectsSection(body);
    expect(objects).toHaveLength(2);
    expect(objects[0].name).toBe('ruin.bricks-cracked-1');
    expect(objects[0].type).toBe('trigger'); // decoration maps to trigger
    expect(objects[0].x).toBe(1);
    expect(objects[0].properties?.description).toBe('A fragment of sandstone wall');
    expect(objects[1].name).toBe('examine-outline');
    expect(objects[1].type).toBe('trigger');
  });

  it('parses objects with properties block', () => {
    const body = `
## Objects
- **door**: position (0, 1), type: transition, properties: { targetMap, targetX, targetY }
`;
    const objects = parseObjectsSection(body);
    expect(objects).toHaveLength(1);
    expect(objects[0].properties?.targetMap).toBe('<slot>');
    expect(objects[0].properties?.targetX).toBe('<slot>');
  });

  it('parses spawn-type objects', () => {
    const body = `
## Objects
- **village-center**: position (6, 6), type: spawn, description: "The center of a village"
`;
    const objects = parseObjectsSection(body);
    expect(objects).toHaveLength(1);
    expect(objects[0].type).toBe('spawn');
  });

  it('parses npc-anchor type', () => {
    const body = `
## Objects
- **merchant**: position (9, 7), type: npc-anchor, description: "A market stall"
`;
    const objects = parseObjectsSection(body);
    expect(objects).toHaveLength(1);
    expect(objects[0].type).toBe('npc');
  });
});

// --- Visuals parsing ---

describe('parseVisualsSection', () => {
  it('parses visual object references', () => {
    const body = `
## Visuals
- **building**: \`house.red-small-1\` at position (0, 0)
`;
    const visuals = parseVisualsSection(body);
    expect(visuals).toHaveLength(1);
    expect(visuals[0].objectRef).toBe('house.red-small-1');
    expect(visuals[0].x).toBe(0);
    expect(visuals[0].y).toBe(0);
  });

  it('parses visual with object prefix', () => {
    const body = `
## Visuals
- **fountain**: object \`Animation_Fountain_1\` at position (0, 0), animated water spout
`;
    const visuals = parseVisualsSection(body);
    expect(visuals).toHaveLength(1);
    expect(visuals[0].objectRef).toBe('Animation_Fountain_1');
  });

  it('parses visual without backticks', () => {
    const body = `
## Visuals
- **building**: house.red-small-1 at position (2, 3)
`;
    const visuals = parseVisualsSection(body);
    expect(visuals).toHaveLength(1);
    expect(visuals[0].objectRef).toBe('house.red-small-1');
    expect(visuals[0].x).toBe(2);
    expect(visuals[0].y).toBe(3);
  });
});

// --- Anchors parsing ---

describe('parseAnchorsSection', () => {
  it('parses anchor points', () => {
    const body = `
## Anchors
- **entrance**: position (1, 2)
- **front**: position (2, 2) -- NPC standing spot outside the door
`;
    const anchors = parseAnchorsSection(body);
    expect(anchors).toHaveLength(2);
    expect(anchors[0]).toEqual({ name: 'entrance', x: 1, y: 2 });
    expect(anchors[1]).toEqual({ name: 'front', x: 2, y: 2 });
  });

  it('parses single anchor', () => {
    const body = `
## Anchors
- **south**: position (1, 2) -- approach from the village square
`;
    const anchors = parseAnchorsSection(body);
    expect(anchors).toHaveLength(1);
    expect(anchors[0].name).toBe('south');
  });
});

// --- Full file parsing ---

describe('parseAssemblageMarkdown', () => {
  it('parses a molecule (door-frame)', () => {
    const md = `---
id: door-frame
size: [1, 2]
palette: village-premium
---
# Door Frame

A standard wooden door set into a building wall.

## Layers

### objects
| |
|---|
| object:door.wood-header |
| object:door.wood |

## Collision
| |
|---|
| 1 |
| 0 |

## Objects
- **door**: position (0, 1), type: transition, properties: { targetMap, targetX, targetY }
`;
    const result = parseAssemblageMarkdown(md);
    expect(result.definition.id).toBe('door-frame');
    expect(result.definition.width).toBe(1);
    expect(result.definition.height).toBe(2);
    expect(result.palette).toBe('village-premium');
    expect(result.definition.layers.objects).toBeDefined();
    expect(result.definition.layers.objects.tiles).toEqual([
      'object:door.wood-header',
      'object:door.wood',
    ]);
    expect(result.definition.collision?.data).toEqual([1, 0]);
    expect(result.definition.objects).toHaveLength(1);
    expect(result.definition.objects![0].type).toBe('transition');
  });

  it('parses an organism with composes and visuals (house)', () => {
    const md = `---
id: house-red-small
size: [4, 3]
palette: village-premium
objectRef: house.red-small-1
composes:
  - ref: [door-frame](../../molecules/door-frame.md)
    at: [1, 2]
  - ref: [window-frame-red](../../molecules/window-frame.md)
    at: [3, 1]
---
# Small Red House

A snug single-room cottage with crimson-painted walls.

## Layers

### ground
| | | | |
|---|---|---|---|
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |
| terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt | terrain:ground.dirt |

## Collision
| | | | |
|---|---|---|---|
| 1 | 1 | 1 | 1 |
| 1 | 0 | 1 | 1 |
| 0 | 0 | 0 | 0 |

## Visuals
- **building**: \`house.red-small-1\` at position (0, 0)

## Objects
- **door**: position (1, 2), type: transition

## Anchors
- **entrance**: position (1, 2)
- **front**: position (2, 2) -- NPC standing spot
`;
    const result = parseAssemblageMarkdown(md);
    expect(result.definition.id).toBe('house-red-small');
    expect(result.definition.width).toBe(4);
    expect(result.definition.height).toBe(3);
    expect(result.palette).toBe('village-premium');
    expect(result.objectRef).toBe('house.red-small-1');

    // Composes
    expect(result.composes).toHaveLength(2);
    expect(result.composes![0].ref.text).toBe('door-frame');
    expect(result.composes![0].ref.path).toBe('../../molecules/door-frame.md');
    expect(result.composes![0].at).toEqual([1, 2]);

    // Layers
    expect(result.definition.layers.ground.width).toBe(4);
    expect(result.definition.layers.ground.height).toBe(3);

    // Collision
    expect(result.definition.collision?.data[5]).toBe(0); // door position

    // Visuals
    expect(result.definition.visuals).toHaveLength(1);
    expect(result.definition.visuals![0].objectRef).toBe('house.red-small-1');

    // Objects
    expect(result.definition.objects).toHaveLength(1);

    // Anchors
    expect(result.definition.anchors).toHaveLength(2);
    expect(result.definition.anchors![0].name).toBe('entrance');
  });

  it('parses code-block format assemblage (desert/sketch)', () => {
    const md = `---
id: outline-structure
size: [4, 3]
palette: desert-sketch
---
# Outline Structure

A building that exists only as pencil outlines.

## Layers

### ground
\`\`\`
ground.sand   ground.sand   ground.sand   ground.sand
ground.sand   ground.dark-sand   ground.dark-sand   ground.sand
ground.sand   ground.sand   ground.sand   ground.sand
\`\`\`

## Collision
\`\`\`
0 0 0 0
0 1 1 0
0 0 0 0
\`\`\`

## Objects
- **examine-outline**: position (2, 1), type: trigger, description: "The walls are drawn in cracked outlines"
`;
    const result = parseAssemblageMarkdown(md);
    expect(result.definition.id).toBe('outline-structure');
    expect(result.palette).toBe('desert-sketch');
    expect(result.definition.width).toBe(4);
    expect(result.definition.height).toBe(3);
    expect(result.definition.layers.ground.width).toBe(4);
    expect(result.definition.layers.ground.tiles[5]).toBe('ground.dark-sand');
    expect(result.definition.collision?.data[5]).toBe(1);
    expect(result.definition.collision?.data[0]).toBe(0);
    expect(result.definition.objects).toHaveLength(1);
  });

  it('parses molecule with variants', () => {
    const md = `---
id: wall-section
size: [3, 2]
palette: village-premium
variants:
  - id: wall-section-red
    description: Red-painted wooden planks
  - id: wall-section-blue
    description: Blue-washed timber
---
# Wall Section

A horizontal run of building wall.

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
| 1 | 1 | 1 |
`;
    const result = parseAssemblageMarkdown(md);
    expect(result.variants).toHaveLength(2);
    expect(result.variants![0].id).toBe('wall-section-red');
    expect(result.variants![1].id).toBe('wall-section-blue');
  });

  it('infers size from layers when frontmatter omits it', () => {
    const md = `---
id: test-no-size
palette: village-premium
---
# Test

A test.

## Layers

### ground
| | | | | |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 |
`;
    const result = parseAssemblageMarkdown(md);
    expect(result.definition.width).toBe(5);
    expect(result.definition.height).toBe(4);
  });

  it('handles missing sections gracefully', () => {
    const md = `---
id: minimal
size: [2, 2]
palette: village-premium
---
# Minimal

A bare-bones assemblage with no layers.
`;
    const result = parseAssemblageMarkdown(md);
    expect(result.definition.id).toBe('minimal');
    expect(result.definition.layers).toEqual({});
    expect(result.definition.collision).toBeUndefined();
    expect(result.definition.visuals).toBeUndefined();
    expect(result.definition.objects).toBeUndefined();
    expect(result.definition.anchors).toBeUndefined();
  });
});
