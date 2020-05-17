import rdfGraph from '../rdf.js';

const { Graph } = rdfjson;
const { ItemStore, Presenter, bundleLoader } = rdforms;
const graph = new Graph(rdfGraph);

bundleLoader(new ItemStore(), [['../templates/templateBundle.json']], (bundles) => {
  Presenter({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: true,
  }, 'node');
});
