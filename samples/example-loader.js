import rdfGraph from './rdf.js';
import templateBundle from './templateBundle.js';
import bundleMix from './bundleMix.js';

const itemStore = new rdforms.ItemStore();
//
// const callback = (bundles) => {
//   new rdforms.Editor({
//     graph,
//     resource: 'http://example.org/about',
//     template: bundles[0].getRoot(),
//     compact: false,
//   }, 'node');
// };

rdforms.bundleLoader(itemStore, bundleDefault, null);
// rdforms.bundleLoader(itemStore, bundleMo, callback);
