import { describe, expect, it } from 'vitest';
import config from '../../../capacitor.config';

describe('Capacitor Configuration', () => {
  it('should have valid appId in Java package format', () => {
    expect(config.appId).toBe('com.mnemonicrealms.game');
    expect(config.appId).toMatch(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/);
  });

  it('should have correct appName', () => {
    expect(config.appName).toBe('Mnemonic Realms');
  });

  it('should point to correct webDir', () => {
    expect(config.webDir).toBe('dist/standalone');
  });

  it('should configure HTTPS schemes for both platforms', () => {
    expect(config.server?.androidScheme).toBe('https');
    expect(config.server?.iosScheme).toBe('https');
  });

  it('should configure SplashScreen plugin', () => {
    expect(config.plugins?.SplashScreen).toBeDefined();
    expect(config.plugins?.SplashScreen?.launchShowDuration).toBe(2000);
    expect(config.plugins?.SplashScreen?.backgroundColor).toBe('#000000');
    expect(config.plugins?.SplashScreen?.showSpinner).toBe(false);
  });

  it('should configure Keyboard plugin', () => {
    expect(config.plugins?.Keyboard).toBeDefined();
    expect(config.plugins?.Keyboard?.resize).toBe('none');
  });
});
