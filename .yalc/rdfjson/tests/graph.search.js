import Graph from '../src/Graph';
import Statement from '../src/Statement';
import rdf1 from './files/rdf1';
const assert = require("assert");

describe('Graph Manipulate', () => {
  it('should find subject', () => {
    const g = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const r = g.find('http://example.org/about');
    assert.ok(r.length === 5);
    assert.ok(r[0] instanceof Statement);
  });

  it('should find predicate', () => {
    const g = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const r = g.find(undefined, 'http://xmlns.com/foaf/0.1/nick');
    assert.ok(r.length === 3);
    assert.ok(r[0] instanceof Statement);
  });

  it('should find object', () => {
    const g = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const r = g.find(undefined, undefined, { value: 'http://example.org/about', type: 'uri' });
    assert.ok(r.length === 3);
    assert.ok(r[0] instanceof Statement);
  });

  it('should find subject and predicate', () => {
    const g = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const r = g.find('http://example.org/about', 'http://xmlns.com/foaf/0.1/nick');
    assert.ok(r.length === 1);
    assert.ok(r[0] instanceof Statement);
  });

  it('should find subject and object', () => {
    const g = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const r = g.find('_:person', undefined, { value: 'http://example.org/about', type: 'uri' });
    assert.ok(r.length === 2);
    assert.ok(r[0] instanceof Statement);
  });

  it('should find predicate and object', () => {
    const g = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const r = g.find(undefined, 'http://purl.org/dc/terms/related', {
      value: 'http://example.org/about',
      type: 'uri',
    });
    assert.ok(r.length === 1);
    assert.ok(r[0] instanceof Statement);
  });

  it('should find subject, predicate and object', () => {
    const g = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const r = g.find('http://example.org/about', 'http://purl.org/dc/terms/related', {
      value: 'http://example.org/about',
      type: 'uri',
    });
    assert.ok(r.length === 1);
    assert.ok(r[0] instanceof Statement);
  });
});
