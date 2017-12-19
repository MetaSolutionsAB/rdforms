require([
  'rdfjson/Graph',                     // Rdfjson Graph API
  'rdforms/template/ItemStore',        // Stores all the RDForm templates
  'rdforms/view/Editor',               // The editor User interface
  'rdforms/samples/rdf',               // The sample RDF
  'rdforms/samples/templateBundle',    // The sample template
  'jquery',
  'rdforms/view/bmd/all',              // Depend on the material design view
  'rdforms/samples/chooser',           // Dummy chooser
  'dojo/domReady!',                    // Wait until the dom is ready.
], (Graph, ItemStore, Editor, rdf, templateBundle, jquery) => {
  jquery.material.init();
  const graph = new Graph(rdf);
  const itemStore = new ItemStore();
  const bundle = itemStore.registerBundle({ source: templateBundle });
  new Editor({
    graph,
    resource: 'http://example.org/about',
    template: bundle.getRoot(),
    compact: false,
  }, 'node');
});
