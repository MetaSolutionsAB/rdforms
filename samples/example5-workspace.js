import rdfGraph from './rdf.js'; // import a rdfjson graph
import itemStore from './example5-default.js';

const graph = new rdfjson.Graph(rdfGraph);
const templateBundle = [['./templateBundle.json']]

const callback = (bundles) => {
  new rdforms.Editor({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: false,
  }, 'node');
};

rdforms.bundleLoader(itemStore, templateBundle, callback);
