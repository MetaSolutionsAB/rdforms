const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const path = require('path');

const getHTMLPlugins = () => {
  const examples = [1, 2, 3, 4, 5, 6, 7];
  return [
    // create all examples' html
    ...examples.map((exampleNumber) => new HtmlWebpackPlugin({
      filename: `example${exampleNumber}/index.html`,
      template: __dirname + `/html/example${exampleNumber}/index.html`,
      inject: true,
    })),
    //  append assets for all examples
    new HtmlWebpackTagsPlugin({
      tags: [{
        path: 'https://fonts.googleapis.com/css?family=Material+Icons',
        type: 'css',
        publicPath: false,
      }, {
        path: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
        type: 'css',
        publicPath: false,
      }, {
        path: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        type: 'css',
        publicPath: false,
      }, {
        path: 'https://unpkg.com/@entryscape/rdfjson/dist/rdfjson.js',
        type: 'js',
        publicPath: false,
      },
        'html/example.css'
      ],
      append: true
    }), // append styles.css to all examples
    // append examples' respective js for all html
    ...examples.map((number) => new HtmlWebpackTagsPlugin({
      files: [`example${number}/**/*.html`],
      tags: [{
        path: `html/example${number}/init.js`,
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
    entry: `./index.${type}.js`,
    output: {
      filename: 'rdforms.[name].js',
      library: 'rdforms',
      libraryTarget: "umd",
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      ...getHTMLPlugins(),
    ],
    node: {
      fs: 'empty',
      process: false,
    },
    devServer: {
      contentBase: path.join(__dirname, '/'),
      hot: true,
      open: true,
      openPage: 'example3',
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

