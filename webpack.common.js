const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const DojoWebpackPlugin = require('dojo-webpack-plugin');

module.exports = {
  entry: {
    bootstrap: 'index.bootstrap.js',
    bmd: 'index.bmd.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].rdforms.js",
    library: 'rdforms',
    libraryTarget: "umd"
  },
  plugins: [
    // For plugins registered after the DojoAMDPlugin, data.request has been normalized and
    // resolved to an absMid and loader-config maps and aliases have been applied
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      'window.jquery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new DojoWebpackPlugin({
      loaderConfig: require("./config/dojoConfig"),
      locales: ["en"],
      environment: {dojoRoot: "dist"},	// used at run time for non-packed resources (e.g.
      // blank.gif)
      buildEnvironment: {dojoRoot: "node_modules"}, // used at build time
      noConsole: true,
      // loader: path.join(__dirname, "./dist/dojo/dojo.js"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.nls$/,
        use: [
          {
            loader: 'nls-loader',
          }
        ]
      },
      {
        test: /\.js$/,
        // exclude: /node_modules\/(?!(rdfjson|esi18n|store|)\/).*/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties',
              ['@babel/plugin-transform-modules-commonjs', {strictMode: false}],
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            publicPath: '../dist/fonts', // relative to HTML page (samples)
          },
        }]
      },
    ]
  },
  node: {
    fs: 'empty',
    process: false,
    global: false
  },
  resolve: {
    alias: {
      jquery: path.resolve(path.join(__dirname, 'node_modules', 'jquery')),
      moment: path.resolve(path.join(__dirname, 'node_modules', 'moment')),
      bmd: path.resolve(path.join(__dirname, 'node_modules', 'bootstrap-material-design')),
    }
  },
  context: __dirname, // string (absolute path!)
};
