export default {
  'http://example.org/about': {
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': [{
      'value': 'http://xmlns.com/foaf/0.1/Document',
      'type': 'uri'
    }],
    'http://purl.org/dc/terms/title': [{
      'value': "Anna's Homepage",
      'type': 'literal',
      'lang': 'en'
    }],
    'http://purl.org/dc/terms/creator': [{ 'value': '_:person', 'type': 'bnode' }],
    'http://purl.org/dc/terms/subject': [{
      'value': 'http://example.com/chemistry',
      'type': 'uri'
    }],
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