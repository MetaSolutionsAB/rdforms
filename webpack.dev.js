const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const path = require('path');
const examples = [1, 2, 3, 4, 5, 6, 7, 8];

const getHTMLPlugins = () => {
  return [
    // create all examples' html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + `/html/index.html`,
      inject: true,
    }),
    // create all examples' html
    ...examples.map((exampleNumber) => new HtmlWebpackPlugin({
      filename: `example${exampleNumber}/index.html`,
      template: __dirname + `/html/example${exampleNumber}/index.html`,
      inject: true,
    })),
    //  append assets for all examples
    new HtmlWebpackTagsPlugin({
      tags: [{
        path: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
        type: 'css',
        publicPath: false,
      }, {
//        path: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css',
        path: '/fontawesome-free/css/all.min.css',
        type: 'css',
        publicPath: false,
      }, {
//        path: 'https://unpkg.com/@entryscape/rdfjson/dist/rdfjson.js',
        path: '/rdfjson/dist/rdfjson.js',
        type: 'js',
        publicPath: false,
      },
        '../styles.css'
      ],
      append: true
    }), // append styles.css to all examples
    // append examples' respective js for all html
    ...examples.map((number) => new HtmlWebpackTagsPlugin({
      files: [`example${number}/**/*.html`],
      tags: [{
        path: `./example${number}/init.js`,
        attributes: {
          type: 'module',
        }
      }],
      append: true
    })),
  ];
};

module.exports = (env, argv) => {
  const type = argv.type ? argv.type : 'bmd';

  const devConfig = {
    entry: `./renderers/${type}.js`,
    output: {
      filename: 'rdforms.[name].js',
      library: 'rdforms',
      libraryTarget: "umd",
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      ...getHTMLPlugins(),
       //new CircularDependencyPlugin({
       //  // exclude detection of files based on a RegExp
       //  exclude: /a\.js|node_modules/,
       //  // add errors to webpack instead of warnings
       //  failOnError: false,
       //  // allow import cycles that include an asyncronous import,
       //  // e.g. via import(/* webpackMode: "weak" */ './file.js')
       //  allowAsyncCycles: false,
       //  // set the current working directory for displaying module paths
       //  cwd: process.cwd(),
       //}),
    ],
    node: {
      fs: 'empty',
      process: false,
    },
    devServer: {
      contentBase: [
        path.join(__dirname, '/html'),
        path.join(__dirname, 'node_modules', '@entryscape'),
        path.join(__dirname, 'node_modules', '@fortawesome'),
      ],
      hot: true,
      open: true,
      publicPath: '/',
    },
  };

  // Customizing object behavior
  return merge({
    customizeObject(a, b, key) {
      if (key === 'entry') {
        // Custom merging
        return b;
      }

      // Fall back to default merging
      return undefined;
    }
  })(common, devConfig);
};

