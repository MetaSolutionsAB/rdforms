import rdfGraph from './rdf.mjs';
import templateBundle from './templateBundle.mjs';

const graph = new rdforms.Graph(rdfGraph);

const itemStore = new rdforms.ItemStore();
const bundle = itemStore.registerBundle({source: templateBundle});
new rdforms.Editor({
  graph,
  resource: 'http://example.org/about',
  template: bundle.getRoot(),
  compact: false,
}, 'node');