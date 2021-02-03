import registeryDummyChooser from '../chooser/dummy.js';
import rdfGraph from '../rdf.js';

registeryDummyChooser();

const { Graph } = rdfjson;
const { ItemStore, bundleLoader, Editor } = rdforms;
const graph = new Graph(rdfGraph);
bundleLoader(new ItemStore(), [['../templates/templateBundle.json']], (bundles) => {
  var editor = new Editor({
    graph,
    resource: 'http://example.org/about',
    template: bundles[0].getRoot(),
    compact: false,
  }, 'node');
  document.getElementById('buttonMissing').onclick = function() {
    editor.report();
  };
  document.getElementById('buttonMandatory').onclick = function() {
    editor.setIncludeLevel('mandatory');
  };
});
