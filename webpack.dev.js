const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  node: {
    fs: 'empty',
    process: false,
  },
  devServer: {
    hot: true,
  },
});
