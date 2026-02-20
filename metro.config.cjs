const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.resolver.blockList = [/docs\/rpgjs-archive\/.*/];

// Strip .js extensions from local imports so Metro resolves .ts files correctly.
// TypeScript's "moduleResolution: bundler" emits './foo.js' imports for './foo.ts' files,
// but Metro treats '.js' as a literal filename and fails to find the .ts source.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('.') && moduleName.endsWith('.js')) {
    const stripped = moduleName.slice(0, -3);
    return context.resolveRequest(context, stripped, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });

