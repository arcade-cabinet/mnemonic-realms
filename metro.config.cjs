const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.resolver.blockList = [/docs\/rpgjs-archive\/.*/];
module.exports = withNativeWind(config, { input: './global.css' });

