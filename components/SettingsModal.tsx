'use client';

import { useUIStore } from '@/lib/stores/uiStore';
import { Modal } from './Modal';
import { Volume2, VolumeX, Monitor, Keyboard } from 'lucide-react';

export function SettingsModal() {
  const { showSettingsModal, setShowSettingsModal } = useUIStore();

  return (
    <Modal
      isOpen={showSettingsModal}
      onClose={() => setShowSettingsModal(false)}
      title="Settings & Preferences"
    >
      <div className="space-y-6">
        {/* Audio Settings */}
        <div>
          <h3
            className="text-lg font-bold text-[#d4af37] mb-3 flex items-center gap-2"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            <Volume2 className="w-5 h-5" />
            Audio
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1a1410]/50 rounded-lg border border-[#b8860b]/30">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Master Volume
              </span>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="70"
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1410]/50 rounded-lg border border-[#b8860b]/30">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Music
              </span>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="60"
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1410]/50 rounded-lg border border-[#b8860b]/30">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Sound Effects
              </span>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="80"
                className="w-32"
              />
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div>
          <h3
            className="text-lg font-bold text-[#d4af37] mb-3 flex items-center gap-2"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            <Monitor className="w-5 h-5" />
            Display
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1a1410]/50 rounded-lg border border-[#b8860b]/30">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Fullscreen
              </span>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-full h-full bg-[#4a4540] peer-checked:bg-[#2d5016] rounded-full peer transition-colors cursor-pointer"></div>
                <div className="absolute top-1 left-1 bg-[#f5f1e8] w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1410]/50 rounded-lg border border-[#b8860b]/30">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Show FPS
              </span>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-full h-full bg-[#4a4540] peer-checked:bg-[#2d5016] rounded-full peer transition-colors cursor-pointer"></div>
                <div className="absolute top-1 left-1 bg-[#f5f1e8] w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div>
          <h3
            className="text-lg font-bold text-[#d4af37] mb-3 flex items-center gap-2"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            <Keyboard className="w-5 h-5" />
            Controls
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-[#1a1410]/50 rounded border border-[#b8860b]/20">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Move Up
              </span>
              <kbd className="px-2 py-1 bg-[#4a4540] text-[#f5f1e8] rounded border border-[#6b5d4f] font-mono text-xs">
                W / ↑
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#1a1410]/50 rounded border border-[#b8860b]/20">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Move Down
              </span>
              <kbd className="px-2 py-1 bg-[#4a4540] text-[#f5f1e8] rounded border border-[#6b5d4f] font-mono text-xs">
                S / ↓
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#1a1410]/50 rounded border border-[#b8860b]/20">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Move Left
              </span>
              <kbd className="px-2 py-1 bg-[#4a4540] text-[#f5f1e8] rounded border border-[#6b5d4f] font-mono text-xs">
                A / ←
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#1a1410]/50 rounded border border-[#b8860b]/20">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Move Right
              </span>
              <kbd className="px-2 py-1 bg-[#4a4540] text-[#f5f1e8] rounded border border-[#6b5d4f] font-mono text-xs">
                D / →
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#1a1410]/50 rounded border border-[#b8860b]/20">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Interact
              </span>
              <kbd className="px-2 py-1 bg-[#4a4540] text-[#f5f1e8] rounded border border-[#6b5d4f] font-mono text-xs">
                E / SPACE
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#1a1410]/50 rounded border border-[#b8860b]/20">
              <span className="text-[#d4a574]" style={{ fontFamily: '"Merriweather", serif' }}>
                Menu
              </span>
              <kbd className="px-2 py-1 bg-[#4a4540] text-[#f5f1e8] rounded border border-[#6b5d4f] font-mono text-xs">
                ESC
              </kbd>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t-2 border-[#b8860b]/30">
          <button
            onClick={() => setShowSettingsModal(false)}
            className="w-full px-6 py-3 bg-[#4a4540] hover:bg-[#5a524c] text-[#f5f1e8] rounded-lg font-semibold transition-colors border-2 border-[#6b5d4f]"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
