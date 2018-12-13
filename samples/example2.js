import registeryDummyChooser from './chooser/dummy.js';

import rdfGraph from './rdf.js';
const itemStore = new rdforms.ItemStore();

const graph = new rdfjson.Graph(rdfGraph);
registeryDummyChooser();

rdforms.bundleLoader(itemStore, [['templateBundle.json']], function(bundles) {
  new rdforms.Editor({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: false,
  }, 'node');
});
