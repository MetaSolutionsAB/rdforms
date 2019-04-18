import Graph from '../src/Graph';
import Statement from '../src/Statement';
import rdf1 from './files/rdf1';

const assert = require('assert');

describe('Graph Manipulate', () => {
  it('add a statement', () => {
    const g = new Graph({});
    const s1 = g.create(rdf1.uris[0], rdf1.predicates[0]);
    assert.ok(s1 instanceof Statement);
  });

  it('addingStatementObjectBNode', () => {
    const g = new Graph({});
    const s1 = g.create(rdf1.uris[0], rdf1.predicates[0]);
    assert.ok(s1 instanceof Statement);
  });

  it('addingStatementSubjectBNode', () => {
    const g = new Graph({});
    const s1 = g.create(undefined, rdf1.predicates[0], { type: 'literal', value: 'hepp' });
    assert.ok(s1 instanceof Statement);
  });

  it('bnodeStatementsDifferObjectPosition', () => {
    const g = new Graph({});
    const s1 = g.create(rdf1.uris[0], rdf1.predicates[0]);
    assert.ok(s1 instanceof Statement);
    const s2 = g.create(rdf1.uris[0], rdf1.predicates[0]);
    assert.ok(s1 !== s2);

  });

  it('bnodeStatementsDifferSubjectPosition', () => {
    const g = new Graph({});
    const s1 = g.create(undefined, rdf1.predicates[0], { type: 'literal', value: 'hepp' });
    assert.ok(s1 instanceof Statement);
    const s2 = g.create(undefined, rdf1.predicates[0], { type: 'literal', value: 'hepp' });
    assert.ok(s1 !== s2);
  });

  it('createNonAssertedStatement', () => {
    const g = new Graph({});
    g.create(rdf1.uris[0], rdf1.predicates[0], undefined, false);
    assert.ok(g.find().length === 0);
  });

  it('duplicatStatementDetected', () => {
    const g = new Graph({});
    const s1 = g.create(rdf1.uris[0], rdf1.predicates[0], { type: 'literal', value: 'hepp' });
    const s2 = g.create(rdf1.uris[0], rdf1.predicates[0], { type: 'literal', value: 'hepp' });
    assert.ok(s1 === s2);
  });

  it('removingStatement', () => {
    const g = new Graph({});
    const s1 = g.create(rdf1.uris[0], rdf1.predicates[0], { type: 'literal', value: 'hepp' });
    assert.ok(g.find().length === 1);
    g.remove(s1);
    assert.ok(g.find().length === 0);

  });

  it('replaceURI', () => {
    const g = new Graph();
    g.add(rdf1.uris[0], rdf1.predicates[0], { type: 'literal', value: 'hepp' });
    g.add(rdf1.uris[2], rdf1.predicates[0], rdf1.uris[0]);
    g.replaceURI(rdf1.uris[0], rdf1.uris[1]);
    assert.ok(g.find(rdf1.uris[0]).length === 0);
    assert.ok(g.find(rdf1.uris[1]).length === 1);
    assert.ok(g.find(rdf1.uris[1])[0].getSubject() === rdf1.uris[1]);
    assert.ok(g.find(rdf1.uris[2])[0].getValue() === rdf1.uris[1]);
  });

  it('mergeGraph', () => {
    const g1 = new Graph();
    const g2 = new Graph();
    g1.addL('_:1', rdf1.predicates[0], 'one');
    g2.addL('_:1', rdf1.predicates[1], 'two');
    g2.addL('_:1', rdf1.predicates[1], 'three');
    g1.addAll(g2);
    assert.ok(g1.find().length === 3, 'Merged graph should contain 3 statements');
    assert.ok(g1.find('_:1').length === 1, 'Conflict of blank nodes in merge');
    const stmts = g1.find(null, rdf1.predicates[1]);
    assert.ok(stmts.length === 2, 'Predicates have changed during merge');
    assert.ok(stmts[0].getSubject() === stmts[1].getSubject(), 'Statements subjects with original ' +
      'same blank node are no longer same');
  });
});
