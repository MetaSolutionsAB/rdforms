const config = require('./webpack.browser.js')
const nodeConfig = require('./webpack.node.js')

module.exports = [config, nodeConfig];
