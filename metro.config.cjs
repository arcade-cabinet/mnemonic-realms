const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.blockList = [/docs\/rpgjs-archive\/.*/];
module.exports = config;

