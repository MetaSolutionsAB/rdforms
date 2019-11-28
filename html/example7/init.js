import rdfGraph from '../rdf.js'; // import a rdfjson graph
import registerChooser from '../chooser/chooser.js';
import registerDummyChooser from '../chooser/dummy.js';
const itemStore = new rdforms.ItemStore();

registerChooser();
registerDummyChooser();

const bundles = [
  ['/html/templates/dcterms.json'],
  ['/html/templates/foaf.json'],
  ['/html/templates/skos.json'],
  ['/html/templates/adms.json'],
  ['/html/templates/vcard.json'],
  ['/html/templates/dcat_props.json'],
  ['/html/templates/dcat.json'],
];

const graph = new rdfjson.Graph(rdfGraph);

rdforms.bundleLoader(itemStore, bundles, function(bundles) {
  new rdforms.Editor({
    graph,
    resource: 'http://example.org/about',
    template: itemStore.getItem('dcat:OnlyDataset'),
    compact: false,
    includeLevel: 'optional'
  }, 'node');
  var ta = document.getElementById('output');
  var updateOutput = function() {
    // Export RDF/XML
    ta.value = rdfjson.converters.rdfjson2rdfxml(graph);

    // Export RDF/JSON
    // ta.value = JSON.stringify(graph.exportRDFJSON(), null, "  ");
  };
  updateOutput();
  graph.onChange = updateOutput;
});



