// rdfjson and rdforms are exposed as global variables in this example
import rdfGraph from './rdf.mjs';

const graph = new rdfjson.Graph(rdfGraph);
const itemStore = new rdforms.ItemStore();

rdforms.bundleLoader(itemStore, ['./templateBundle.json'], () => {
  new rdforms.Editor({
    graph,
    resource: 'http://example.org/about',
    template: itemStore.getItem('test'),
    compact: true
  }, 'node');
});
