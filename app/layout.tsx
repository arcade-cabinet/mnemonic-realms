import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mnemonic Realms - Sword & Sorcery RPG',
  description: 'A procedurally generated high fantasy adventure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700;800;900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-to-br from-[#1a1410] via-[#2d2520] to-[#1a1410] min-h-screen">
        {children}
      </body>
    </html>
  );
}
