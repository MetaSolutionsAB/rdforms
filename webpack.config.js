const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const DojoWebpackPlugin = require('dojo-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "rdforms.js",
    library: 'rdforms',
    libraryTarget: "umd"
  },
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new DojoWebpackPlugin({
      loaderConfig: require("./config/dojoConfig"),
      locales: ["en"],
      environment: { dojoRoot: "dist" },	// used at run time for non-packed resources (e.g.
      // blank.gif)
      buildEnvironment: { dojoRoot: "node_modules" }, // used at build time
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      //'window.jquery': 'jquery',
      Popper: ['popper.js', 'default'],
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
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
    ]
  },
  node: {
    fs: 'empty',
    process: false,
    global: false
  },
  resolve: {
    alias: {
      jquery: path.resolve(path.join(__dirname, 'node_modules', 'jquery'))
    }

  },
  context: __dirname, // string (absolute path!)
};