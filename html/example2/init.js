import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js';
import showEditorFallbackNotice from '../editorFallbackNotice.js';

registeryDummyChooser();

const { Graph } = rdfjson;
// Presentation-only flavors (vanilla) export no Editor; fall back to the
// presenter so the example renders read-only instead of throwing.
const { ItemStore, bundleLoader, Editor, Presenter } = rdforms;
const graph = new Graph(rdfGraph);
bundleLoader(new ItemStore(), [['../templates/templateBundle.json']], (bundles) => {
  var editor = new (Editor || Presenter)({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: false,
    showDescription: true,
    includeLevel: 'recommended',
  }, 'node');
  if (!Editor) {
    showEditorFallbackNotice('node');
  }
  document.getElementById('buttonMissing').onclick = function() {
    editor.report();
  };
  document.getElementById('buttonMandatory').onclick = function() {
    editor.setIncludeLevel('mandatory');
  };
  document.getElementById('buttonRecommended').onclick = function() {
    editor.setIncludeLevel('recommended');
  };
});
