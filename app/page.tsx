'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { Sword, Play, Download, Settings as SettingsIcon } from 'lucide-react';

import { LoadGameModal } from '@/components/LoadGameModal';
import { SettingsModal } from '@/components/SettingsModal';
import { GeneratedContentPreview } from '@/components/GeneratedContentPreview';

export default function LandingPage() {
  const router = useRouter();
  const [seed, setSeed] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Hydrate Zustand stores on mount to prevent SSR issues
  useEffect(() => {
    useGameStore.persist.rehydrate();
    setMounted(true);
  }, []);
  
  const { saves, startNewGame, loadGame } = useGameStore();
  const { setShowNewGameModal, setShowLoadGameModal, setShowSettingsModal } = useUIStore();

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
    <div className="min-h-screen bg-gradient-to-b from-[#1a1410] to-[#2d2520] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Sword className="w-16 h-16 text-[#b8860b]" />
            <h1 className="text-5xl font-bold text-[#d4af37]" style={{ fontFamily: '"Cinzel Decorative", serif', textShadow: '0 0 20px rgba(139, 31, 31, 0.6)' }}>
              Mnemonic Realms
            </h1>
          </div>
          <p className="text-[#d4a574] text-lg" style={{ fontFamily: '"Merriweather", serif' }}>
            A Sword & Sorcery Adventure Awaits
          </p>
        </div>

        {/* Main Menu - Stone/Leather texture */}
        <div className="bg-[#4a4540]/30 backdrop-blur-sm rounded-lg p-8 shadow-2xl space-y-4 border-2 border-[#b8860b]/30">
          {/* New Game */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your seed (e.g. dark ancient forest)"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#2d2520] text-[#f5f1e8] placeholder-[#6b5d4f] border-2 border-[#b8860b] focus:border-[#d4af37] focus:outline-none"
              style={{ fontFamily: '"Merriweather", serif' }}
            />
            <button
              onClick={handleNewGame}
              className="w-full px-6 py-4 bg-[#8b1f1f] hover:bg-[#7c1a1a] text-[#f5f1e8] rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 border-2 border-[#4a0e0e] shadow-lg"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              <Play className="w-6 h-6" />
              New Quest
            </button>
          </div>

          {/* Continue */}
          {saves.length > 0 && (
            <button
              onClick={handleContinue}
              className="w-full px-6 py-4 bg-[#2d5016] hover:bg-[#1f4d2a] text-[#f5f1e8] rounded-lg font-semibold text-lg transition-colors border-2 border-[#1a4023]"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              Continue Journey
            </button>
          )}

          {/* Load Game */}
          <button
            onClick={() => setShowLoadGameModal(true)}
            className="w-full px-6 py-4 bg-[#b8860b] hover:bg-[#a67508] text-[#1a1410] rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 border-2 border-[#704506]"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            <Download className="w-6 h-6" />
            Load Saga
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full px-6 py-4 bg-[#4a4540] hover:bg-[#5a524c] text-[#f5f1e8] rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 border-2 border-[#6b5d4f]"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            <SettingsIcon className="w-6 h-6" />
            Settings
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-[#d4a574] text-sm" style={{ fontFamily: '"Merriweather", serif' }}>
          <p>Speak the three words of power to forge your realm</p>
          <p className="mt-2 text-[#6b5d4f]">Format: "adjective adjective noun"</p>
        </div>

        {/* Generated Content Preview */}
        {mounted && <GeneratedContentPreview seed={seed} />}
      </div>

      {/* Modals */}
      <LoadGameModal />
      <SettingsModal />
    </div>
  );
}
