const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { execSync } = require('child_process');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const createVariants = require('parallel-webpack').createVariants;
const CleanWebpackPlugin = require('clean-webpack-plugin');


const rdfjsonVersion = execSync('yarn info @entryscape/rdfjson version --silent').toString().trim();
const examples = [1, 2, 3, 4, 5, 6, 7];
const getHTMLPlugins = () => {
  return [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + `/html/index.html`,
      inject: true,
    }),
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
        path: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css',
        type: 'css',
        publicPath: false,
      }, {
        path: `https://unpkg.com/@entryscape/rdfjson@${rdfjsonVersion}/dist/rdfjson.js`,
        type: 'js',
        publicPath: false,
      },
        'styles.css'
      ],
      append: true
    }), // append styles.css to all examples
    // append examples' respective js for all html
    ...examples.map((number) => new HtmlWebpackTagsPlugin({
      files: [`example${number}/**/*.html`],
      publicPath: '.',
      tags: [{
        path: 'init.js',
        attributes: {
          type: 'module',
        }
      }],
      append: true
    })),
  ];
};

const getCopyPlugins = (type) => new CopyWebpackPlugin([
  ...examples.map((number) => ({
    from: path.resolve(path.join(__dirname, 'html', `example${number}`)),
    to: path.resolve(path.join(__dirname, 'samples', type, `example${number}`)),
    test: /\.js$/,
  })), {
    from: path.resolve(path.join(__dirname, 'html', 'chooser')),
    to: 'chooser',
  }, {
    from: path.resolve(path.join(__dirname, 'html', 'templates')),
    to: 'templates',
  }, {
    from: path.resolve(path.join(__dirname, 'html', 'rdf.js')),
    to: 'rdf.js',
  }, {
    from: path.resolve(path.join(__dirname, 'html', 'examples.html')),
    to: 'index.html',
  }, {
    from: path.resolve(path.join(__dirname, 'html', 'styles.css')),
    to: 'styles.css',
  }]);

const variants = {
  type: ['bmd', 'bootstrap', 'react'],
};

function createConfig(options) {
  const devConfig = {
    entry: `./index.${options.type}.js`,
    output: {
      path: path.join(__dirname, 'samples', options.type),
      filename: 'rdforms.js',
    },
    mode: 'production',
    plugins: [
      ...getHTMLPlugins(),
      getCopyPlugins(options.type),
      new CleanWebpackPlugin([
        path.join(__dirname, 'samples', options.type),
      ]),
    ],
    node: {
      fs: 'empty',
      process: false,
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


module.exports = createVariants({}, variants, createConfig);


