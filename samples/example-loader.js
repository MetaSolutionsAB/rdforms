import rdfGraph from './rdf.mjs';
import templateBundle from './templateBundle.mjs';
import bundleMix from './bundleMix.js';

const graph = new rdfjson.Graph(rdfGraph);
const itemStore = new rdforms.ItemStore();

const callback = (bundles) => {
  new rdforms.Editor({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: false,
  }, 'node');
};

rdforms.bundleLoader(itemStore, bundleMix, callback);
