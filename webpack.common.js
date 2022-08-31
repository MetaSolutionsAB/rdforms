const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!(bootstrap|bootstrap-material-design|@entryscape)\/).*/,
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
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            ['@babel/plugin-transform-modules-commonjs', { strictMode: false }],
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
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: '../dist/fonts', // relative to HTML page (samples)
        },
      }],
    }],
  },
  node: {
    fs: 'empty',
    process: false,
    global: true,
  },
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    alias: {
      jquery: path.resolve(path.join(__dirname, 'node_modules', 'jquery')),
      moment: path.resolve(path.join(__dirname, 'node_modules', 'moment')),
    },
  },
  context: __dirname, // string (absolute path!)
};
