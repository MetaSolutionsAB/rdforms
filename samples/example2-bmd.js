require([
  'rdfjson/Graph',              //Rdfjson Graph API
  'rdforms/template/ItemStore', //Stores all the RDForm templates
  'rdforms/view/Editor',        //The editor User interface
  'dojo/json',                          //Json parser
  'text!../samples/rdf.json',         //The sample RDF
  'text!../samples/templateBundle.json',    //The sample template
  'rdforms/view/bmd/all',            //Depend on the material design view
  'dojo/domReady!'             //Wait until the dom is ready.
], function(Graph, ItemStore, Editor, json, rdf, templateBundle, jquery) {
  var graph = new Graph(json.parse(rdf));
  var itemStore = new ItemStore();
  var bundle = itemStore.registerBundle({source: json.parse(templateBundle)});
  new Editor({
    graph: graph,
    resource: "http://example.org/about",
    template: bundle.getRoot(),
    compact: false
  }, "node");
});