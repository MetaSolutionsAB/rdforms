import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js'; // import a rdfjson graph

registeryDummyChooser();

const bundles = [
  ['../templates/dcterms.json'],
  ['../templates/foaf.json'],
  ['../templates/skos.json'],
  ['../templates/vcard.json'],
  ['../templates/adms.json'],
  ['../templates/dcat_props.json'],
  ['../templates/dcat.json'],
  ['../templates/templateBundle.json'],
];

const { Graph } = rdfjson;
const { ItemStore, bundleLoader, Editor } = rdforms;

bundleLoader(new ItemStore(), bundles, (loadedBundles) => {
  Editor({
    graph: new Graph(rdfGraph),
    resource: 'http://example.org/about',
    template: loadedBundles[7].getRoot(),
    compact: false,
    includeLevel: 'optional',
  }, 'node');
});
