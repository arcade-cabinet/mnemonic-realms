import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mnemonicrealms.game',
  appName: 'Mnemonic Realms',
  webDir: 'dist/standalone',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'none',
    },
  },
};

export default config;
