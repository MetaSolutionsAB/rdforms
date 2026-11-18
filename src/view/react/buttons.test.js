import { act } from 'react';
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
// Side-effect import: installs the react renderingContext and registers the
// editors and buttons.
import './components';
import { Editor as ReactEditor } from './Wrappers';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const RESOURCE = 'http://example.org/r';
const FIRST = 'http://example.org/first';
const SECOND = 'http://example.org/second';

const textItem = (id, property) => ({
  '@id': id,
  '@type': 'text',
  nodetype: 'ONLY_LITERAL',
  property,
  label: { en: id },
  cardinality: { min: 0, pref: 1 },
});

const TEMPLATE = {
  root: 'root',
  auxilliary: [
    textItem('first', FIRST),
    textItem('second', SECOND),
    {
      '@id': 'root',
      '@type': 'group',
      content: [{ id: 'first' }, { id: 'second' }],
    },
  ],
};

const renderEditor = async (graph) => {
  const root = new ItemStore().createTemplate(TEMPLATE);
  const binding = match(graph, RESOURCE, root);
  const node = document.createElement('div');
  document.body.appendChild(node);
  await act(async () => {
    new ReactEditor({ binding, locale: 'en' }, node);
  });
  return node;
};

// React tracks the input's value itself, so set it through the native setter
// for the change to reach the editor's onChange.
const typeInto = (input, value) => {
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  ).set;
  setValue.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

const inputValues = (node) =>
  [...node.querySelectorAll('input')].map((input) => input.value);

const graphValues = (graph, property) =>
  graph.find(RESOURCE, property, null).map((statement) => statement.getValue());

afterEach(() => {
  document.body.innerHTML = '';
});

describe('react clear button', () => {
  test('clears its own field after a value was added to another field', async () => {
    const graph = new Graph({
      [RESOURCE]: {
        [FIRST]: [{ value: 'a1', type: 'literal' }],
        [SECOND]: [{ value: 'b1', type: 'literal' }],
      },
    });
    const node = await renderEditor(graph);
    const [addToFirst] = node.querySelectorAll('.rdformsAddChild');
    await act(async () => addToFirst.click());
    await act(async () => typeInto(node.querySelectorAll('input')[1], 'a2'));

    const clearButtons = node.querySelectorAll('button[title="Clear"]');
    await act(async () => clearButtons[clearButtons.length - 1].click());

    expect(inputValues(node)).toEqual(['a1', 'a2', '']);
    expect(graphValues(graph, FIRST)).toEqual(['a1', 'a2']);
    expect(graphValues(graph, SECOND)).toEqual([]);
  });
});
