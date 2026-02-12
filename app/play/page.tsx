'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { ArrowLeft } from 'lucide-react';

export default function PlayPage() {
  const router = useRouter();
  const { currentWorld, currentPlayer } = useGameStore();

  if (!currentWorld || !currentPlayer) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Main Menu
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">{currentWorld.seed}</h2>
          <p className="text-sm text-gray-400">{currentPlayer.name} • Level {currentPlayer.level}</p>
        </div>
        <div className="w-24" />
      </div>

      {/* Game Canvas Placeholder */}
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-12 rounded-lg mb-6">
            <h3 className="text-3xl font-bold mb-2">Game World: {currentWorld.seed}</h3>
            <p className="text-lg">RPG-JS integration coming next...</p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Character</p>
              <p className="font-bold">{currentPlayer.name}</p>
              <p className="text-sm">{currentPlayer.class}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Health / Mana</p>
              <p className="font-bold">{currentPlayer.health}/{currentPlayer.maxHealth}</p>
              <p className="text-sm">{currentPlayer.mana}/{currentPlayer.maxMana}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
