'use client';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">🎮 Mnemonic Realms</h1>
      <p className="text-xl text-gray-600 mb-8">
        A procedurally generated 16-bit style RPG powered by seed-based content generation
      </p>

      <div className="bg-white p-8 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">🚧 Under Construction</h2>
        <p className="mb-4">
          Welcome to Mnemonic Realms! We're currently building the game with the following features:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Seed-Based Generation</strong>: Enter "adjective adjective noun" to create unique worlds</li>
          <li><strong>16-Bit Style</strong>: Classic Diablo/FF7 inspired aesthetic</li>
          <li><strong>Procedural Content</strong>: Characters, terrain, NPCs, loot, and quests all generated from seeds</li>
          <li><strong>Single-Player RPG</strong>: Browser-based adventure game</li>
          <li><strong>Deterministic</strong>: Same seed always creates the same world</li>
        </ul>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">📚 Documentation</h2>
        <p className="mb-4">Explore our comprehensive documentation:</p>
        <ul className="space-y-2">
          <li>
            <a href="https://github.com/arcade-cabinet/mnemonic-realms/blob/main/docs/vision/GAME_VISION.md" className="text-blue-600 hover:underline">
              Game Vision →
            </a>
          </li>
          <li>
            <a href="https://github.com/arcade-cabinet/mnemonic-realms/blob/main/docs/architecture/SYSTEM_ARCHITECTURE.md" className="text-blue-600 hover:underline">
              System Architecture →
            </a>
          </li>
          <li>
            <a href="https://github.com/arcade-cabinet/mnemonic-realms/blob/main/docs/design/GAME_SYSTEMS.md" className="text-blue-600 hover:underline">
              Game Systems →
            </a>
          </li>
          <li>
            <a href="https://github.com/arcade-cabinet/mnemonic-realms/blob/main/docs/DEVLOG.md" className="text-blue-600 hover:underline">
              Development Log →
            </a>
          </li>
        </ul>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">🔨 Current Status</h2>
        <p className="mb-4">
          <strong>Foundation Complete:</strong> ECS procedural generation system with 8 specialized generators
        </p>
        <p className="mb-4">
          <strong>Next Steps:</strong> Implementing RPG-JS game module with player movement and map rendering
        </p>
        <p>
          <strong>Try the demo:</strong>{' '}
          <a href="/demo.html" className="text-blue-600 hover:underline">
            Interactive Procedural Generation Demo →
          </a>
        </p>
      </div>
    </main>
  );
}
