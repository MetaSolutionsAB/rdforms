const graph = new rdfjson.Graph({
  'http://example.org/about': {
    'http://example.com/terms/colorOfHouse': [
      {
        type: 'uri',
        value: 'http://example.com/color/blue',
        ng: 'http://example.com',
      },
      {
        type: 'uri',
        value: 'http://example.com/color/blue',
      }],
  },
});

const itemStore = new rdforms.ItemStore();
itemStore.createItem({
  'type': 'choice',
  'nodetype': 'URI',
  'id': 'ex:color',
  'property': 'http://example.com/terms/colorOfHouse',
  'label': {'en': 'Color of house', 'sv': 'FÃ¤rg pÃ¥ huset'},
  'choices': [
    {'value': 'http://example.com/color/blue', 'label': {'en': 'Blue'}},
    {'value': 'http://example.com/color/red', 'label': {'en': 'Red'}}
  ],
  'cardinality': {'min': 1, 'pref': 1, 'max': 1}
});

new rdforms.Editor({
  graph: graph,
  resource: 'http://example.org/about',
  template: itemStore.createTemplateFromChildren(['ex:color']),
}, 'node');