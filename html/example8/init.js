import registerChooser from '../chooser/chooser.js';
import registerDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js'; // import a rdfjson graph
import showEditorFallbackNotice from '../editorFallbackNotice.js';

registerChooser();
registerDummyChooser();

const bundles = [['../templates/dcterms.json'],
  ['../templates/foaf.json'],
  ['../templates/skos.json'],
  ['../templates/adms.json'],
  ['../templates/vcard.json'],
  ['../templates/dcat_props.json'],
  ['../templates/dcat.json']];

// Only the bootstrap flavor ships a LevelEditor; every other flavor (React,
// jQuery, Vanilla) falls back to the presenter so the example renders read-only
// instead of throwing.
const { ItemStore, bundleLoader, LevelEditor, Presenter } = rdforms;
const itemStore = new ItemStore();
const { Graph } = rdfjson;
const graph = new Graph(rdfGraph);

bundleLoader(itemStore, bundles, () => {
  const resource = 'http://example.org/about';
  const template = itemStore.getItem('dcat:OnlyDataset');
  if (LevelEditor) {
    const editor = new LevelEditor({
      compact: false,
      includeLevel: 'recommended',
    }, 'node');
    editor.show(resource, graph, template);
  } else {
    new Presenter({ graph, resource, template, compact: false }, 'node');
    showEditorFallbackNotice('node');
  }
});
