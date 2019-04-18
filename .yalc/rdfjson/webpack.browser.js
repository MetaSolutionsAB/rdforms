const merge = require('webpack-merge')
const path = require('path');
const config = require('./webpack.common.js')

module.exports = merge(config, {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'rdfjson.js',
    library: 'rdfjson',
    libraryTarget: 'window',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
    ],
  },
});
