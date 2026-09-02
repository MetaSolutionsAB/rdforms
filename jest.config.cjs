// jest.config.cjs
// Two projects: `node` for model/template logic, `jsdom` for the view layer
// (the vanilla presenter and future view tests render real DOM). Both share the
// self-contained babel transform (configFile/babelrc disabled) so this config
// does not interfere with the inline babel-loader options used by webpack.
const shared = {
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': [
      'babel-jest',
      {
        configFile: false,
        babelrc: false,
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
        plugins: ['@babel/plugin-transform-class-properties'],
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(\\.pnpm|lodash-es|@entryscape)/)'],
  // Flavor entries import their stylesheet; stub CSS out for tests.
  moduleNameMapper: { '\\.(css|scss)$': '<rootDir>/test/styleMock.cjs' },
  // Restore spies/mocks after every test, even when an assertion throws, so a
  // console spy can never leak its stub into a later suite.
  restoreMocks: true,
};

module.exports = {
  // Scoped to the core model/template classes that have unit-test suites; no
  // coverage thresholds are enforced.
  collectCoverageFrom: [
    'src/model/Binding.js',
    'src/model/engine.js',
    'src/template/Item.js',
    'src/template/ItemStore.js',
  ],
  projects: [
    {
      ...shared,
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/**/*.test.js'],
      // The view layer renders DOM and is covered by the jsdom project below.
      testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/view/'],
    },
    {
      ...shared,
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/view/**/*.test.js'],
    },
  ],
};
