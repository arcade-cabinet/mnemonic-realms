'use client';

interface GeneratedContentProps {
  data: {
    seed: string;
    character: {
      name: string;
      class: string;
      alignment: string;
    };
    location: {
      place: string;
      terrain: string;
      difficulty: number;
    };
    dialogue: {
      text: string;
      personality: string;
    };
    microstory: {
      text: string;
    };
    loot: {
      gold: number;
      items: Array<{ name: string; rarity: string }>;
    };
    terrainMap: string[][];
  };
}

const alignmentColors: Record<string, string> = {
  light: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  dark: 'bg-purple-900 text-white border-purple-700',
  neutral: 'bg-gray-100 text-gray-800 border-gray-300',
};

const terrainColors: Record<string, string> = {
  plains: 'bg-green-500',
  forest: 'bg-green-700',
  mountain: 'bg-gray-500',
  desert: 'bg-yellow-600',
  swamp: 'bg-green-900',
  tundra: 'bg-blue-200',
  volcano: 'bg-red-600',
  ocean: 'bg-blue-500',
};

const rarityColors: Record<string, string> = {
  common: 'bg-gray-400',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-orange-500',
};

export default function GeneratedContent({ data }: GeneratedContentProps) {
  const alignmentColor = alignmentColors[data.character.alignment] || alignmentColors.neutral;

  return (
    <div className="space-y-6">
      <div className="text-center text-white mb-8">
        <h2 className="text-3xl font-bold">
          Generated from seed: &quot;{data.seed}&quot;
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Character Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">👤</span>
            <h3 className="text-2xl font-bold text-blue-900">Character</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold text-blue-700">Name:</span>{' '}
              <span className="text-blue-900">{data.character.name}</span>
            </p>
            <p className="text-lg">
              <span className="font-semibold text-blue-700">Class:</span>{' '}
              <span className="text-blue-900">{data.character.class}</span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <span className="font-semibold text-blue-700">Alignment:</span>{' '}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${alignmentColor}`}>
                {data.character.alignment}
              </span>
            </p>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🗺️</span>
            <h3 className="text-2xl font-bold text-green-900">Location</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold text-green-700">Place:</span>{' '}
              <span className="text-green-900">{data.location.place}</span>
            </p>
            <p className="text-lg">
              <span className="font-semibold text-green-700">Terrain:</span>{' '}
              <span className="text-green-900">{data.location.terrain}</span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <span className="font-semibold text-green-700">Difficulty:</span>{' '}
              <span className="text-green-900">
                ⭐ {data.location.difficulty}/5
              </span>
            </p>
          </div>
        </div>

        {/* Dialogue Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">💬</span>
            <h3 className="text-2xl font-bold text-purple-900">Dialogue</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg italic text-purple-800">
              &quot;{data.dialogue.text}&quot;
            </p>
            <p className="text-lg">
              <span className="font-semibold text-purple-700">Personality:</span>{' '}
              <span className="text-purple-900">{data.dialogue.personality}</span>
            </p>
          </div>
        </div>

        {/* Microstory Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">📜</span>
            <h3 className="text-2xl font-bold text-orange-900">Microstory</h3>
          </div>
          <p className="text-lg italic text-orange-800">
            {data.microstory.text}
          </p>
        </div>

        {/* Loot Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">💎</span>
            <h3 className="text-2xl font-bold text-yellow-900">Loot</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold text-yellow-700">Gold:</span>{' '}
              <span className="text-yellow-900">{data.loot.gold}g</span>
            </p>
            <p className="font-semibold text-yellow-700">Items:</p>
            <div className="space-y-1">
              {data.loot.items.map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-block px-3 py-1 rounded-full text-sm text-white mr-2 mb-2 ${
                    rarityColors[item.rarity.toLowerCase()] || rarityColors.common
                  }`}
                >
                  {item.rarity} {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Terrain Map Card */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🗺️</span>
            <h3 className="text-2xl font-bold text-teal-900">Terrain Map (10x10)</h3>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {data.terrainMap.map((row, y) =>
              row.map((terrain, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-6 h-6 rounded ${terrainColors[terrain] || terrainColors.plains}`}
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
