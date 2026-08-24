import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js'; // import a rdfjson graph
import showEditorFallbackNotice from '../editorFallbackNotice.js';

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
// Presentation-only flavors (jQuery and Vanilla) export no Editor; fall back
// to the presenter so the example renders read-only instead of throwing.
const { ItemStore, bundleLoader, Editor, Presenter } = rdforms;

bundleLoader(new ItemStore(), bundles, (loadedBundles) => {
  new (Editor || Presenter)({
    graph: new Graph(rdfGraph),
    resource: 'http://example.org/about',
    template: loadedBundles[7].getRoot(),
    compact: false,
    includeLevel: 'optional',
  }, 'node');
  if (!Editor) {
    showEditorFallbackNotice('node');
  }
});
