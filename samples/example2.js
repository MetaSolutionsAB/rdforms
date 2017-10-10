require([
  'rdfjson/Graph',              //Rdfjson Graph API
  'rdforms/template/ItemStore', //Stores all the RDForm templates
  'rdforms/view/Editor',        //The editor User interface
  'rdforms/samples/rdf',         //The sample RDF
  'rdforms/samples/templateBundle',    //The sample template
  'rdforms/view/bootstrap/all',       //Depend on the bootstrap view
  'dojo/domReady!'             //Wait until the dom is ready.
], function(Graph, ItemStore, Editor, rdf, templateBundle, jquery) {
  var graph = new Graph(rdf);
  var itemStore = new ItemStore();
  var bundle = itemStore.registerBundle({source: templateBundle});
  new Editor({
    graph: graph,
    resource: "http://example.org/about",
    template: bundle.getRoot(),
    compact: false
  }, "node");
});