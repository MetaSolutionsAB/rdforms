import {endsWith} from 'lodash-es';

const isNode = require('detect-node');

/**
 * @param {String} url
 * @returns {Promise<Response | never | void>}
 */
const fetchBundle = url => fetch(url).then(r => r.json()).catch(e => console.log(`Fetching template bundle ${url} failed`, e));

export default (itemStore, bundlePaths = [], callback = null) => {
  if (bundlePaths.length === 0) {
    callback && callback([]);
    return; // TODO consitent return
  }

  const registerBundles = (bundlesJSON = []) => {
    const bundles = bundlesJSON.map((bundle, idx) => itemStore.registerBundle({
      path: bundlePaths[idx],
      source: bundle
    }));
    callback && callback(bundles);
  };

  if (isNode) {
    const bundles = bundlePaths.map(b => require(b)); // TODO @valentino use fetch (polyfill?) for node also
    registerBundles(bundles);
  } else {
    const bundlePromises = bundlePaths.map(fetchBundle);
    Promise.all(bundlePromises).then(registerBundles);
  }
};
