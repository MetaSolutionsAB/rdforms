import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js'; // import a rdfjson graph
const itemStore = new rdforms.ItemStore();

registeryDummyChooser();

const bundles = [
  ['/html/templates/dcterms.json'],
  ['/html/templates/foaf.json'],
  ['/html/templates/skos.json'],
  ['/html/templates/vcard.json'],
  ['/html/templates/adms.json'],
  ['/html/templates/dcat_props.json'],
  ['/html/templates/dcat.json'],
  ['/html/templateBundle.json']
];

const graph = new rdfjson.Graph(rdfGraph);

rdforms.bundleLoader(itemStore, bundles, function(bundles) {
  new rdforms.Editor({
    graph,
    resource: 'http://example.org/about',
    template: bundles[7].getRoot(),
    compact: false,
    includeLevel: 'optional'
  }, 'node');
});
