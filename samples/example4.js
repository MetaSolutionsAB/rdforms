import rdfGraph from './rdf.js';
const itemStore = new rdforms.ItemStore();
const graph = new rdfjson.Graph(rdfGraph);

rdforms.bundleLoader(itemStore, [['./templateBundle.json']], (bundles) => {
  new rdforms.ValidationPresenter({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: true
  }, 'node');
});
