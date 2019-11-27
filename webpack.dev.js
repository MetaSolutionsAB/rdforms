const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const type = argv.type ? argv.type : 'bmd';
  const entry = {};
  entry[type] = `index.${type}.js`;

  return merge(common, {
    entry,
    output: {
      path: path.join(__dirname, 'dist'),
      filename: "rdforms.[name].js",
      library: 'rdforms',
      libraryTarget: "umd"
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      new HtmlWebpackPlugin(), // Generates default index.html
      new HtmlWebpackPlugin({  // Also generate a test.html
        filename: 'test.html',
        template: 'src/assets/test.html'
      })
    ],
    node: {
      fs: 'empty',
      process: false,
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: true,
      open: true,
    },
  });
};

