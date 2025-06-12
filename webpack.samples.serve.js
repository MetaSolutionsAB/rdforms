var path = require('path');

module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'samples'),
    },
    hot: true,
    open: true,
    liveReload: false,
    // filename: 'none.js', // Ugly hack to allow lazy which allows no compilation.
  },
};
