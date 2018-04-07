require([
  'rdfjson/Graph',                     // Rdfjson Graph API
  'rdforms/template/ItemStore',        // Stores all the RDForm templates
  'rdforms/template/bundleLoader',
  'rdforms/view/Editor',               // The editor User interface
  'rdforms/samples/ldsv/graphs/LeonardoDaVinci',               // The sample RDF
  'jquery',
  'rdforms/view/bmd/all',              // Depend on the material design view
  './chooser.js',
  'dojo/domReady!',                    // Wait until the dom is ready.
], (Graph, ItemStore, bundleLoader, Editor, rdf, jquery) => {

  jquery.material.init();

  const prepareGraphs = (ng) => {
    const externalGraph = new Graph(rdf);
    const internalGraph = new Graph();

    internalGraph.addAll(externalGraph, ng);

    return internalGraph;
  }

  const daVinciResource = 'http://dbpedia.org/resource/Leonardo_da_Vinci';
  const graph = prepareGraphs(daVinciResource);

  const itemStore = new ItemStore();
  const bundles = [
    'templates/rdfs/rdfs',
    'templates/foaf/foaf',
    'templates/vcard/vcard',
    'templates/dcterms/dcterms',
    'templates/dbp/dbpo-properties',
    'templates/dbp/dbo-merge',
  ];

  bundleLoader(itemStore, bundles, () => {
    new Editor({
      graph,
      resource: daVinciResource,
      template: itemStore.getItem('dbo:Person'),
      compact: false,
    }, 'node');
  });
});
