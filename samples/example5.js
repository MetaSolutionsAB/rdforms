import rdfGraph from './rdf.js'; // import a rdfjson graph
const itemStore = new rdforms.ItemStore();

const bundles = [
  ['templates/dcterms.json'],
  ['templates/foaf.json'],
  ['templateBundle.json']
];

const graph = new rdfjson.Graph(rdfGraph);

rdforms.bundleLoader(itemStore, bundles, (bundles) => {
  new rdforms.Editor({
    graph,
    resource: 'http://example.org/about',
    template: bundles[2].getRoot(), // root of templateBundle
    compact: false,
  }, 'node');
});
