import { SeededRandom } from '../seededRandom';

export type RoomType =
  | 'treasure'
  | 'combat'
  | 'puzzle'
  | 'trap'
  | 'shop'
  | 'rest'
  | 'boss'
  | 'secret';

export interface Room {
  type: RoomType;
  name: string;
  description: string;
  difficulty: number;
  connections: number;
  contents: string[];
}

const ROOM_NAMES: Record<RoomType, string[]> = {
  treasure: ['Vault', 'Treasury', 'Hoard Chamber', 'Riches Room', 'Chest Hall'],
  combat: ['Arena', 'Battle Hall', 'War Room', 'Combat Zone', 'Conflict Chamber'],
  puzzle: ['Riddle Room', 'Mechanism Hall', 'Logic Chamber', 'Enigma Room', 'Mystery Hall'],
  trap: ['Danger Zone', 'Peril Chamber', 'Snare Hall', 'Hazard Room', 'Death Trap'],
  shop: ['Merchant Corner', 'Trading Post', 'Market Hall', 'Vendor Room', 'Exchange'],
  rest: ['Safe Haven', 'Sanctuary', 'Rest Area', 'Peaceful Chamber', 'Recovery Room'],
  boss: ['Throne Room', 'Final Chamber', 'Lair', 'Domain', 'Stronghold'],
  secret: ['Hidden Room', 'Secret Chamber', 'Concealed Hall', 'Veiled Room', 'Mystery Cache'],
};

const ROOM_CONTENTS: Record<RoomType, string[]> = {
  treasure: ['Gold Coins', 'Jewels', 'Ancient Artifacts', 'Magic Items', 'Rare Materials'],
  combat: ['Enemies', 'Weapons', 'Armor Racks', 'Battle Scars', 'Training Dummies'],
  puzzle: [
    'Ancient Runes',
    'Mechanical Devices',
    'Magical Seals',
    'Cryptic Symbols',
    'Pressure Plates',
  ],
  trap: ['Spike Pits', 'Poison Darts', 'Falling Blocks', 'Fire Jets', 'Illusory Floors'],
  shop: ['Merchant', 'Goods', 'Trade Items', 'Price List', 'Exotic Wares'],
  rest: ['Beds', 'Food', 'Water', 'Healing Herbs', 'Comfortable Chairs'],
  boss: ['Powerful Enemy', 'Throne', 'Dark Altar', 'Command Center', 'Ancient Guardian'],
  secret: [
    'Hidden Treasure',
    'Legendary Item',
    'Ancient Knowledge',
    'Powerful Relic',
    'Secret Passage',
  ],
};

/**
 * Deterministic room generator
 */
export class RoomGenerator {
  private rng: SeededRandom;

  constructor(seed: string) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a single room
   */
  generateRoom(type?: RoomType): Room {
    const roomType =
      type ||
      this.rng.pick([
        'treasure',
        'combat',
        'puzzle',
        'trap',
        'shop',
        'rest',
        'boss',
        'secret',
      ] as RoomType[]);
    const name = this.rng.pick(ROOM_NAMES[roomType]);
    const difficulty = this.rng.randomInt(1, 10);
    const connections = this.rng.randomInt(1, 4);

    const contentCount = this.rng.randomInt(2, 5);
    const contents = this.rng.shuffle(ROOM_CONTENTS[roomType]).slice(0, contentCount);

    const description = this.generateRoomDescription(roomType, name, contents);

    return {
      type: roomType,
      name,
      description,
      difficulty,
      connections,
      contents,
    };
  }

  /**
   * Generate a dungeon layout with multiple rooms
   */
  generateDungeon(roomCount: number = 10): Room[] {
    const rooms: Room[] = [];

    // Ensure at least one of each important type
    const guaranteedTypes: RoomType[] = ['rest', 'shop', 'boss'];
    for (const type of guaranteedTypes) {
      rooms.push(this.generateRoom(type));
    }

    // Fill remaining rooms randomly
    for (let i = rooms.length; i < roomCount; i++) {
      rooms.push(this.generateRoom());
    }

    return this.rng.shuffle(rooms);
  }

  /**
   * Generate room description
   */
  private generateRoomDescription(type: RoomType, _name: string, contents: string[]): string {
    const descriptions: Record<RoomType, string> = {
      treasure: 'Glittering treasures line the walls of this chamber.',
      combat: 'The air is thick with tension and the smell of battle.',
      puzzle: 'Ancient mechanisms and cryptic symbols demand your attention.',
      trap: 'Danger lurks in every shadow of this treacherous room.',
      shop: "A merchant's wares are displayed invitingly.",
      rest: 'A peaceful sanctuary offers respite from your journey.',
      boss: 'An overwhelming presence fills this imposing chamber.',
      secret: 'Few have discovered this hidden place.',
    };

    const contentsText = contents.join(', ');
    return `${descriptions[type]} You see: ${contentsText}.`;
  }
}
