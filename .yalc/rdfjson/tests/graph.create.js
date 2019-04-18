import Graph from '../src/Graph';
import rdf1 from './files/rdf1';

const assert = require('assert');

describe('Graph Create', () => {
  it('should create an empty graph', () => {
    const g = new Graph();
    assert.ok(g.isEmpty());
  });

  it('should create a graph from object empty graph', () => {
    const g = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    assert.equal(g.find().length, 14);
    assert.ok(!g.isEmpty());
  });
});
