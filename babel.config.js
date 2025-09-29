module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // of 'module:metro-react-native-babel-preset'
    plugins: [
      // ...andere plugins
      'react-native-reanimated/plugin',
    ],
  };
};
