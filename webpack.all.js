const prodConfig = require('./webpack.prod.js')
const nodeConfig = require('./webpack.node.js')

module.exports = [nodeConfig, prodConfig];
