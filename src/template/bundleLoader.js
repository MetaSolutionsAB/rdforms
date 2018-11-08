const isNode = require('detect-node');

/**
 * Return the first sucessfully fetched bundle from a list of urls
 *
 * @param {String} urls
 * @returns {Promise<Response | never | void>}
 */
const fetchBundle = async (urls) => {
  let bundle;
  for (url of urls) {
    bundle = await fetch(url).then(r => r.json()).catch(e => console.log(`Fetching or parsing template bundle ${url} failed`, e)); // TODO dont't log if all fallback options are not exhausted
    if (bundle) {
      break;
    }
  }

  return bundle;
}

/**
 * Fetch or if loaded just wrap it in Promise.resolve
 * @param bundles
 * @returns {*}
 */
const promisifyBundles = bundles => bundles.map(b => b instanceof Array ? fetchBundle(b) : Promise.resolve(b));

/**
 * Register bundle templates
 *
 * @param bundles
 * @param itemStore
 * @param callback
 */
const registerBundles = (bundles = [], itemStore, callback) => {
  const registeredBundles = bundles.map(source => itemStore.registerBundle({source}));
  return registeredBundles;
  // if (callback) {
    // callback(registeredBundles);
  // }
};

/**
 *
 * @param itemStore
 * @param bundlePaths {Array<Object|String>} an array of object (bundles) or paths
 * @param callback
 */
export default async (itemStore, bundlePaths = [], callback = null) => {
  if (bundlePaths.length === 0) { // nothing to load
    callback && callback([]);
  }


  if (isNode) {
    const bundles = bundlePaths.map(b => require(b)); // TODO @valentino use fetch (polyfill?) for node also
    registerBundles(bundles);
  } else {
    // Fetch or if loaded just wrap it in Promise.resolve
    const bundlePromises = promisifyBundles(bundlePaths);
    const loadedBundles = await Promise.all(bundlePromises);
    return registerBundles(loadedBundles, itemStore, callback);
  }
};
