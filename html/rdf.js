/* eslint-disable */
export default {
  'http://example.org/about': {
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [{
      'value': 'http://xmlns.com/foaf/0.1/Document',
      'type': 'uri',
    }],
    'http://purl.org/dc/terms/title': [{
      'value': "Anna's Homepage",
      'type': 'literal',
      'lang': 'en',
    }, {
      'value': "Andreas Homepage",
      'type': 'literal',
      'lang': 'en',
    }],
    'http://purl.org/dc/terms/creator': [{ 'value': '_:person', 'type': 'bnode' }],
    'http://purl.org/dc/terms/subject': [{
      'value': 'http://example.com/cheeemistry',
      'type': 'uri',
    },{
      'value': 'http://example.com/physics',
      'type': 'uri',
    }],
    'http://purl.org/dc/terms/date': [{
      'value': '2019-10-06T12:28:59.685000+00:00',
      'type': 'literal',
      'datatype': 'http://www.w3.org/2001/XMLSchema#gYear'
    }],
    'http://purl.org/dc/terms/license': [{
      'value': 'http://creativecommons.org/licenses/byy/4.0/',
      'type': 'uri',
    }],
    'http://purl.org/dc/terms/relation': [{
      'value': 'http://example.com/4',
      'type': 'uri',
    }],
    'http://www.w3.org/2000/01/rdf-schema#seeAlso': [{
      'value': 'http://example.com',
      'type': 'uri',
    }],
    'http://purl.org/dc/terms/extent': [{ 'value': 'P5Y2M10DT15H', 'type': 'literal', 'datatype': 'http://www.w3.org/2001/XMLSchema#duration' }],
  },
  '_:person': {
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [{
      'value': 'http://xmlns.com/foaf/0.1/Person',
      'type': 'uri'
    }],
    'http://xmlns.com/foaf/0.1/firstName': [{ 'value': 'Anna', 'type': 'literal' }],
    'http://xmlns.com/foaf/0.1/surname': [{ 'value': 'Wilder', 'type': 'literal' }]
  },
  'http://example.org/about2': {
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [{
      'value': 'http://xmlns.com/foaf/0.1/Document',
      'type': 'uri'
    }]
  }
};
