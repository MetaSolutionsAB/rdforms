import rdfGraph from './rdf.js';
import templateBundle from './templateBundle.js';

const graph = new rdfjson.Graph(rdfGraph);
const itemStore = new rdforms.ItemStore();
const bundle = itemStore.registerBundle({source: templateBundle});
new rdforms.Editor({
  graph,
  resource: 'http://example.org/about',
  template: bundle.getRoot(),
  compact: false,
}, 'node');
