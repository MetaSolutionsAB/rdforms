const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  name: 'node-build',
  target: 'node',
  entry: './main.node.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'rdforms.node.js',
    library: {
      type: 'commonjs2',
    },
    clean: true,
  },
  externals: [nodeExternals()], // ignore node_modules dependencies
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        // transpile js files outside node_modules or under node_modules/@entryscape
        test: /\.js$/,
        exclude: /node_modules\/(?!(@entryscape)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              ['@babel/preset-react'],
            ],
          },
        },
      },
    ],
  },
  context: __dirname, // string (absolute path!)
};
