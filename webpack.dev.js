const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const Jarvis = require('webpack-jarvis');


module.exports = merge(common, {
  mode: 'development',
})