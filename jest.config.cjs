// jest.config.cjs
// Self-contained babel transform (configFile/babelrc disabled) so this config
// does not interfere with the inline babel-loader options used by webpack.
module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['<rootDir>/src/**/*.test.js'],
  transform: {
    '^.+\\.js$': ['babel-jest', {
      configFile: false,
      babelrc: false,
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      plugins: ['@babel/plugin-transform-class-properties'],
    }],
  },
  transformIgnorePatterns: ['node_modules/(?!(\\.pnpm|lodash-es|@entryscape)/)'],
  // Scoped to the core model/template classes that have unit-test suites
  // (see RDFORMS-179); no coverage thresholds are enforced.
  collectCoverageFrom: [
    'src/model/Binding.js',
    'src/model/engine.js',
    'src/template/Item.js',
    'src/template/ItemStore.js',
  ],
};
