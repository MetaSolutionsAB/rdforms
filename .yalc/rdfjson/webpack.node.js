const merge = require('webpack-merge')
const path = require('path');
const config = require('./webpack.common.js')

module.exports = merge(config, {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "node.rdfjson.js",
    library: 'rdfjson',
    libraryTarget: "commonjs2",
  },
})
