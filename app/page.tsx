'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { Gamepad2, Play, Download, Settings as SettingsIcon } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { saves, startNewGame, loadGame } = useGameStore();
  const { setShowNewGameModal, setShowLoadGameModal, setShowSettingsModal } = useUIStore();
  const [seed, setSeed] = useState('');

  const handleNewGame = () => {
    if (seed.trim().split(/\s+/).length === 3) {
      startNewGame(seed.trim());
      router.push('/play');
    } else {
      alert('Please enter exactly 3 words: "adjective adjective noun"');
    }
  };

  const handleContinue = () => {
    if (saves.length > 0) {
      const lastSave = saves[saves.length - 1];
      loadGame(lastSave.id);
      router.push('/play');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Gamepad2 className="w-16 h-16 text-purple-400" />
            <h1 className="text-5xl font-bold text-white">Mnemonic Realms</h1>
          </div>
          <p className="text-purple-200 text-lg">Procedural RPG powered by seeds</p>
        </div>

        {/* Main Menu */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-2xl space-y-4">
          {/* New Game */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter seed (e.g. dark ancient forest)"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-300 border-2 border-purple-400 focus:border-purple-300 focus:outline-none"
            />
            <button
              onClick={handleNewGame}
              className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              New Game
            </button>
          </div>

          {/* Continue */}
          {saves.length > 0 && (
            <button
              onClick={handleContinue}
              className="w-full px-6 py-4 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Continue Game
            </button>
          )}

          {/* Load Game */}
          <button
            onClick={() => setShowLoadGameModal(true)}
            className="w-full px-6 py-4 bg-purple-800 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            Load Game
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3"
          >
            <SettingsIcon className="w-6 h-6" />
            Settings
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-purple-200 text-sm">
          <p>Enter a 3-word seed to generate your unique world</p>
          <p className="mt-2">Format: "adjective adjective noun"</p>
        </div>
      </div>
    </div>
  );
}
