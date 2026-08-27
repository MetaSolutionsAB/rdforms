import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js';
import showEditorFallbackNotice from '../editorFallbackNotice.js';

registeryDummyChooser();

const { Graph } = rdfjson;
// Presentation-only flavors (e.g. jQuery) export no ValidationPresenter; fall
// back to the plain presenter so the example renders read-only instead of
// throwing.
const { ItemStore, bundleLoader, ValidationPresenter, Presenter } = rdforms;
const graph = new Graph(rdfGraph);

bundleLoader(new ItemStore(), [['../templates/templateBundle.json']], (bundles) => {
  new (ValidationPresenter || Presenter)({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: false,
  }, 'node');
  if (!ValidationPresenter) {
    showEditorFallbackNotice(
      'node',
      'Read-only preview — this flavor provides no validation presenter, so the data is shown with the plain presenter instead.'
    );
  }
});
