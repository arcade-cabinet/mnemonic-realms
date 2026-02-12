import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerState {
  id: string;
  name: string;
  class: string;
  alignment: 'light' | 'dark' | 'neutral';
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
}

export interface WorldState {
  seed: string;
  playTime: number;
}

export interface SaveGame {
  id: string;
  name: string;
  world: WorldState;
  player: PlayerState;
  timestamp: Date;
}

interface GameState {
  currentWorld: WorldState | null;
  currentPlayer: PlayerState | null;
  saves: SaveGame[];
  startNewGame: (seed: string) => void;
  saveGame: (name?: string) => void;
  loadGame: (saveId: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentWorld: null,
      currentPlayer: null,
      saves: [],
      
      startNewGame: (seed: string) => {
        set({
          currentWorld: { seed, playTime: 0 },
          currentPlayer: {
            id: crypto.randomUUID(),
            name: 'Hero',
            class: 'Warrior',
            alignment: 'neutral',
            level: 1,
            health: 100,
            maxHealth: 100,
            mana: 50,
            maxMana: 50,
          },
        });
      },
      
      saveGame: (name) => {
        const { currentWorld, currentPlayer, saves } = get();
        if (!currentWorld || !currentPlayer) return;
        
        const save: SaveGame = {
          id: crypto.randomUUID(),
          name: name || `Save ${new Date().toLocaleString()}`,
          world: currentWorld,
          player: currentPlayer,
          timestamp: new Date(),
        };
        
        set({ saves: [...saves, save] });
      },
      
      loadGame: (saveId) => {
        const save = get().saves.find(s => s.id === saveId);
        if (save) {
          set({
            currentWorld: save.world,
            currentPlayer: save.player,
          });
        }
      },
    }),
    {
      name: 'mnemonic-realms-game',
    }
  )
);
