import registeryDummyChooser from './chooser/dummy.js';
import rdfGraph from './rdf.js'; // import a rdfjson graph
const itemStore = new rdforms.ItemStore();

registeryDummyChooser();

const bundles = [
  ['templates/dcterms.json'],
  ['templates/foaf.json'],
  ['templates/skos.json'],
  ['templates/vcard.json'],
  ['templates/adms.json'],
  ['templates/dcat_props.json'],
  ['templates/dcat.json'],
  ['templateBundle.json']
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
