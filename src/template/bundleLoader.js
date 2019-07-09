const isNode = require('detect-node');
if (isNode) {
  fetch = require('node-fetch');
}

/**
 * Check if there's any iterations left in a hypothetical array with 'length' given.
 *
 * @param {number} iteration
 * @param {number} length
 * @param {string} templateId
 * @throws
 */
const stopFetchingOrJustLog = (iteration, length, templateId) => {
  const message = `Fetching template bundle ${templateId} failed.`;

  if (iteration === (length - 1)) {
    throw Error(`${message} Cannot recover from this, please fix.`);
  } else {
    console.log(`${message} Will try to fetch from a fallback option.`);
  }
};

/**
 * Return the first sucessfully fetched bundle from a list of urls or throw en error if none could be fetched
 *
 * @param {Array<String>} urls
 * @returns {Promise<Response | never | void>}
 */
const fetchBundle = async (urls) => {
  const totalUrls = urls.length;
  let response;
  let bundle;


  for (let i = 0; i < totalUrls; i++) {
    // try to fetch the bundle, fails only if there's some network error. A 404 is not an error
    try {
      response = await fetch(urls[i]);
    } catch (e) {
      throw Error(`A network error ocurred while trying to fetch bundle ${urls[i]}`);
    }

    // check if we got a 2xx
    if (response && response.ok) {
      // check if what we got back looks like json and try to parse
      // if all good, then you're done
      // if it cannot parse, then fail soft or hard depending on if there's a fallback left to check
      try {
        const contentType = response.headers.has('content-type') && response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          bundle = await response.json();
          break;
        } else {
          throw Error(`Failed fetching template ${urls[i]}. Expected a JSON file and got ${contentType}`)
        }
      } catch (e) {
        stopFetchingOrJustLog(i, totalUrls, urls[i]);
      }
      // got back something that's not a 2xx
    } else {
      stopFetchingOrJustLog(i, totalUrls, urls[i]);
    }
  }

  return bundle;
};

/**
 * Fetch or if loaded just wrap it in Promise.resolve
 * @param bundles
 * @returns {Promise<*>}
 */
const promisifyBundles = bundles => bundles.map(bundle => bundle instanceof Array ? fetchBundle(bundle) : Promise.resolve(bundle));

/**
 * Register bundle templates
 *
 * @param {ItemStore} itemStore
 * @param {array} bundles
 */
const registerBundles = (itemStore, bundles = []) => bundles.map(source => itemStore.registerBundle({ source }));

/**
 *
 * @param {ItemStore} itemStore
 * @param bundlePaths {Array<Object|String>} an array of object (bundles) or paths
 * @param callback
 */
export default async (itemStore, bundlePaths = [], callback = () => {}) => {
  if (bundlePaths.length === 0) { // nothing to load
    callback && callback([]);
  }

  // Fetch or if loaded just wrap it in Promise.resolve
  const bundlePromises = promisifyBundles(bundlePaths);
  const loadedBundles = await Promise.all(bundlePromises);
  const registeredBundles = registerBundles(itemStore, loadedBundles);
  callback(registeredBundles); // TODO remove; should be deprecated
  return registeredBundles;
};
