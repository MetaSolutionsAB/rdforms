const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    bootstrap: './renderers/bootstrap.js',
    bmd: './renderers/bmd.js',
    react: './renderers/react.js',
    jquery: './renderers/jquery.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'rdforms.[name].js',
    library: 'rdforms',
    libraryTarget: 'umd',
  },
  plugins: [
    // For plugins registered after the DojoAMDPlugin, data.request has been normalized and
    // resolved to an absMid and loader-config maps and aliases have been applied
    // new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      'window.jquery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment/,
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!(@entryscape)\/).*/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 3,
            shippedProposals: true,
            targets: { ie: 11 },
          }]],
          plugins: [
            'lodash',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            ['@babel/plugin-transform-react-jsx', {}],
          ],
        },
      }, {
        loader: 'ifdef-loader',
        options: {
          BLOCKS: false,
        },
      }],
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.html$/,
      use: ['raw-loader'],
    }, {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      type: 'asset/resource',
      use: [{
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '../dist/fonts', // relative to HTML page (samples)
        },
      }],
    }],
  },
  node: {
    global: true,
  },
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    alias: {
      jquery: path.resolve(path.join(__dirname, 'node_modules', 'jquery')),
      moment: path.resolve(path.join(__dirname, 'node_modules', 'moment')),
    },
    fallback: {
      fs: false,
      process: false,
    },
  },
  stats: {
    modules: true,
  },
  context: __dirname, // string (absolute path!)
};
