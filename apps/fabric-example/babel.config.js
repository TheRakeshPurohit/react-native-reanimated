/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-reanimated/plugin', { processNestedWorklets: true }],
    '@babel/plugin-transform-export-namespace-from',
  ],
};
