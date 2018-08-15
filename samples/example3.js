// rdfjson and rdforms are exposed as global variables in this example
import rdfGraph from './rdf.mjs';

var graph = new rdforms.Graph(rdfGraph); // rdfjson
var itemStore = new rdforms.ItemStore();

rdforms.bundleLoader(itemStore, ['./templateBundle.js'], () => {
  new rdforms.Editor({
    graph,
    resource: 'http://example.org/about',
    template: itemStore.getItem('test'),
    compact: true
  }, 'node');
});
