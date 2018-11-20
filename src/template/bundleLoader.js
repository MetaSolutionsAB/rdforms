const isNode = require('detect-node');

/**
 * Return the first sucessfully fetched bundle from a list of urls or throw en error if none could be fetched
 *
 * @param {String} urls
 * @returns {Promise<Response | never | void>}
 */
const fetchBundle = async (urls) => {
  const totalUrls = urls.length;
  let response;
  let bundle;

  for (let i = 0; i < totalUrls; i++) {
    try {
      response = await fetch(urls[i]);
    } catch (e) {
      throw Error(`A network error ocurred while trying to fetch bundle ${urls[i]}`);
    }
    if (response.ok) {
      try {
        bundle = await response.json();
      } catch (e) {
        console.log(e);
      }
      break;
    } else if (i === (totalUrls - 1)) { // if last url to check also failed then throw an error
      throw Error(`Fetching template bundle ${urls[i]} failed`);
    }
  }

  return bundle;
}

/**
 * Fetch or if loaded just wrap it in Promise.resolve
 * @param bundles
 * @returns {*}
 */
const promisifyBundles = bundles => bundles.map(bundle => bundle instanceof Array ? fetchBundle(bundle) : Promise.resolve(bundle));

/**
 * Register bundle templates
 *
 * @param bundles
 * @param itemStore
 */
const registerBundles = (itemStore, bundles = []) => bundles.map(source => itemStore.registerBundle({ source }));

/**
 *
 * @param itemStore
 * @param bundlePaths {Array<Object|String>} an array of object (bundles) or paths
 * @param callback
 */
export default async (itemStore, bundlePaths = [], callback = ()=>{}) => {
  if (bundlePaths.length === 0) { // nothing to load
    callback && callback([]);
  }


  if (isNode) {
    const bundles = bundlePaths.map(bundlePath => require(bundlePath)); // TODO @valentino use fetch (polyfill?) for node also
    registerBundles(bundles);
  } else {
    // Fetch or if loaded just wrap it in Promise.resolve
    const bundlePromises = promisifyBundles(bundlePaths);
    const loadedBundles = await Promise.all(bundlePromises);
    const registeredBundles = registerBundles(itemStore, loadedBundles);
    callback(registeredBundles); // TODO remove; should be deprecated
    return registeredBundles;
  }
};
