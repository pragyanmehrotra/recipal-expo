module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Tamagui Babel plugin is not needed for Expo/React Native and causes errors
      // "@tamagui/babel-plugin" removed
    ],
  };
};
