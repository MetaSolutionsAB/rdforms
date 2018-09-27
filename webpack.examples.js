const merge = require('webpack-merge')
const path = require('path');
const common = require('./webpack.common.js')
const Jarvis = require('webpack-jarvis');

module.exports = merge(common, {
  entry: {
    example4: 'samples/example4.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js",
    library: '[name]',
    libraryTarget: "umd"
  },
  mode: 'development',
  devtool: 'inline-source-map',
})
