import converters from '../src/formats/converters';
import RDFS from '../src/Rdfs';

const assert = require('assert');
const fs = require('fs');

let graph;
const rdfs = new RDFS();
const { rdfxml2graph } = converters;

describe('Statement', () => {
  beforeEach((done) => {
    fs.readFile('./files/dcterms.rdf', 'utf8', (err, data) => {
      graph = rdfxml2graph(data);
      rdfs.addGraph(graph);
      done();
    });
  });

  it('should find no rdfs classes', () => {
    assert.ok(rdfs.getClasses().length > 0, 'Found no classes!');
  });

  it('should find no rdfs properties', () => {
    const cls = rdfs.getClass('http://purl.org/dc/terms/MediaTypeOrExtent');
    assert.ok(cls != null, 'No class found.');
    assert.ok(cls.getLabel().length > 0, 'No label found.');
    assert.ok(cls.getComment().length > 0, 'No comment found');
    assert.ok(cls.getChildren().length > 0, 'No Children found');
  });

  it('should find not rdfs class', () => {
    const cls = rdfs.getClass('http://purl.org/dc/terms/MediaTypeOrExtent');
    assert.ok(cls != null, 'No class found.');
    assert.ok(cls.getLabel().length > 0, 'No label found.');
    assert.ok(cls.getComment().length > 0, 'No comment found');
    assert.ok(cls.getChildren().length > 0, 'No Children found');
  });

  it('should find no rdfs property', () => {
    const prop = rdfs.getProperty('http://purl.org/dc/terms/relation');
    assert.ok(prop != null, 'No property found.');
    assert.ok(prop.getLabel().length > 0, 'No label found.');
    assert.ok(prop.getComment().length > 0, 'No comment found');
    assert.ok(prop.getChildren().length > 0, 'No Children found');
  });

});
