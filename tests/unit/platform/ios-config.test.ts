import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('iOS Configuration', () => {
  const infoPlistPath = join(process.cwd(), 'ios/App/App/Info.plist');
  let infoPlist: string;

  try {
    infoPlist = readFileSync(infoPlistPath, 'utf-8');
  } catch (error) {
    // If file doesn't exist, skip tests
    infoPlist = '';
  }

  it('should have CFBundleDisplayName set to Mnemonic Realms', () => {
    expect(infoPlist).toContain('<key>CFBundleDisplayName</key>');
    expect(infoPlist).toContain('<string>Mnemonic Realms</string>');
  });

  it('should require fullscreen mode', () => {
    expect(infoPlist).toContain('<key>UIRequiresFullScreen</key>');
    expect(infoPlist).toContain('<true/>');
  });

  it('should support only landscape orientations on iPhone', () => {
    const orientationsMatch = infoPlist.match(
      /<key>UISupportedInterfaceOrientations<\/key>\s*<array>([\s\S]*?)<\/array>/
    );
    expect(orientationsMatch).toBeTruthy();
    
    const orientations = orientationsMatch?.[1] || '';
    expect(orientations).toContain('UIInterfaceOrientationLandscapeLeft');
    expect(orientations).toContain('UIInterfaceOrientationLandscapeRight');
    expect(orientations).not.toContain('UIInterfaceOrientationPortrait');
  });

  it('should support only landscape orientations on iPad', () => {
    const orientationsMatch = infoPlist.match(
      /<key>UISupportedInterfaceOrientations~ipad<\/key>\s*<array>([\s\S]*?)<\/array>/
    );
    expect(orientationsMatch).toBeTruthy();
    
    const orientations = orientationsMatch?.[1] || '';
    expect(orientations).toContain('UIInterfaceOrientationLandscapeLeft');
    expect(orientations).toContain('UIInterfaceOrientationLandscapeRight');
    expect(orientations).not.toContain('UIInterfaceOrientationPortrait');
    expect(orientations).not.toContain('UIInterfaceOrientationPortraitUpsideDown');
  });

  it('should have valid XML structure', () => {
    expect(infoPlist).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(infoPlist).toContain('<!DOCTYPE plist');
    expect(infoPlist).toContain('<plist version="1.0">');
    expect(infoPlist).toContain('</plist>');
  });

  it('should have required iOS metadata keys', () => {
    const requiredKeys = [
      'CFBundleDevelopmentRegion',
      'CFBundleDisplayName',
      'CFBundleExecutable',
      'CFBundleIdentifier',
      'CFBundleInfoDictionaryVersion',
      'CFBundleName',
      'CFBundlePackageType',
      'CFBundleShortVersionString',
      'CFBundleVersion',
      'LSRequiresIPhoneOS',
    ];

    for (const key of requiredKeys) {
      expect(infoPlist).toContain(`<key>${key}</key>`);
    }
  });
});
