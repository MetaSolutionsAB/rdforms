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
};

module.exports = {
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
