const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './main.js',
  plugins: [
    new CleanWebpackPlugin(),
  ],
  node: {
    fs: 'empty'
  },
  resolve: {
    alias: {
      md5: 'md5/md5',
    }
  },
};