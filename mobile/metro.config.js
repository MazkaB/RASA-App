const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;