'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/stores/gameStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { Modal } from './Modal';
import { Download, Trash2, Calendar, Sword } from 'lucide-react';

export function LoadGameModal() {
  const { saves, loadGame, deleteSave } = useGameStore();
  const { showLoadGameModal, setShowLoadGameModal } = useUIStore();
  const [selectedSave, setSelectedSave] = useState<string | null>(null);

  const handleLoad = () => {
    if (selectedSave) {
      loadGame(selectedSave);
      setShowLoadGameModal(false);
      // Navigate to game
      window.location.href = '/play';
    }
  };

  const handleDelete = (saveId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you certain you wish to erase this chronicle from the annals of history?')) {
      deleteSave(saveId);
      if (selectedSave === saveId) {
        setSelectedSave(null);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Modal
      isOpen={showLoadGameModal}
      onClose={() => setShowLoadGameModal(false)}
      title="Chronicles of Past Adventures"
    >
      <div className="space-y-4">
        {saves.length === 0 ? (
          <div className="text-center py-12">
            <Sword className="w-16 h-16 mx-auto mb-4 text-[#6b5d4f]" />
            <p
              className="text-[#d4a574] text-lg mb-2"
              style={{ fontFamily: '"Merriweather", serif' }}
            >
              No Chronicles Found
            </p>
            <p
              className="text-[#6b5d4f] text-sm"
              style={{ fontFamily: '"Merriweather", serif' }}
            >
              Begin a new quest to write your legend
            </p>
          </div>
        ) : (
          <>
            <p
              className="text-[#d4a574] text-sm mb-4"
              style={{ fontFamily: '"Merriweather", serif' }}
            >
              Select a saga to resume your adventure
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {saves.map((save) => (
                <div
                  key={save.id}
                  onClick={() => setSelectedSave(save.id)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${
                      selectedSave === save.id
                        ? 'border-[#d4af37] bg-[#2d2520] shadow-lg'
                        : 'border-[#b8860b]/30 bg-[#1a1410]/50 hover:border-[#b8860b] hover:bg-[#2d2520]/50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold text-[#d4af37] mb-1"
                        style={{ fontFamily: '"Cinzel", serif' }}
                      >
                        {save.name}
                      </h3>
                      <p
                        className="text-[#d4a574] text-sm mb-2"
                        style={{ fontFamily: '"Merriweather", serif' }}
                      >
                        Seed: <span className="text-[#b8860b] font-mono">{save.worldSeed}</span>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#6b5d4f]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(save.savedAt)}
                        </span>
                        {save.playTime > 0 && (
                          <span>Played: {formatPlayTime(save.playTime)}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(save.id, e)}
                      className="p-2 text-[#8b1f1f] hover:text-[#7c1a1a] hover:bg-[#4a0e0e]/30 rounded transition-colors"
                      aria-label="Delete save"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedSave && (
              <div className="flex gap-3 pt-4 border-t-2 border-[#b8860b]/30">
                <button
                  onClick={handleLoad}
                  className="flex-1 px-6 py-3 bg-[#8b1f1f] hover:bg-[#7c1a1a] text-[#f5f1e8] rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 border-2 border-[#4a0e0e]"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  <Download className="w-5 h-5" />
                  Resume Adventure
                </button>
                <button
                  onClick={() => setShowLoadGameModal(false)}
                  className="px-6 py-3 bg-[#4a4540] hover:bg-[#5a524c] text-[#f5f1e8] rounded-lg font-semibold transition-colors border-2 border-[#6b5d4f]"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
