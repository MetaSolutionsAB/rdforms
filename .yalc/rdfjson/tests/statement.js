import Graph from '../src/Graph';
import rdf1 from './files/rdf1';

const assert = require('assert');

const [FIRST_URI, SECOND_URI] = rdf1.uris;
const [DCT_TITLE, DCT_MAKER] = rdf1.predicates;
const LITERAL_OBJECT_1 = { type: 'literal', value: 'hi' };
const LITERAL_OBJECT_2 = { type: 'literal', value: 'Hello!' };

describe('Statement', () => {
  it('should assert statement', () => {
    // create non asserted statement
    const g = new Graph({});
    const s1 = g.create(FIRST_URI, DCT_TITLE, null, false);
    assert.ok(g.find().length === 0);

    // assert statement
    s1.setAsserted(true);
    assert.ok(g.find().length === 1);
    assert.ok(g.find()[0] === s1);
  });

  it('should un-assert statement', () => {
    // create an asserted statement
    const g = new Graph({});
    const s1 = g.create(FIRST_URI, DCT_TITLE);
    assert.ok(g.find().length === 1);

    // un-assert statement
    s1.setAsserted(false);
    assert.ok(g.find().length === 0);
  });

  it('should change object value', () => {
    const g = new Graph({});
    const s1 = g.create(FIRST_URI, DCT_TITLE, LITERAL_OBJECT_1);
    assert.ok(g.find(null, null, LITERAL_OBJECT_1).length === 1);
    s1.setValue('Hello!');
    assert.ok(g.find(null, null, LITERAL_OBJECT_1).length === 0);
    assert.ok(g.find(null, null, LITERAL_OBJECT_2).length === 1);
  });

  it('should change predicate', () => {
    const g = new Graph({});
    const s1 = g.create(FIRST_URI, DCT_TITLE, LITERAL_OBJECT_1);
    assert.ok(g.find(null, DCT_TITLE).length === 1);

    s1.setPredicate(DCT_MAKER);
    assert.ok(g.find(null, DCT_TITLE).length === 0);
    assert.ok(g.find(null, DCT_MAKER).length === 1);
  });

  it('should change subject', () => {
    // create subject
    const g = new Graph({});
    const s1 = g.create(FIRST_URI, DCT_TITLE, LITERAL_OBJECT_1);
    assert.ok(g.find(FIRST_URI).length === 1);

    // change subject
    s1.setSubject(SECOND_URI);
    assert.ok(g.find(FIRST_URI).length === 0);
    assert.ok(g.find(SECOND_URI).length === 1);
  });

  it('should copy statement accross graphs', () => {
    const g1 = new Graph({});
    const s1 = g1.create(FIRST_URI, DCT_TITLE, LITERAL_OBJECT_1);
    const g2 = new Graph({});
    const s2 = g2.add(s1);
    assert.ok(s1 !== s2);
  });

  it('should remove statement from other graph', () => {
    const g1 = new Graph({});
    const s1 = g1.create(FIRST_URI, DCT_TITLE, LITERAL_OBJECT_1);
    const g2 = new Graph({});
    g1.create(FIRST_URI, DCT_TITLE, LITERAL_OBJECT_1);
    g2.remove(s1);
    assert.ok(g1.find().length === 1);
    assert.ok(g2.find().length === 0);
  });
});
