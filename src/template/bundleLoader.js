import {endsWith} from 'lodash-es';

const isNode = require('detect-node');

const fetchBundle = b => fetch(b).then(r => r.json()).catch(e => console.log(`Fetching template bundle ${b} failed`, e))

export default (itemStore, bundlePaths = [], callback = null) => {
  if (bundlePaths.length === 0) {
    callback && callback([]);
    return; // TODO consitent return
  }

  const registerBundles = (bundlesJSON = []) => {
    const bundles = bundlesJSON.map((bundle, idx) => {
      let path = bundlePaths[idx];
      if (!endsWith(path, '.json')) {
        path += '.js';
      }
      return itemStore.registerBundle({path, source: bundle});
    });
    callback && callback(bundles);
  };

  if (endsWith(bundlePaths[0], '.json')) {
    if (isNode) {
      const bundles = bundlePaths.map(b => require(b)); // TODO @valentino use fetch (polyfill?) for node also
      registerBundles(bundles);
    } else {
      const bundlePromises = bundlePaths.map(fetchBundle);
      Promise.all(bundlePromises).then(registerBundles);
    }
  }
  // } else {
  //   const bundlePromises = bundlePaths.map(fetchBundle);
  //   Promise.all(bundlePromises).then(registerBundle);
  //   // require(bundlePaths, (bundles) => {
  //   //   registerBundle(Array.prototype.slice.call(arguments)); //Convert to regular array
  //   // });
  // }
};
