/**
 * Everwick TMX Generator (US-007/008/009)
 *
 * Generates the Everwick TMX map using Backterria CC0 tiles.
 * 30x30 tile map with green meadow terrain, dirt paths, buildings,
 * memorial garden, and forest borders.
 *
 * Tileset GID offsets:
 *   backterria-overworld:     firstgid=1     (464 tiles)
 *   backterria-natural:       firstgid=465   (572 tiles)
 *   backterria-natural-props: firstgid=1037  (672 tiles)
 *   backterria-plants:        firstgid=1709  (760 tiles)
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const OUT = resolve(ROOT, 'main', 'server', 'maps', 'tmx', 'everwick.tmx');

const W = 30;
const H = 30;

// ── Tile GID Constants ──────────────────────────────────────────────

// Overworld tiles (firstgid=1, no offset)
const OW = {
  GRASS: 121, // solid green meadow fill
  GRASS_DARK: 120, // darker green / forest floor
  GRASS_FLOWER: 149, // green with small white flowers
  FLOWERS_RED: 154, // red/orange flower cluster
  OLIVE: 180, // solid olive (dense border)
  TREE_TOP: 150, // bush/shrub on grass (for variety)

  // Building tiles (from bottom rows of overworld sheet)
  // 2x2 building blocks (r12-13, various cols)
  HOUSE_A_TL: 368, // house with door
  HOUSE_A_TR: 369, // stone/roof
  HOUSE_A_BL: 397, // (olive — use for foundation/shadow)
  HOUSE_B_TL: 372, // grey stone house
  HOUSE_B_TR: 373, // grey stone house right
};

// Natural tiles (firstgid=465, offset=464)
const NAT_OFF = 464;
const NAT = {
  // 9-tile path set (dirt path)
  PATH_TL: 177 + NAT_OFF,
  PATH_T: 178 + NAT_OFF,
  PATH_TR: 179 + NAT_OFF,
  PATH_L: 199 + NAT_OFF,
  PATH_C: 200 + NAT_OFF,
  PATH_R: 201 + NAT_OFF,
  PATH_BL: 221 + NAT_OFF,
  PATH_B: 222 + NAT_OFF,
  PATH_BR: 223 + NAT_OFF,

  // Grass (for variety on ground layer)
  GRASS: 24 + NAT_OFF,
};

// ── Map Layout ──────────────────────────────────────────────────────
// 30x30 grid. Key zones:
//
// Forest borders: cols 0-7 and 23-29 (trees), rows 0-1 and 27-29
// Village area: cols 8-22, rows 2-26
//   - North lookout: rows 2-6
//   - Elder's quarter (NE): cols 18-22, rows 8-13
//   - Central square: cols 12-18, rows 13-17 (fountain at 15,15)
//   - Memorial garden (W): cols 8-12, rows 16-21
//   - Shops/inn (E): cols 18-22, rows 16-21
//   - South approach: cols 12-18, rows 22-26
// Gates: N(15,0), S(15,25), E(29,14), W(0,14)
// Player spawn: (15,15) = 480px, 480px

function makeGround(): number[][] {
  const grid: number[][] = Array.from({ length: H }, () => Array(W).fill(OW.GRASS));

  // Forest borders (olive/dense)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Top/bottom border rows
      if (y <= 1 || y >= 27) {
        grid[y][x] = OW.OLIVE;
      }
      // Left border (cols 0-7)
      else if (x <= 6) {
        grid[y][x] = OW.OLIVE;
      }
      // Right border (cols 24-29)
      else if (x >= 24) {
        grid[y][x] = OW.OLIVE;
      }
      // Transitional forest edge
      else if (x === 7 || x === 23) {
        grid[y][x] = OW.GRASS_DARK;
      }
    }
  }

  // Gate openings (clear forest for path)
  // North gate (col 14-16, rows 0-1)
  for (let x = 14; x <= 16; x++) {
    grid[0][x] = OW.GRASS;
    grid[1][x] = OW.GRASS;
  }
  // South gate (col 14-16, rows 27-29)
  for (let x = 14; x <= 16; x++) {
    for (let y = 25; y < H; y++) grid[y][x] = OW.GRASS;
  }
  // West gate (cols 0-7, row 13-15)
  for (let y = 13; y <= 15; y++) {
    for (let x = 0; x <= 7; x++) grid[y][x] = OW.GRASS;
  }
  // East gate (cols 23-29, row 13-15)
  for (let y = 13; y <= 15; y++) {
    for (let x = 23; x < W; x++) grid[y][x] = OW.GRASS;
  }

  // Memorial garden (8-12, 16-21) — flower patches
  for (let y = 17; y <= 20; y++) {
    for (let x = 9; x <= 11; x++) {
      grid[y][x] = OW.GRASS_FLOWER;
    }
  }
  // Flower accents in garden
  grid[18][10] = OW.FLOWERS_RED;
  grid[19][10] = OW.FLOWERS_RED;

  // North lookout area — slight elevation marker with darker grass
  for (let x = 10; x <= 14; x++) {
    grid[2][x] = OW.GRASS_DARK;
    grid[3][x] = OW.GRASS_FLOWER;
  }

  return grid;
}

function makeGround2(): number[][] {
  // Paths overlay (0 = transparent, path tiles where roads go)
  const grid: number[][] = Array.from({ length: H }, () => Array(W).fill(0));

  // Main north-south road (col 15, rows 2-26)
  for (let y = 1; y <= 26; y++) {
    grid[y][14] = NAT.PATH_L;
    grid[y][15] = NAT.PATH_C;
    grid[y][16] = NAT.PATH_R;
  }

  // East-west crossroad (row 14, cols 1-28)
  for (let x = 1; x <= 28; x++) {
    if (grid[13][x] === 0) grid[13][x] = NAT.PATH_T;
    if (grid[14][x] === 0) grid[14][x] = NAT.PATH_C;
    if (grid[15][x] === 0) grid[15][x] = NAT.PATH_B;
  }

  // Intersections — replace with proper cross tiles
  grid[13][14] = NAT.PATH_TL;
  grid[13][15] = NAT.PATH_T;
  grid[13][16] = NAT.PATH_TR;
  grid[15][14] = NAT.PATH_BL;
  grid[15][15] = NAT.PATH_B;
  grid[15][16] = NAT.PATH_BR;

  // Path edges at map boundaries
  grid[0][14] = NAT.PATH_L;
  grid[0][15] = NAT.PATH_C;
  grid[0][16] = NAT.PATH_R;

  // Side paths to memorial garden (cols 8-13, row 18)
  for (let x = 8; x <= 13; x++) {
    grid[18][x] = NAT.PATH_C;
  }
  grid[17][8] = NAT.PATH_TL;
  grid[17][13] = NAT.PATH_TR;
  grid[19][8] = NAT.PATH_BL;
  grid[19][13] = NAT.PATH_BR;

  // Side paths to shops (cols 17-22, row 18)
  for (let x = 17; x <= 22; x++) {
    grid[18][x] = NAT.PATH_C;
  }

  return grid;
}

function makeObjects(): number[][] {
  // Buildings, trees, decorative objects
  const grid: number[][] = Array.from({ length: H }, () => Array(W).fill(0));

  // Forest border trees (checkerboard pattern in border zone)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (y <= 1 || y >= 27) {
        // Top/bottom: dense trees except gate openings
        if (!(x >= 14 && x <= 16)) {
          grid[y][x] = OW.TREE_TOP;
        }
      } else if (x <= 5) {
        // Left forest: alternating trees
        if ((x + y) % 3 === 0) grid[y][x] = OW.TREE_TOP;
      } else if (x >= 25) {
        // Right forest: alternating trees
        if ((x + y) % 3 === 0) grid[y][x] = OW.TREE_TOP;
      }
    }
  }

  // Clear trees from gate paths
  for (let y = 13; y <= 15; y++) {
    for (let x = 0; x < W; x++) grid[y][x] = 0;
  }

  // ── Buildings ──

  // Elder's house (NE area, 2x2 at cols 18-19, rows 10-11)
  grid[10][18] = OW.HOUSE_B_TL;
  grid[10][19] = OW.HOUSE_B_TR;
  grid[11][18] = OW.HOUSE_A_TL;
  grid[11][19] = OW.HOUSE_A_TR;

  // Shop (Khali's general store, cols 18-19, rows 16-17)
  grid[16][18] = OW.HOUSE_B_TL;
  grid[16][19] = OW.HOUSE_B_TR;
  grid[17][18] = OW.HOUSE_A_TL;
  grid[17][19] = OW.HOUSE_A_TR;

  // Smithy (Hark's forge, cols 18-19, rows 19-20)
  grid[19][18] = OW.HOUSE_A_TL;
  grid[19][19] = OW.HOUSE_A_TR;
  grid[20][18] = OW.HOUSE_B_TL;
  grid[20][19] = OW.HOUSE_B_TR;

  // Inn (Nyro's, cols 20-21, rows 14-15)
  grid[14][20] = OW.HOUSE_B_TL;
  grid[14][21] = OW.HOUSE_B_TR;
  grid[15][20] = OW.HOUSE_A_TL;
  grid[15][21] = OW.HOUSE_A_TR;

  // Mentor's workshop (Hana's, cols 8-9, rows 19-20)
  grid[19][8] = OW.HOUSE_B_TL;
  grid[19][9] = OW.HOUSE_B_TR;
  grid[20][8] = OW.HOUSE_A_TL;
  grid[20][9] = OW.HOUSE_A_TR;

  // Quest board marker (col 8, row 14) — just a dark accent
  grid[14][8] = OW.GRASS_DARK;

  // Telescope (col 12, row 3) — a dark accent
  grid[3][12] = OW.GRASS_DARK;

  // Memorial garden resonance stones area (col 10, row 17)
  grid[17][10] = OW.FLOWERS_RED;

  return grid;
}

function makeCollision(): number[][] {
  // 1 = solid/collision, 0 = passable
  const grid: number[][] = Array.from({ length: H }, () => Array(W).fill(0));

  // Forest borders = collision
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (y <= 1 || y >= 27) grid[y][x] = 1;
      else if (x <= 6) grid[y][x] = 1;
      else if (x >= 24) grid[y][x] = 1;
    }
  }

  // Gate openings (clear collision)
  // North gate
  for (let x = 14; x <= 16; x++) {
    grid[0][x] = 0;
    grid[1][x] = 0;
  }
  // South gate
  for (let x = 14; x <= 16; x++) {
    for (let y = 25; y < H; y++) grid[y][x] = 0;
  }
  // West gate
  for (let y = 13; y <= 15; y++) {
    for (let x = 0; x <= 7; x++) grid[y][x] = 0;
  }
  // East gate
  for (let y = 13; y <= 15; y++) {
    for (let x = 23; x < W; x++) grid[y][x] = 0;
  }

  // Building collision (all buildings are 2x2)
  const buildings = [
    [10, 18],
    [10, 19],
    [11, 18],
    [11, 19], // Elder's house
    [16, 18],
    [16, 19],
    [17, 18],
    [17, 19], // Shop
    [19, 18],
    [19, 19],
    [20, 18],
    [20, 19], // Smithy
    [14, 20],
    [14, 21],
    [15, 20],
    [15, 21], // Inn
    [19, 8],
    [19, 9],
    [20, 8],
    [20, 9], // Workshop
  ];
  for (const [y, x] of buildings) {
    grid[y][x] = 1;
  }

  return grid;
}

function layerToCSV(grid: number[][]): string {
  return grid.map((row) => row.join(',')).join(',\n');
}

// ── Event Objects (preserved from existing TMX) ─────────────────────

const EVENTS_XML = `   <object id="1" name="Artun" type="spawn" x="608" y="352" width="32" height="32">
    <properties>
     <property name="graphic" value="npc_artun"/>
     <property name="id" value="Artun"/>
     <property name="movement" value="Patrols: Elder's House to Lookout Hill (12, 3) on 60s cycle"/>
    </properties>
   </object>
   <object id="2" name="Hana" type="spawn" x="288" y="608" width="32" height="32">
    <properties>
     <property name="graphic" value="npc_hana"/>
     <property name="id" value="Hana"/>
     <property name="movement" value="Static at workshop until MQ-02 complete; roams village after"/>
    </properties>
   </object>
   <object id="3" name="Khali" type="spawn" x="608" y="544" width="32" height="32">
    <properties>
     <property name="graphic" value="npc_khali"/>
     <property name="id" value="Khali"/>
     <property name="movement" value="Static behind shop counter"/>
    </properties>
   </object>
   <object id="4" name="Hark" type="spawn" x="608" y="608" width="32" height="32">
    <properties>
     <property name="graphic" value="npc_hark"/>
     <property name="id" value="Hark"/>
     <property name="movement" value="Static at anvil"/>
    </properties>
   </object>
   <object id="5" name="Nyro" type="spawn" x="672" y="480" width="32" height="32">
    <properties>
     <property name="graphic" value="npc_nyro"/>
     <property name="id" value="Nyro"/>
     <property name="movement" value="Static behind inn bar"/>
    </properties>
   </object>
   <object id="6" name="Villager A" type="spawn" x="448" y="480" width="32" height="32">
    <properties>
     <property name="graphic" value="npc_villager_m1"/>
     <property name="id" value="Villager A"/>
     <property name="movement" value="Wanders Central Square (12-17, 14-19)"/>
    </properties>
   </object>
   <object id="7" name="Villager B" type="spawn" x="512" y="512" width="32" height="32">
    <properties>
     <property name="graphic" value="npc_villager_f1"/>
     <property name="id" value="Villager B"/>
     <property name="movement" value="Wanders Central Square"/>
    </properties>
   </object>
   <object id="8" name="Villager C" type="spawn" x="320" y="704" width="32" height="32">
    <properties>
     <property name="graphic" value="npc_villager_m2"/>
     <property name="id" value="Villager C"/>
     <property name="movement" value="Patrols South Gate road"/>
    </properties>
   </object>
   <object id="9" name="RS-VH-01" type="resonanceStone" x="448" y="480" width="32" height="32">
    <properties>
     <property name="fragmentType" value="joy/neutral/1"/>
     <property name="id" value="RS-VH-01"/>
     <property name="notes" value="Central Square fountain; glows at Normal+ vibrancy"/>
    </properties>
   </object>
   <object id="10" name="RS-VH-02" type="resonanceStone" x="288" y="512" width="32" height="32">
    <properties>
     <property name="fragmentType" value="calm/earth/1"/>
     <property name="id" value="RS-VH-02"/>
     <property name="notes" value="Memorial Garden left stone; MQ-02 tutorial target"/>
    </properties>
   </object>
   <object id="11" name="RS-VH-03" type="resonanceStone" x="320" y="544" width="32" height="32">
    <properties>
     <property name="fragmentType" value="joy/light/1"/>
     <property name="id" value="RS-VH-03"/>
     <property name="notes" value="Memorial Garden center stone; MQ-02 tutorial target"/>
    </properties>
   </object>
   <object id="12" name="RS-VH-04" type="resonanceStone" x="352" y="512" width="32" height="32">
    <properties>
     <property name="fragmentType" value="sorrow/neutral/1"/>
     <property name="id" value="RS-VH-04"/>
     <property name="notes" value="Memorial Garden right stone; SQ-01 broadcast target"/>
    </properties>
   </object>
   <object id="13" name="RS-VH-05" type="resonanceStone" x="672" y="480" width="32" height="32">
    <properties>
     <property name="fragmentType" value="calm/neutral/2"/>
     <property name="id" value="RS-VH-05"/>
     <property name="notes" value="Behind inn fireplace; revealed after SQ-12 dream 5"/>
    </properties>
   </object>
   <object id="14" name="CH-VH-01" type="chest" x="416" y="96" width="32" height="32">
    <properties>
     <property name="condition" value="always available"/>
     <property name="contents" value="Minor Potion (C-HP-01) x2"/>
     <property name="id" value="CH-VH-01"/>
    </properties>
   </object>
   <object id="15" name="CH-VH-02" type="chest" x="288" y="352" width="32" height="32">
    <properties>
     <property name="condition" value="after MQ-01"/>
     <property name="contents" value="Mana Drop (C-SP-01) x2"/>
     <property name="id" value="CH-VH-02"/>
    </properties>
   </object>
   <object id="16" name="EV-VH-001" type="event" x="608" y="352" width="32" height="32">
    <properties>
     <property name="condition" value="MQ-01"/>
     <property name="description" value="Artun intro dialogue; gives Architect Signet direction"/>
     <property name="id" value="EV-VH-001"/>
     <property name="linkedQuest" value="MQ-01"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="17" name="EV-VH-002" type="event" x="288" y="608" width="32" height="32">
    <properties>
     <property name="condition" value="MQ-01"/>
     <property name="description" value="Hana gives Architect Signet (K-01); teaches memory ops"/>
     <property name="id" value="EV-VH-002"/>
     <property name="linkedQuest" value="MQ-01, MQ-02"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="18" name="EV-VH-003" type="event" x="320" y="544" width="32" height="32">
    <properties>
     <property name="condition" value="MQ-02"/>
     <property name="description" value="Memorial Garden Resonance Stone; first fragment collection (MF-01)"/>
     <property name="id" value="EV-VH-003"/>
     <property name="linkedQuest" value="MQ-02"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="19" name="EV-VH-004" type="event" x="320" y="544" width="32" height="32">
    <properties>
     <property name="condition" value="MQ-02"/>
     <property name="description" value="Remix Table tutorial; broadcast tutorial"/>
     <property name="id" value="EV-VH-004"/>
     <property name="linkedQuest" value="MQ-02"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="20" name="EV-VH-005" type="event" x="608" y="544" width="32" height="32">
    <properties>
     <property name="condition" value="always"/>
     <property name="description" value="Khali shop interface + SQ-01 dialogue trigger"/>
     <property name="id" value="EV-VH-005"/>
     <property name="linkedQuest" value="SQ-01"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="21" name="EV-VH-006" type="event" x="608" y="608" width="32" height="32">
    <properties>
     <property name="condition" value="always"/>
     <property name="description" value="Hark shop interface + SQ-11 trigger (vibrancy 70+)"/>
     <property name="id" value="EV-VH-006"/>
     <property name="linkedQuest" value="SQ-11"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="22" name="EV-VH-007" type="event" x="672" y="480" width="32" height="32">
    <properties>
     <property name="condition" value="always"/>
     <property name="description" value="Nyro inn: rest + dream sequence trigger"/>
     <property name="id" value="EV-VH-007"/>
     <property name="linkedQuest" value="SQ-12"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="23" name="EV-VH-008" type="event" x="256" y="448" width="32" height="32">
    <properties>
     <property name="condition" value="MQ-03+"/>
     <property name="description" value="Quest Board: displays available side quests"/>
     <property name="id" value="EV-VH-008"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="24" name="EV-VH-009" type="event" x="480" y="800" width="32" height="32">
    <properties>
     <property name="condition" value="always"/>
     <property name="destinationMap" value="heartfield"/>
     <property name="destinationTile" value="15,0"/>
     <property name="description" value="South Gate transition to Heartfield (15, 0)"/>
     <property name="id" value="EV-VH-009"/>
     <property name="trigger" value="touch"/>
    </properties>
   </object>
   <object id="25" name="EV-VH-010" type="event" x="928" y="448" width="32" height="32">
    <properties>
     <property name="condition" value="always"/>
     <property name="destinationMap" value="ambergrove"/>
     <property name="destinationTile" value="0,20"/>
     <property name="description" value="East Gate transition to Ambergrove (0, 20)"/>
     <property name="id" value="EV-VH-010"/>
     <property name="trigger" value="touch"/>
    </properties>
   </object>
   <object id="26" name="EV-VH-011" type="event" x="0" y="448" width="32" height="32">
    <properties>
     <property name="condition" value="always"/>
     <property name="destinationMap" value="millbrook"/>
     <property name="destinationTile" value="39,20"/>
     <property name="description" value="West Gate transition to Millbrook (39, 20)"/>
     <property name="id" value="EV-VH-011"/>
     <property name="trigger" value="touch"/>
    </properties>
   </object>
   <object id="27" name="EV-VH-012" type="event" x="480" y="0" width="32" height="32">
    <properties>
     <property name="condition" value="MQ-04+"/>
     <property name="destinationMap" value="sunridge"/>
     <property name="destinationTile" value="20,39"/>
     <property name="description" value="North Gate transition to Sunridge (20, 39); locked until Act II"/>
     <property name="id" value="EV-VH-012"/>
     <property name="trigger" value="touch"/>
    </properties>
   </object>
   <object id="28" name="EV-VH-013" type="event" x="384" y="96" width="32" height="32">
    <properties>
     <property name="condition" value="always"/>
     <property name="description" value="Artun telescope: narrative lookout over Settled Lands"/>
     <property name="id" value="EV-VH-013"/>
     <property name="trigger" value="action"/>
    </properties>
   </object>
   <object id="29" name="EV-VH-014" type="event" x="256" y="544" width="32" height="32">
    <properties>
     <property name="condition" value="MQ-05+"/>
     <property name="description" value="Hidden Depths entrance under Memorial Garden to Depths L1"/>
     <property name="id" value="EV-VH-014"/>
     <property name="linkedQuest" value="SQ-10"/>
     <property name="trigger" value="touch"/>
    </properties>
   </object>
   <object id="30" name="EV-VH-015" type="event" x="448" y="480" width="32" height="32">
    <properties>
     <property name="condition" value="always"/>
     <property name="description" value="Fountain vibrancy check: particle effects scale with zone vibrancy"/>
     <property name="id" value="EV-VH-015"/>
     <property name="trigger" value="parallel"/>
    </properties>
   </object>
   <object id="31" name="EV-VH-016" type="event" x="0" y="0" width="32" height="32">
    <properties>
     <property name="condition" value="MQ-01"/>
     <property name="description" value="Opening cutscene trigger on first map load"/>
     <property name="id" value="EV-VH-016"/>
     <property name="linkedQuest" value="MQ-01"/>
     <property name="trigger" value="auto"/>
    </properties>
   </object>`;

// ── Generate TMX ────────────────────────────────────────────────────

function generateTMX(): string {
  const ground = makeGround();
  const ground2 = makeGround2();
  const objects = makeObjects();
  const collision = makeCollision();
  // objects_upper is empty for now (used for rooftops that render above player)
  const objectsUpper: number[][] = Array.from({ length: H }, () => Array(W).fill(0));

  return `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.10" tiledversion="1.11.2" orientation="orthogonal" renderorder="right-down" width="${W}" height="${H}" tilewidth="32" tileheight="32" infinite="0" nextlayerid="7" nextobjectid="100">
 <properties>
  <property name="category" value="overworld"/>
  <property name="mapName" value="Everwick"/>
  <property name="vibrancy" type="int" value="60"/>
 </properties>
 <tileset firstgid="1" source="backterria-overworld.tsx"/>
 <tileset firstgid="465" source="backterria-natural.tsx"/>
 <tileset firstgid="1037" source="backterria-natural-props.tsx"/>
 <tileset firstgid="1709" source="backterria-plants.tsx"/>
 <layer id="1" name="ground" width="${W}" height="${H}">
  <data encoding="csv">
${layerToCSV(ground)}
  </data>
 </layer>
 <layer id="2" name="ground2" width="${W}" height="${H}">
  <data encoding="csv">
${layerToCSV(ground2)}
  </data>
 </layer>
 <layer id="3" name="objects" width="${W}" height="${H}">
  <data encoding="csv">
${layerToCSV(objects)}
  </data>
 </layer>
 <layer id="4" name="objects_upper" width="${W}" height="${H}">
  <data encoding="csv">
${layerToCSV(objectsUpper)}
  </data>
 </layer>
 <layer id="5" name="collision" width="${W}" height="${H}">
  <data encoding="csv">
${layerToCSV(collision)}
  </data>
 </layer>
 <objectgroup draworder="index" id="7" name="events">
${EVENTS_XML}
 </objectgroup>
</map>`;
}

// ── Main ────────────────────────────────────────────────────────────

const tmx = generateTMX();
writeFileSync(OUT, tmx, 'utf-8');
console.log(`Everwick TMX generated: ${OUT}`);
console.log(`  Size: ${W}x${H} tiles (${W * 32}x${H * 32}px)`);
console.log(
  '  Tilesets: backterria-overworld, backterria-natural, backterria-natural-props, backterria-plants',
);
console.log('  Layers: ground, ground2, objects, objects_upper, collision');
console.log('  Events: 31 objects (NPCs, resonance stones, chests, gates, events)');
