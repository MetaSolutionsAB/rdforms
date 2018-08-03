const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const DojoWebpackPlugin = require('dojo-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './index.bootstrap.js',
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
      environment: {dojoRoot: "dist"},	// used at run time for non-packed resources (e.g.
      // blank.gif)
      buildEnvironment: {dojoRoot: "node_modules"}, // used at build time
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
            outputPath: 'fonts/'
          }
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
      rdforms: path.resolve(path.join(__dirname), 'src'),
      di18n: path.resolve(path.join(__dirname, 'node_modules', 'di18n')),
      moment: path.resolve(path.join(__dirname, 'node_modules', 'moment')),
    }
  },
  context: __dirname, // string (absolute path!)
};