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
              options: {
                // context: APP_PATH,
                locales: ["en", "sv"],
              },
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(bootstrap|bootstrap-material-design|rdfjson|esi18n)\/).*/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-env", {
                  "targets": {
                    "ie": 11,
                  },
                },
                ]
              ],
              plugins: [
                'lodash',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                ['@babel/plugin-transform-modules-commonjs', { strictMode: false }],

              ],
            }
          },
          {
            loader: 'ifdef-loader',
            options: {
              BLOCKS: false,
            },
          },
        ],
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
    global: true,
  },
  resolve: {
    alias: {
      jquery: path.resolve(path.join(__dirname, 'node_modules', 'jquery')),
      moment: path.resolve(path.join(__dirname, 'node_modules', 'moment')),
    }
  },
  context: __dirname, // string (absolute path!)
};
