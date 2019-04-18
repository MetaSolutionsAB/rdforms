import Graph from '../src/Graph';
import namespaces from '../src/namespaces';

const assert = require('assert');

const createGraph = () => {
  const graph = new Graph({});
  const list = graph.addL(null, 'rdf:first', '1').getSubject();
  graph.add('http://example.com', 'dcterms:contributor', list);
  graph.add(list, 'rdf:type', 'rdf:List');
  const s2 = graph.add(list, 'rdf:rest').getValue();
  graph.addL(s2, 'rdf:first', '2');
  graph.add(s2, 'rdf:type', 'rdf:List');
  graph.add(s2, 'rdf:rest', 'rdf:nil');
  return { list, graph };
};

describe('RDF Lists', () => {
  it('should return empty list', () => {
    const g = new Graph({});
    assert.ok(g.getList('rdf:nil').length === 0, 'Nil list must be length 0');
  });
  it('should return a list of two', () => {
    const { list, graph } = createGraph();
    const arr = graph.getList(list);
    assert.ok(arr.length === 2);
    assert.ok(arr[0].value === '1' && arr[0].type === 'literal');
    assert.ok(arr[1].value === '2' && arr[0].type === 'literal');
  });
  it('should do return a more complex list with a URI', () => {
    const g = new Graph({});
    const list = g.addList(['http://example.com', { type: 'literal', value: 'two', lang: 'en' }]);
    const arr = g.getList(list);
    const vo = arr[0];
    assert.ok(vo.value === 'http://example.com' && vo.type === 'uri');
    const vo2 = arr[1];
    assert.ok(vo2.value === 'two' && vo2.type === 'literal' && vo2.lang === 'en');
    assert.ok(arr.length === 2);
    assert.ok(g.size() === 4);
  });
  it('should do return a more complex list with literals', () => {
    const g = new Graph({});
    const list = g.addListL(['One', 'Two', 'Three'], 'en');
    const arr = g.getList(list);
    const vo = arr[0];
    assert.ok(vo.value === 'One' && vo.type === 'literal' && vo.lang === 'en');
    assert.ok(arr.length === 3);
    assert.ok(g.size() === 6);
  });
  it('should do return a more complex list with xsd:date', () => {
    const g = new Graph({});
    const list = g.addListD(['2001', '2005'], 'xsd:date');
    const arr = g.getList(list);
    const vo = arr[0];
    assert.ok(vo.value === '2001' && vo.type === 'literal' && vo.datatype === namespaces.expand('xsd:date'));
    assert.ok(arr.length === 2);
    assert.ok(g.size() === 4);
  });
  it('should remove from list', () => {
    const { list, graph } = createGraph(); // TODO @valentino use before/after
    graph.removeList(list);
    assert.ok(graph.size() === 1);
  });
  it('should find first value', () => {
    const { graph } = createGraph();
    const arr = graph.findFirstListAsValues('http://example.com', 'dcterms:contributor');
    assert.ok(arr.length === 2);
    assert.ok(arr[0] === '1');
  });
  it('should find first value and remove', () => {
    const { graph } = createGraph();
    assert.ok(graph.findAndRemoveLists('http://example.com', 'dcterms:contributor'));
    assert.ok(graph.size() === 0);
  });
});
