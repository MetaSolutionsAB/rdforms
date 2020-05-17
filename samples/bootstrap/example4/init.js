import rdfGraph from '../rdf.js';


const { Graph } = rdfjson;
const { ItemStore, bundleLoader, ValidationPresenter } = rdforms;
const graph = new Graph(rdfGraph);

bundleLoader(new ItemStore(), [['../templates/templateBundle.json']], (bundles) => {
  ValidationPresenter({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: true,
  }, 'node');
});
