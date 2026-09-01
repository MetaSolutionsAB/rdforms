const { Graph } = rdfjson;
// Truncation is a presentation feature (Editor.truncateAt returns -1), so this
// example always uses the Presenter — it renders in every flavor and shows how
// each one truncates:
//   - bootstrap / react / jquery: value-level — the multi-valued "Keyword"
//     property shows the first `truncateLimit` values behind a "Show more"
//     control.
//   - vanilla: row-level — the group shows the first `truncateLimit` property
//     rows, the rest behind a native "Show more" button after the <dl>.
const { ItemStore, Presenter } = rdforms;

const EX = 'http://example.org/book/';
const RESOURCE = 'http://example.org/about';

const graph = new Graph({
  [RESOURCE]: {
    [`${EX}title`]: [{ type: 'literal', value: 'The RDForms Handbook' }],
    [`${EX}keyword`]: [
      { type: 'literal', value: 'metadata' },
      { type: 'literal', value: 'RDF' },
      { type: 'literal', value: 'forms' },
      { type: 'literal', value: 'linked data' },
      { type: 'literal', value: 'semantics' },
    ],
    [`${EX}author`]: [{ type: 'literal', value: 'Ada Lovelace' }],
    [`${EX}publisher`]: [{ type: 'literal', value: 'MetaSolutions' }],
    [`${EX}year`]: [{ type: 'literal', value: '2026' }],
    [`${EX}language`]: [{ type: 'literal', value: 'English' }],
    [`${EX}isbn`]: [{ type: 'literal', value: '978-0-00-000000-0' }],
  },
});

const itemStore = new ItemStore();
const textItem = (id, property, label, extra) =>
  itemStore.createItem({
    type: 'text',
    nodetype: 'LITERAL',
    id,
    property,
    label: { en: label },
    ...extra,
  });

textItem('ex:title', `${EX}title`, 'Title');
// Multi-valued: five values, so the value-counting flavors truncate it.
textItem('ex:keyword', `${EX}keyword`, 'Keyword', {
  cardinality: { min: 0, max: 100 },
});
textItem('ex:author', `${EX}author`, 'Author');
textItem('ex:publisher', `${EX}publisher`, 'Publisher');
textItem('ex:year', `${EX}year`, 'Year');
textItem('ex:language', `${EX}language`, 'Language');
textItem('ex:isbn', `${EX}isbn`, 'ISBN');

// Seven property rows and a five-value property, with a limit of 3:
//   - value-counting flavors keep every row but truncate Keyword to 3 values;
//   - the vanilla flavor keeps every value but truncates to 3 property rows.
new Presenter(
  {
    graph,
    resource: RESOURCE,
    template: itemStore.createTemplateFromChildren([
      'ex:title',
      'ex:keyword',
      'ex:author',
      'ex:publisher',
      'ex:year',
      'ex:language',
      'ex:isbn',
    ]),
    truncate: true,
    truncateLimit: 3,
  },
  'node'
);
