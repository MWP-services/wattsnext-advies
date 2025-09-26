module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // of 'module:metro-react-native-babel-preset'
    plugins: [
      // ...andere plugins
      // Worklets plugin must run before Reanimated so that both share the
      // version pinned in package.json (Expo Go ships Worklets 0.5.1).
      'react-native-worklets/plugin',
      'react-native-reanimated/plugin',
    ],
  };
};
