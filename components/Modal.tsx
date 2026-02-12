'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop - Dark leather overlay */}
      <div className="absolute inset-0 bg-[#1a1410]/90 backdrop-blur-sm" />

      {/* Modal Content - Medieval scroll/parchment style */}
      <div
        ref={modalRef}
        className="relative z-[1400] w-full max-w-2xl max-h-[90vh] overflow-hidden
                   bg-gradient-to-b from-[#2d2520] to-[#1a1410]
                   border-4 border-[#b8860b] rounded-lg shadow-2xl"
        style={{
          boxShadow: '0 0 30px rgba(184, 134, 11, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Header - Bronze border with embossed look */}
        <div
          className="flex items-center justify-between p-6 border-b-2 border-[#b8860b]/50
                     bg-gradient-to-r from-[#4a4540] to-[#2d2520]"
        >
          <h2
            className="text-2xl font-bold text-[#d4af37]"
            style={{
              fontFamily: '"Cinzel", serif',
              textShadow: '0 0 10px rgba(139, 31, 31, 0.6)',
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#d4a574] hover:text-[#d4af37] transition-colors
                       rounded-lg hover:bg-[#1a1410]/50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable parchment area */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
