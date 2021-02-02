import registerChooser from '../chooser/chooser.js';
import registerDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js'; // import a rdfjson graph

registerChooser();
registerDummyChooser();

const bundles = [['../templates/dcterms.json'],
  ['../templates/foaf.json'],
  ['../templates/skos.json'],
  ['../templates/adms.json'],
  ['../templates/vcard.json'],
  ['../templates/dcat_props.json'],
  ['../templates/dcat.json']];

const { ItemStore, bundleLoader, LevelEditor } = rdforms;
const itemStore = new ItemStore();
const { Graph } = rdfjson;
const graph = new Graph(rdfGraph);

bundleLoader(itemStore, bundles, () => {
  const editor = new LevelEditor({
    compact: false,
    includeLevel: 'recommended',
  }, 'node');
  editor.show('http://example.org/about', graph, itemStore.getItem('dcat:OnlyDataset'));
});
