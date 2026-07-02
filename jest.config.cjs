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
};
