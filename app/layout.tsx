import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mnemonic Realms - Procedural RPG Generator',
  description: 'Deterministic procedural generation with ECS architecture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}
