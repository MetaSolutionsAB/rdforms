import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js'; // import a rdfjson graph
import showEditorFallbackNotice from '../editorFallbackNotice.js';

const bundles = [
  ['../templates/dcterms.json'],
  ['../templates/foaf.json'],
  ['../templates/skos.json'],
  ['../templates/adms.json'],
  ['../templates/vcard.json'],
  ['../templates/dcat_props.json'],
  ['../templates/dcat.json'],
  ['../templates/templateBundle.json'],
];

registeryDummyChooser();

const { Graph } = rdfjson;
// Presentation-only flavors (vanilla) export no Editor; fall back to the
// presenter so the example renders read-only instead of throwing.
const { ItemStore, bundleLoader, Editor, Presenter } = rdforms;
const itemStore = new ItemStore();
const graph = new Graph(rdfGraph);
bundleLoader(itemStore, bundles, () => {
  new (Editor || Presenter)({
    graph,
    resource: 'http://example.org/about',
    template: itemStore.getItem('test'),
    compact: false,
    includeLevel: 'optional',
  }, 'node');
  if (!Editor) {
    showEditorFallbackNotice('node');
  }
  const ta = document.getElementById('output');
  const updateOutput = () => {
    // Export RDF/XML
    ta.value = rdfjson.converters.rdfjson2rdfxml(graph);

    // Export RDF/JSON
    // ta.value = JSON.stringify(graph.exportRDFJSON(), null, "  ");
  };
  updateOutput();
  graph.onChange = updateOutput;
});
