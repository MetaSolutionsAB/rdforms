const isNode = require('detect-node');
const request = require('dojo/request');

let endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1;

export default function (itemStore, bundlePaths, callback) {
  if (bundlePaths.length === 0) {
    callback && callback([]);
    return;
  }

  let f = (bundlesJSON) => {
    let bundles = bundlesJSON.map((bundle, idx) => {
      let path = bundlePaths[idx];
      if (!endsWith(path, ".json")) {
        path += ".js";
      }
      return itemStore.registerBundle({ path, source: bundle });
    });
    callback && callback(bundles);
  };

  if (endsWith(bundlePaths[0], ".json")) {
    if (isNode) {
      let bps = bundlePaths.map(bp => "dojo/text!" + bp);
      require(bps, () => {
        let jsonArr = Array.prototype.slice.call(arguments).map(JSON.parse);
        f(jsonArr); //Convert to regular array
      });
    } else {
      let promises = bundlePaths.map(bp => request.get(bp, { handleAs: 'json' }));
      Promise.all(promises).then(f);
    }
  } else {
    require(bundlePaths, () => {
      f(Array.prototype.slice.call(arguments)); //Convert to regular array
    });
  }
}