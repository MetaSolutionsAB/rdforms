const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const path = require('path');
const common = require('./webpack.common');
const examples = [1, 2, 3, 4, 5, 6, 7, 8];

const getHTMLPlugins = (type) => {
  return [
    // create all examples' html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + `/html/index.html`,
      inject: true,
    }),
    // create all examples' html
    ...examples.map(
      (exampleNumber) =>
        new HtmlWebpackPlugin({
          filename: `example${exampleNumber}/index.html`,
          template: __dirname + `/html/example${exampleNumber}/index.html`,
          inject: true,
        })
    ),
    //  append assets for all examples
    new HtmlWebpackTagsPlugin({
      tags: [
        {
          path: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
          type: 'css',
          publicPath: false,
        },
        {
          //        path: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css',
          path: '/fontawesome-free/css/all.min.css',
          type: 'css',
          publicPath: false,
        },
        {
          //        path: 'https://unpkg.com/@entryscape/rdfjson/dist/rdfjson.js',
          path: '/rdfjson/dist/rdfjson.js',
          type: 'js',
          publicPath: false,
        },
        '../styles.css',
      ],
      append: true,
    }), // append styles.css to all examples
    // append examples' respective js for all html
    ...examples.map(
      (number) =>
        new HtmlWebpackTagsPlugin({
          files: [`example${number}/**/*.html`],
          tags: [
            {
              path: `./example${number}/init.js`,
              attributes: {
                type: 'module',
              },
            },
            // Vanilla styling is opt-in (the bundle injects no CSS); add the dev
            // CSS on/off checkbox on the vanilla example pages. Kept in the same
            // tags list as init.js so html-webpack-tags-plugin assigns the
            // type=module attribute to the right script.
            ...(type === 'vanilla'
              ? [
                  {
                    path: '/vanillaCssToggle.js',
                    type: 'js',
                    publicPath: false,
                  },
                ]
              : []),
            // Example nav chrome (dev only): "← Examples" back link + the flavor
            // being viewed appended to the <h1>.
            {
              path: `/exampleNav.js?flavor=${type}`,
              type: 'js',
              publicPath: false,
            },
            // Language switcher (dev only): flips the ?lang locale to show the
            // locale-dependent rendering (dates, localized labels, language
            // filtering). localeBoot.js in the bundle applies the locale.
            {
              path: '/languageSwitcher.js',
              type: 'js',
              publicPath: false,
            },
          ],
          append: true,
        })
    ),
  ];
};

module.exports = (env) => {
  const type = env.type ? env.type : 'react';

  const devConfig = {
    // localeBoot.js (dev only) is bundled first so it sets moment's locale from
    // ?lang before the example init.js runs; see html/localeBoot.js.
    entry: ['./html/localeBoot.js', `./renderers/${type}.js`],
    output: {
      filename: 'rdforms.[name].js',
      library: 'rdforms',
      libraryTarget: 'umd',
      publicPath: '/',
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [...getHTMLPlugins(type)],
    devServer: {
      hot: true,
      open: true,
      static: [
        {
          directory: path.join(__dirname, '/html'),
        },
        {
          // Serve the opt-in vanilla stylesheet from source (used by the toggle).
          directory: path.join(__dirname, 'src', 'view', 'vanilla'),
          publicPath: '/vanilla-css',
        },
        {
          directory: path.join(__dirname, 'node_modules', '@entryscape'),
        },
        {
          directory: path.join(__dirname, 'node_modules', '@fortawesome'),
        },
      ],
    },
  };

  // // Customizing object behavior
  // return merge({
  //   customizeObject(a, b, key) {
  //     if (key === 'entry') {
  //       // Custom merging
  //       return b;
  //     }

  //     // Fall back to default merging
  //     return undefined;
  //   }
  // })(common, devConfig);
  return merge(common, devConfig);
};
