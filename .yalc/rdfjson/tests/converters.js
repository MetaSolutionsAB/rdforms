import converters from '../src/formats/converters';
import rdf1 from './files/rdf1';

const assert = require('assert');

const { rdfxml2graph } = converters;

describe('Converters', () => {
  it('rdfxml2graph', () => {
    const g = rdfxml2graph(rdf1.rdfxml);
    assert.equal(g.find().length, 14);
  });
});
