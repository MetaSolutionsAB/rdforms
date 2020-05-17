import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js';

registeryDummyChooser();

const { Graph } = rdfjson;
const { ItemStore, bundleLoader, Editor } = rdforms;
const graph = new Graph(rdfGraph);
bundleLoader(new ItemStore(), [['../templates/templateBundle.json']], (bundles) => {
  new Editor({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: false,
  }, 'node');
});
