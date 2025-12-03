const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolve react-native-maps to a stub for web platform only
const originalResolveRequest = config.resolver?.resolveRequest;
config.resolver = config.resolver || {};
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Only intercept react-native-maps for web platform
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      filePath: path.resolve(__dirname, 'metro-stubs/react-native-maps.js'),
      type: 'sourceFile',
    };
  }
  // For all other cases, use the original resolver
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  // Fallback to default Metro resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
