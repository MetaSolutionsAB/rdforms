const webpack = require('webpack');
const path = require('path');

module.exports = {
  target: 'node',
  entry: './main.node.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'rdforms.node.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /\.css$/,
    }),
  ],
  context: __dirname, // string (absolute path!)
};
