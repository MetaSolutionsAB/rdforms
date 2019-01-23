const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  target: 'node',
  entry: './main.node.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "node.rdforms.js",
    libraryTarget: "commonjs2",
  },
  plugins: [
    new webpack.IgnorePlugin(/\.css$/),
    new CleanWebpackPlugin(),
  ],
  context: __dirname, // string (absolute path!)
};
