import '../global.css';

import { GluestackUIProvider } from '@gluestack-ui/nativewind';
import { Slot } from 'expo-router';
import { GameThemeProvider } from '../ui/theme/provider';

export default function Layout() {
  return (
    <GluestackUIProvider>
      <GameThemeProvider>
        <Slot />
      </GameThemeProvider>
    </GluestackUIProvider>
  );
}
