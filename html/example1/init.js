import showEditorFallbackNotice from '../editorFallbackNotice.js';

const { Graph } = rdfjson;
// Presentation-only flavors (jQuery and Vanilla) export no Editor; fall back
// to the presenter so the example renders read-only instead of throwing.
const { ItemStore, Editor, Presenter } = rdforms;
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

new (Editor || Presenter)({
  graph,
  resource: 'http://example.org/about',
  template: itemStore.createTemplateFromChildren(['ex:color']),
}, 'node');
if (!Editor) {
  showEditorFallbackNotice('node');
}
