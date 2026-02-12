'use client';

import { useState } from 'react';
import SeedInput from '@/components/SeedInput';
import GeneratedContent from '@/components/GeneratedContent';

export default function Home() {
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (seed: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setGeneratedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="text-center text-white mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-6xl">🎮</span>
          <h1 className="text-5xl md:text-6xl font-bold">
            Mnemonic Realms
          </h1>
        </div>
        <p className="text-xl opacity-90">
          Procedural RPG Generator with ECS Architecture
        </p>
      </header>

      <SeedInput onGenerate={handleGenerate} loading={loading} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {generatedData && <GeneratedContent data={generatedData} />}
    </main>
  );
}
