import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Android Configuration', () => {
  const manifestPath = join(process.cwd(), 'android/app/src/main/AndroidManifest.xml');
  const buildGradlePath = join(process.cwd(), 'android/app/build.gradle');
  const stylesPath = join(process.cwd(), 'android/app/src/main/res/values/styles.xml');
  
  let manifest: string;
  let buildGradle: string;
  let styles: string;

  try {
    manifest = readFileSync(manifestPath, 'utf-8');
    buildGradle = readFileSync(buildGradlePath, 'utf-8');
    styles = readFileSync(stylesPath, 'utf-8');
  } catch (error) {
    // If files don't exist, skip tests
    manifest = '';
    buildGradle = '';
    styles = '';
  }

  it('should have correct application ID in build.gradle', () => {
    expect(buildGradle).toContain('applicationId "com.mnemonicrealms.game"');
    expect(buildGradle).toContain('namespace = "com.mnemonicrealms.game"');
  });

  it('should have version code and name in build.gradle', () => {
    expect(buildGradle).toContain('versionCode 1');
    expect(buildGradle).toContain('versionName "1.0"');
  });

  it('should support landscape-only orientation', () => {
    expect(manifest).toContain('android:screenOrientation="sensorLandscape"');
  });

  it('should have fullscreen mode enabled in styles', () => {
    expect(styles).toContain('<item name="android:windowFullscreen">true</item>');
  });

  it('should have required permissions', () => {
    expect(manifest).toContain('<uses-permission android:name="android.permission.INTERNET" />');
  });

  it('should have valid XML structure in AndroidManifest', () => {
    expect(manifest).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(manifest).toContain('<manifest xmlns:android="http://schemas.android.com/apk/res/android">');
    expect(manifest).toContain('</manifest>');
  });

  it('should have MainActivity configured correctly', () => {
    expect(manifest).toContain('android:name=".MainActivity"');
    expect(manifest).toContain('android:launchMode="singleTask"');
    expect(manifest).toContain('android:exported="true"');
  });

  it('should have proper intent filter for launcher', () => {
    expect(manifest).toContain('<action android:name="android.intent.action.MAIN" />');
    expect(manifest).toContain('<category android:name="android.intent.category.LAUNCHER" />');
  });
});
