const prodConfig = require('./webpack.prod');
const nodeConfig = require('./webpack.node');

module.exports = [prodConfig, nodeConfig];
