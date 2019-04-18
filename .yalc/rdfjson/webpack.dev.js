const merge = require('webpack-merge')
const config = require('./webpack.browser.js')
var DashboardPlugin = require('webpack-dashboard/plugin');
const Jarvis = require('webpack-jarvis');

const webpack = require('webpack');
module.exports = merge(config, {
  mode: 'development',
  serve: {
    devMiddleware: {
      publicPath: "/"
    },
  },
  plugins: [
    new DashboardPlugin(),
    new Jarvis({
      port: 1337 // optional: set a port
    }),
  ],
});
