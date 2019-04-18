import Graph from '../src/Graph';
import { fingerprint } from '../src/utils';
import rdf1 from './files/rdf1';

const assert = require('assert');

describe('Statement', () => {
  it('should assert fingerprint', () => {
    const g1 = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const fp1 = fingerprint(g1);
    g1.add(rdf1.uris[0], 'dcterms:subject', 'http://example.com');
    const fp2 = fingerprint(g1);
    assert.ok(fp1 !== fp2, 'Same fingerprint for different graphs!');
  });

  it('should assert fingerprint', () => {
    const g1 = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const fp1 = fingerprint(g1);
    g1.add(rdf1.uris[0], 'dcterms:subject', 'http://example.com');
    const fp2 = fingerprint(g1);
    assert.ok(fp1 !== fp2, 'Same fingerprint for different graphs!');
  });

  it('should assert isomorphic fingerprint', () => {
    const g1 = new Graph();
    const g2 = new Graph();
    g1.addL(null, 'foaf:name', 'John');
    g2.addL(null, 'foaf:name', 'John');
    const f1 = fingerprint(g1);
    const f2 = fingerprint(g2);
    assert.ok(f1 === f2,
      'Isomorphic graphs have different fingerprints! ' +
      'Blank node names should not make a difference!');
  });

  it('should assert fingerprint exclude properties', () => {
    const g1 = new Graph(JSON.parse(JSON.stringify(rdf1.graph)));
    const fp1 = fingerprint(g1);
    g1.add(rdf1.uris[0], 'dcterms:subject', 'http://example.com');
    const fp2 = fingerprint(g1, ['dcterms:subject']);
    assert.ok(fp1 === fp2, 'Exclude properties does not work');
  });

  it('should assert fingerprint blanck separation', () => {
    const g1 = new Graph();
    const g2 = new Graph();
    const stmt1 = g1.addL(null, 'foaf:name', 'John');
    g1.add(stmt1.getSubject(), 'foaf:homepage', 'http://example.com');
    g1.add(null, 'foaf:name', 'Eric');

    const stmt2 = g2.addL(null, 'foaf:name', 'Eric');
    g2.add(stmt2.getSubject(), 'foaf:homepage', 'http://example.com');
    g2.add(null, 'foaf:name', 'John');
    assert.ok(fingerprint(g1) !== fingerprint(g2),
      'Graphs same, blank nodes mixed up');

  });

  it('should fail fingerprint', () => {
    const g1 = new Graph();
    let b1 = g1.addL(null, 'foaf:name', 'John').getSubject();
    let b2 = g1.add(b1, 'foaf:knows').getValue();
    let b3 = g1.add(b2, 'foaf:knows').getValue();
    g1.addL(b3, 'foaf:name', 'Eric');
    let b4 = g1.addL(null, 'foaf:name', 'Anna').getSubject();
    let b5 = g1.add(b4, 'foaf:knows').getValue();
    let b6 = g1.add(b5, 'foaf:knows').getValue();
    g1.addL(b6, 'foaf:name', 'Linda');

    const g2 = new Graph();
    b1 = g2.addL(null, 'foaf:name', 'John').getSubject();
    b2 = g2.add(b1, 'foaf:knows').getValue();
    b3 = g2.add(b2, 'foaf:knows').getValue();
    g2.addL(b3, 'foaf:name', 'Linda');
    b4 = g2.addL(null, 'foaf:name', 'Anna').getSubject();
    b5 = g2.add(b4, 'foaf:knows').getValue();
    b6 = g2.add(b5, 'foaf:knows').getValue();
    g2.addL(b6, 'foaf:name', 'Eric');

    assert.ok(fingerprint(g1) === fingerprint(g2),
      'Fingerprint cannot distinguish between these two graphs, something is wrong.');
  });
});
