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

const { ItemStore, bundleLoader, Editor } = rdforms;
const itemStore = new ItemStore();
const { Graph } = rdfjson;
const graph = new Graph(rdfGraph);

bundleLoader(itemStore, bundles, () => {
  new Editor({
    graph,
    resource: 'http://example.org/about',
    template: itemStore.getItem('dcat:OnlyDataset'),
    compact: false,
    includeLevel: 'optional',
  }, 'node');
  const ta = document.getElementById('output');
  const updateOutput = () => {
    // Export RDF/XML
    ta.value = rdfjson.converters.rdfjson2rdfxml(new Graph(graph.exportRDFJSON()));

    // Export RDF/JSON
    // ta.value = JSON.stringify(graph.exportRDFJSON(), null, "  ");
  };
  updateOutput();
  graph.onChange = updateOutput;
});
