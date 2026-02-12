'use client';

import { useEffect, useState } from 'react';
import { ProceduralWorld } from '@/lib/ecs/world';
import { Sword, MapPin, MessageCircle, Scroll, Gem, Map } from 'lucide-react';

interface GeneratedContent {
  character: {
    name: string;
    class: string;
    alignment: string;
    stats: {
      health: number;
      mana: number;
      strength: number;
      intelligence: number;
      dexterity: number;
    };
  };
  location: {
    name: string;
    terrain: string;
    difficulty: number;
  };
  dialogue: {
    greeting: string;
    personality: string;
  };
  microstory: {
    quest: string;
    backstory: string;
  };
  loot: {
    gold: number;
    items: string[];
  };
  terrainMap: string[][];
}

interface Props {
  seed: string;
  onGenerate?: () => void;
}

export function GeneratedContentPreview({ seed, onGenerate }: Props) {
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seed || seed.trim().split(/\s+/).length !== 3) {
      setContent(null);
      return;
    }

    generateContent();
  }, [seed]);

  const generateContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create procedural world
      const world = new ProceduralWorld();
      
      // Generate character
      const charId = world.createCharacter(seed);
      world.update();
      const character = world.exportEntity(charId);

      // Generate terrain for location (use center tile)
      const centerTerrainId = world.createTerrain(`${seed}-center`, 5, 5);
      world.update();
      const centerTerrain = world.exportEntity(centerTerrainId);

      // Generate terrain map (10x10)
      const terrainMap: string[][] = [];
      for (let y = 0; y < 10; y++) {
        const row: string[] = [];
        for (let x = 0; x < 10; x++) {
          const terrainId = world.createTerrain(`${seed}-${x}-${y}`, x, y);
          world.update();
          const terrain = world.exportEntity(terrainId);
          const terrainType = (terrain?.Terrain as any)?.type || 'plains';
          row.push(terrainType);
        }
        terrainMap.push(row);
      }

      // Use character name as location name
      const locationName = `${(character?.Name as any)?.value}'s Realm` || 'Unknown Land';

      setContent({
        character: {
          name: (character?.Name as any)?.value || 'Unknown Hero',
          class: (character?.CharacterClass as any)?.className || 'Adventurer',
          alignment: (character?.Alignment as any)?.type || 'neutral',
          stats: {
            health: 100,
            mana: 50,
            strength: 10,
            intelligence: 10,
            dexterity: 10,
          },
        },
        location: {
          name: locationName,
          terrain: (centerTerrain?.Terrain as any)?.type || 'plains',
          difficulty: (centerTerrain?.Terrain as any)?.difficulty || 1,
        },
        dialogue: {
          greeting: (character?.Dialogue as any)?.greeting || 'Greetings, traveler.',
          personality: (character?.Personality as any)?.traits?.join(', ') || 'mysterious',
        },
        microstory: {
          quest: (character?.Backstory as any)?.questHook || 'A quest awaits in the shadows.',
          backstory: (character?.Backstory as any)?.origin || 'Their past is shrouded in mystery.',
        },
        loot: {
          gold: Math.floor(Math.random() * 200) + 50,
          items: ['Iron Sword', 'Health Potion', 'Leather Armor'],
        },
        terrainMap,
      });

      onGenerate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!seed || seed.trim().split(/\s+/).length !== 3) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-8 p-8 bg-gradient-to-br from-stone-900/80 to-stone-800/80 rounded-lg border-2 border-amber-700/50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mb-4"></div>
          <p className="text-amber-200 font-serif">Forging your destiny from the words of power...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-8 bg-gradient-to-br from-red-900/50 to-red-800/50 rounded-lg border-2 border-red-700/50">
        <p className="text-red-200 font-serif text-center">{error}</p>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case 'light': return 'text-yellow-400';
      case 'dark': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getTerrainColor = (terrain: string) => {
    const colors: Record<string, string> = {
      plains: 'bg-green-600',
      forest: 'bg-green-800',
      mountain: 'bg-gray-600',
      desert: 'bg-yellow-700',
      swamp: 'bg-green-900',
      tundra: 'bg-blue-200',
      volcano: 'bg-red-700',
      ocean: 'bg-blue-600',
    };
    return colors[terrain] || 'bg-gray-500';
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-amber-200 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
        Generated from seed: "{seed}"
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Character */}
        <div className="bg-gradient-to-br from-stone-900/90 to-stone-800/90 rounded-lg p-6 border-2 border-amber-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Sword className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>Character</h3>
          </div>
          <div className="space-y-2 text-stone-300 font-serif">
            <p><span className="text-amber-400">Name:</span> {content.character.name}</p>
            <p><span className="text-amber-400">Class:</span> {content.character.class}</p>
            <p>
              <span className="text-amber-400">Alignment:</span>{' '}
              <span className={getAlignmentColor(content.character.alignment)}>
                {content.character.alignment}
              </span>
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gradient-to-br from-stone-900/90 to-stone-800/90 rounded-lg p-6 border-2 border-amber-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>Location</h3>
          </div>
          <div className="space-y-2 text-stone-300 font-serif">
            <p><span className="text-amber-400">Place:</span> {content.location.name}</p>
            <p><span className="text-amber-400">Terrain:</span> {content.location.terrain}</p>
            <p><span className="text-amber-400">Difficulty:</span> {'⭐'.repeat(content.location.difficulty)}</p>
          </div>
        </div>

        {/* Dialogue */}
        <div className="bg-gradient-to-br from-stone-900/90 to-stone-800/90 rounded-lg p-6 border-2 border-amber-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>Dialogue</h3>
          </div>
          <div className="space-y-2 text-stone-300 font-serif">
            <p className="italic text-blue-300">"{content.dialogue.greeting}"</p>
            <p><span className="text-amber-400">Personality:</span> {content.dialogue.personality}</p>
          </div>
        </div>

        {/* Microstory */}
        <div className="bg-gradient-to-br from-stone-900/90 to-stone-800/90 rounded-lg p-6 border-2 border-amber-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Scroll className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>Microstory</h3>
          </div>
          <div className="space-y-2 text-stone-300 font-serif text-sm">
            <p className="italic">{content.microstory.backstory}</p>
          </div>
        </div>

        {/* Loot */}
        <div className="bg-gradient-to-br from-stone-900/90 to-stone-800/90 rounded-lg p-6 border-2 border-amber-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Gem className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>Loot</h3>
          </div>
          <div className="space-y-2 text-stone-300 font-serif">
            <p><span className="text-amber-400">Gold:</span> {content.loot.gold}g</p>
            <div>
              <span className="text-amber-400">Items:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {content.loot.items.slice(0, 3).map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-600/30 rounded text-xs border border-purple-500/50">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Terrain Map */}
        <div className="bg-gradient-to-br from-stone-900/90 to-stone-800/90 rounded-lg p-6 border-2 border-amber-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>Terrain Map</h3>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {content.terrainMap.map((row, y) =>
              row.map((terrain, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-4 h-4 ${getTerrainColor(terrain)} rounded-sm`}
                  title={terrain}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
