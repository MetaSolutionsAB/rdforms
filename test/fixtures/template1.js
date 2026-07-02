// Template fixture for the model/template tests.
//
// ItemStore.createTemplate() expects `root` to be the *id* of an item registered
// in `auxilliary`/`templates`; an inline root object resolves to undefined via
// Bundle.getRoot() -> ItemStore.getItem(). This fixture defines the root inline,
// so the normalization at the bottom registers it in `auxilliary` and references
// it by @id.

const template1Source = {
  label: { en: 'Bibliography', sv: 'Bibliografi' },
  description: {
    en: 'Some nice information about books',
    sv: 'Lite trevlig bokinformation',
  },
  root: {
    '@type': 'group',
    '@id': 'http://example.ch/books/book',
    label: { en: 'Book' },
    constraints: {
      'http://www.w3.org/TR/rdf-schema/type':
        'http://xmlns.com/foaf/0.1/Document',
    },
    nodetype: 'RESOURCE',
    content: [
      { '@id': 'http://example.ch/people.sirff#author' },
      {
        '@type': 'text',
        label: { en: 'Title' },
        nodetype: 'LANGUAGE_LITERAL',
        property: 'http://purl.org/dc/terms/title',
        cardinality: { min: 2, pref: 4, max: 5 },
      },
      { '@id': 'publisheddate' },
      { '@id': 'subjectVocab' },
      { '@id': 'http://example.ch/people.sirff#contribution' },
    ],
  },
  auxilliary: [
    {
      '@id': 'publisheddate',
      '@type': 'text',
      label: { en: 'Published' },
      description: { en: 'The date this book was first published' },
      cardinality: { min: 0, pref: 1, max: 1 },
      nodetype: 'DATATYPE_LITERAL',
      datatype: 'http://www.w3.org/2001/XMLSchema.xsd#date',
      property: 'http://purl.org/dc/terms/date',
    },
    {
      '@id': 'subjectVocab',
      '@type': 'choice',
      label: { en: 'Subject' },
      description: { en: "The book's subject" },
      nodetype: 'RESOURCE',
      constraints: {
        'http://www.w3.org/2004/02/skos/core#inScheme':
          'http://example.com/bookSubjects',
      },
      ontologyUrl: 'http://example.com/bookOntology',
      property: 'http://purl.org/dc/terms/subject',
      cardinality: { min: 0, pref: 1, max: 1 },
      parentProperty: 'http://something.se/doh',
      hierarchyProperty: 'http://something.se/doh',
    },
    {
      '@id': 'http://example.ch/people.sirff#author',
      '@type': 'group',
      label: { en: 'Author' },
      description: { en: 'The author of the book' },
      property: 'http://purl.org/dc/terms/publisher',
      cardinality: { min: 0, max: 5 },
      constraints: {
        'http://www.w3.org/TR/rdf-schema/type':
          'http://xmlns.com/foaf/0.1/Person',
      },
      nodetype: 'RESOURCE',
      cls: ['rdformsTable'],
      content: [
        {
          '@type': 'text',
          property: 'http://xmlns.com/foaf/0.1/firstName',
          label: { en: 'First name' },
          nodetype: 'ONLY_LITERAL',
        },
        {
          '@type': 'text',
          property: 'http://xmlns.com/foaf/0.1/surname',
          label: { en: 'Surname' },
          nodetype: 'ONLY_LITERAL',
        },
      ],
    },
    {
      '@id': 'http://example.ch/people.sirff#contribution',
      '@type': 'propertygroup',
      label: { en: 'Contribution' },
      description: { en: 'A person who has contributed' },
      content: [
        {
          '@type': 'choice',
          label: { en: 'Type' },
          cardinality: { min: 0, max: 1 },
          description: { en: 'Type of contribution' },
          nodetype: 'RESOURCE',
          constraints: {
            'http://www.w3.org/2004/02/skos/core#inScheme':
              'http://example.com/authorPredicates',
          },
          ontologyUrl: 'http://example.com/DCOntology',
        },
        { '@id': 'http://example.ch/people.sirff#author' },
      ],
    },
  ],
  ontologies: ['http://example.ru/library.rdf'],
  cachedChoices: {
    'http://example.com/bookOntology': [
      {
        constraints: {
          'http://www.w3.org/2004/02/skos/core#inScheme':
            'http://example.com/bookSubjects',
        },
        parentProperty: 'http://something.se/doh',
        hierarchyProperty: 'http://something.se/doh',
        isParentPropertyInverted: false,
        isHierarchyPropertyInverted: false,
        choices: [
          {
            top: true,
            value: 'http://example.com/instanceTop',
            selectable: false,
            label: { sv: 'Toppen', en: 'Ze top!' },
            children: [
              { _reference: 'http://example.com/instance1' },
              { _reference: 'http://example.com/instance2' },
            ],
          },
          {
            value: 'http://example.com/instance1',
            label: { sv: 'Matematik', en: 'Mathematics' },
            description: {
              sv: 'Matematik är ett coolt ämne',
              en: 'Mathematics is a cool subject',
            },
          },
          {
            value: 'http://example.com/instance2',
            label: { sv: 'Kemi', en: 'Chemistry' },
          },
        ],
      },
    ],
    'http://example.com/DCOntology': [
      {
        constraints: {
          'http://www.w3.org/2004/02/skos/core#inScheme':
            'http://example.com/authorPredicates',
        },
        choices: [
          {
            value: 'http://purl.org/dc/terms/creator',
            label: { sv: 'Skapare', en: 'Creator' },
          },
          {
            value: 'http://purl.org/dc/terms/contributor',
            label: { sv: 'Bidragare', en: 'Contributor' },
          },
        ],
      },
    ],
  },
};

// Normalize the inline root to the supported `root`-as-id shape: register the
// root group object via `auxilliary` and reference it by its @id.
const rootObject = template1Source.root;

export default {
  ...template1Source,
  root: rootObject['@id'],
  auxilliary: [rootObject, ...template1Source.auxilliary],
};
