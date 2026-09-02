const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    // The vanilla flavor is opt-in: its stylesheet is not injected by the JS
    // bundle, so ship it as a standalone file consumers can <link> if they want
    // the minimal look.
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/view/vanilla/vanilla.css'),
          to: 'rdforms.vanilla.css',
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      // only minimize browser bundle files
      new TerserPlugin({
        test: /rdforms\.(?!node\.).+\.js(\?.*)?$/i,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
});
