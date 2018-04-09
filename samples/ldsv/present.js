require([
  'rdfjson/Graph',                     // Rdfjson Graph API
  'rdforms/template/ItemStore',        // Stores all the RDForm templates
  'rdforms/template/bundleLoader',
  'rdforms/view/Editor',               // The editor User interface
  'rdforms/view/Presenter',               // The editor User interface
  'rdforms/samples/ldsv/graphs/LeonardoDaVinci',               // The sample RDF
  'jquery',
  'rdforms/view/bmd/all',              // Depend on the material design view
  './chooser.js',
  'dojo/domReady!',                    // Wait until the dom is ready.
], (Graph, ItemStore, bundleLoader, Editor, Presenter, rdf, jquery) => {

  jquery.material.init();

  jquery('#renderGraph').on('click', function () {
    const graphText = jquery('#graphTextarea').val();
    const graph = new Graph(JSON.parse(graphText), false);

    // if all good,
    jquery('#graphForm').hide();

    const itemStore = new ItemStore();
    const bundles = [
      'templates/rdfs/rdfs',
      'templates/foaf/foaf',
      'templates/vcard/vcard',
      'templates/dcterms/dcterms',
      'templates/dbp/dbpo-properties',
      'templates/dbp/dbo-merge',
    ];

    const daVinciResource = 'http://dbpedia.org/resource/Leonardo_da_Vinci';
    bundleLoader(itemStore, bundles, () => {
      new Presenter({
        graph,
        resource: daVinciResource,
        template: itemStore.getItem('dbo:Person'),
        compact: false,
      }, 'node');
    });
  })
});
