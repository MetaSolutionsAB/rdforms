import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js';

registeryDummyChooser();

const { Graph } = rdfjson;
const { ItemStore, Presenter, bundleLoader } = rdforms;
const graph = new Graph(rdfGraph);

bundleLoader(new ItemStore(), [['../templates/templateBundle.json']], (bundles) => {
  new Presenter({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    filterTranslations: false,
    showLanguage: true,
    showDescription: true,
    compact: true,
  }, 'node');
});
