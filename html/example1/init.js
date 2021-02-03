const { Graph } = rdfjson;
const { ItemStore, Editor } = rdforms;
const graph = new Graph({
  'http://example.org/about': {
    'http://example.com/terms/colorOfHouse': [
      {
        type: 'uri',
        value: 'http://example.com/color/blue',
      }],
  },
});

const itemStore = new ItemStore();
itemStore.createItem({
  'type': 'choice',
  'nodetype': 'URI',
  'id': 'ex:color',
  'property': 'http://example.com/terms/colorOfHouse',
  'label': { 'en': 'Color of house', 'sv': 'Färg på huset' },
  'choices': [
    { 'value': 'http://example.com/color/blue', 'label': { 'en': 'Blue' } },
    { 'value': 'http://example.com/color/red', 'label': { 'en': 'Red' } }
  ],
  'cardinality': { 'min': 1, 'pref': 1, 'max': 1 }
});

new Editor({
  graph,
  resource: 'http://example.org/about',
  template: itemStore.createTemplateFromChildren(['ex:color']),
}, 'node');
