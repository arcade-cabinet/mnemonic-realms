'use client';

import { useState } from 'react';

interface SeedInputProps {
  onGenerate: (seed: string) => void;
  loading: boolean;
}

const adjectives = [
  'dark', 'ancient', 'mystic', 'bright', 'forgotten', 'holy', 'cursed', 'eternal',
  'frozen', 'burning', 'hidden', 'lost', 'sacred', 'twisted', 'wild', 'peaceful'
];

const nouns = [
  'forest', 'dungeon', 'temple', 'castle', 'ruins', 'mountain', 'valley', 'cave',
  'shrine', 'tower', 'realm', 'wasteland', 'sanctuary', 'crypt', 'fortress'
];

function generateRandomSeed(): string {
  const adj1 = adjectives[Math.floor(Math.random() * adjectives.length)];
  const adj2 = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj1} ${adj2} ${noun}`;
}

export default function SeedInput({ onGenerate, loading }: SeedInputProps) {
  const [seed, setSeed] = useState('dark ancient forest');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seed.trim()) {
      onGenerate(seed.trim());
    }
  };

  const handleRandom = () => {
    const randomSeed = generateRandomSeed();
    setSeed(randomSeed);
    onGenerate(randomSeed);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="Enter seed (e.g., 'dark ancient forest')"
          className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate World'}
        </button>
        <button
          type="button"
          onClick={handleRandom}
          disabled={loading}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Random Seed
        </button>
      </form>
    </div>
  );
}
