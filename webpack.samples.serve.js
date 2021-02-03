module.exports = {
  devServer: {
    contentBase: 'samples',
    hot: true,
    open: true,
    lazy: true,
    filename: 'none.js', // Ugly hack to allow lazy which allows no compilation.
  },
};

