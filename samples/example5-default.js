import defaultBundles from './defaultBundles.js';

const itemStore = new rdforms.ItemStore();
rdforms.bundleLoader(itemStore, defaultBundles, null);

export default itemStore;
