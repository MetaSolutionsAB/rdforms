const path = require('path');

module.exports = {
  extends: 'airbnb-base',
  settings: {
    'import/resolver': {
      webpack: { config: path.join(__dirname, 'webpack.config.js') },
    },
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  rules: {
    'import/no-amd': 'off',
    // TODO remove this. use requirejs rules instead
    'no-undef': 'off',
    //  Maybe this is better : no-underscore-dangle: [2, { 'allowAfterThis': true }]
    'no-underscore-dangle': 'off',
    'prefer-rest-params': 'off',
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'no-console': 'off',
    'no-prototype-builtins': 'off',
    'no-param-reassign': ['error', { 'props': false }],
    'import/extensions': ['error', { '.js': 'never' }],
    'max-len': ['error', { 'code': 120, "ignoreTrailingComments": true, "ignoreTemplateLiterals": true }],
  }
};
