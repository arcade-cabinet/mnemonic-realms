'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/stores/gameStore';
import { ArrowLeft, Info } from 'lucide-react';
import { GameCanvas } from '@/components/GameCanvas';
import { GameHUD } from '@/components/GameHUD';
import { useState } from 'react';

export default function PlayPage() {
  const router = useRouter();
  const { currentWorld, currentPlayer } = useGameStore();
  const [showControls, setShowControls] = useState(true);

  if (!currentWorld || !currentPlayer) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1410] to-[#2d2520]">
      {/* Top Bar with Medieval Styling */}
      <div className="bg-gradient-to-r from-[#1a1410] to-[#2d2520] border-b-2 border-[#b8860b] p-4 flex items-center justify-between shadow-lg">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#8b1f1f] to-[#6b1515] hover:from-[#a52525] hover:to-[#8b1f1f] text-[#d4af37] border-2 border-[#b8860b] rounded-lg transition-all duration-200 font-['Cinzel'] shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Hall
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-['Cinzel'] font-bold text-[#d4af37] drop-shadow-lg">
            {currentWorld.seed}
          </h2>
          <p className="text-sm text-[#d4a574]">{currentPlayer.name} • Level {currentPlayer.level}</p>
        </div>
        <button
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#1f4d2a] to-[#163a1f] hover:from-[#2a6535] hover:to-[#1f4d2a] text-[#d4af37] border-2 border-[#b8860b] rounded-lg transition-all duration-200 shadow-lg"
        >
          <Info className="w-4 h-4" />
          {showControls ? 'Hide' : 'Show'} Controls
        </button>
      </div>

      {/* Game Area */}
      <div className="flex items-center justify-center p-8 relative">
        <div className="relative">
          {/* Game Canvas */}
          <GameCanvas seed={currentWorld.seed} />
          
          {/* HUD Overlay */}
          <GameHUD player={currentPlayer} seed={currentWorld.seed} />

          {/* Controls Info */}
          {showControls && (
            <div className="absolute top-4 right-4 bg-gradient-to-br from-[#1a1410]/95 to-[#2d2520]/95 border-2 border-[#b8860b] rounded-lg p-4 shadow-2xl min-w-[220px]">
              <h3 className="text-[#d4af37] font-['Cinzel'] font-bold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Controls
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#d4a574]">
                  <span>Move Up:</span>
                  <kbd className="px-2 py-1 bg-[#1a1410] border border-[#b8860b]/50 rounded text-[#f5f1e8]">W</kbd>
                </div>
                <div className="flex items-center justify-between text-[#d4a574]">
                  <span>Move Left:</span>
                  <kbd className="px-2 py-1 bg-[#1a1410] border border-[#b8860b]/50 rounded text-[#f5f1e8]">A</kbd>
                </div>
                <div className="flex items-center justify-between text-[#d4a574]">
                  <span>Move Down:</span>
                  <kbd className="px-2 py-1 bg-[#1a1410] border border-[#b8860b]/50 rounded text-[#f5f1e8]">S</kbd>
                </div>
                <div className="flex items-center justify-between text-[#d4a574]">
                  <span>Move Right:</span>
                  <kbd className="px-2 py-1 bg-[#1a1410] border border-[#b8860b]/50 rounded text-[#f5f1e8]">D</kbd>
                </div>
                <div className="pt-2 border-t border-[#b8860b]/30">
                  <p className="text-xs text-[#d4a574] italic">Arrow keys also work</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1a1410]/90 to-[#2d2520]/90 border border-[#b8860b] rounded-lg px-6 py-2 shadow-lg">
        <p className="text-[#d4a574] text-sm text-center">
          <span className="text-[#d4af37] font-['Cinzel']">Adventure awaits</span> • Use WASD or arrows to explore the realm
        </p>
      </div>
    </div>
  );
}
