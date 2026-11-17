// Application-supplied actions on the lookup editors: a choice object's
// actions render as icon buttons after the search button and before the
// upgrade button. Runs under the jsdom jest project.
import { act } from 'react';
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../../template/ItemStore';
import { match } from '../../../model/engine';
import renderingContext from '../../renderingContext';
// Side-effect import: installs the react renderingContext and registers the
// editors.
import '../components';
import { Editor as ReactEditor } from '../Wrappers';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const RESOURCE = 'http://example.org/r';
const VALUE = 'http://example.org/value';
const LOOKUP_PROPERTY = 'http://example.org/lookup';
const INLINE_SEARCH_PROPERTY = 'http://example.org/inlineSearch';

let choices = {};
let selectedInChooser;

// A chooser without search gives ChoiceLookup, one with search gives
// ChoiceLookupAndInlineSearch.
const registerChooser = (property, chooser) =>
  renderingContext.chooserRegistry
    .itemtype('choice')
    .predicate(property)
    .register({
      getChoice: (item, value) => choices[value] ?? { value },
      show: (binding, onSelect) => onSelect(selectedInChooser),
      ...chooser,
    });

registerChooser(LOOKUP_PROPERTY);
registerChooser(INLINE_SEARCH_PROPERTY, { search: async () => [] });

const action = (label, extra = {}) => ({
  label,
  icon: <span />,
  onClick: jest.fn(),
  ...extra,
});

const render = (property, object) => {
  const root = new ItemStore().createTemplate({
    root: 'root',
    auxilliary: [
      {
        '@id': 'root',
        '@type': 'group',
        content: [
          {
            '@type': 'choice',
            nodetype: 'URI',
            property,
            label: { en: 'Value' },
            // Renders the field even without a value
            cardinality: { pref: 1 },
          },
        ],
      },
    ],
  });
  const graph = new Graph(
    object ? { [RESOURCE]: { [property]: [object] } } : {}
  );
  const binding = match(graph, RESOURCE, root);
  const node = document.createElement('div');
  document.body.appendChild(node);
  act(() => {
    new ReactEditor({ binding, locale: 'en' }, node);
  });
  return node;
};

// Built-in buttons by their MUI icon, action buttons by their label
const buttonNames = (node) =>
  [...node.querySelectorAll('button')].map(
    (button) =>
      button.querySelector('[data-testid]')?.dataset.testid ||
      button.getAttribute('aria-label')
  );

const getButton = (node, label) =>
  node.querySelector(`button[aria-label="${label}"]`);

const getSearchButton = (node) =>
  node.querySelector('[data-testid="SearchIcon"]').closest('button');

afterEach(() => {
  choices = {};
  selectedInChooser = undefined;
  document.body.innerHTML = '';
});

describe.each([
  ['ChoiceLookup', LOOKUP_PROPERTY],
  ['ChoiceLookupAndInlineSearch', INLINE_SEARCH_PROPERTY],
])('%s actions', (editor, property) => {
  test('renders one button per action in order and calls each with the binding and field', () => {
    const first = action('First');
    const second = action('Second');
    choices[VALUE] = { value: VALUE, actions: [first, second] };
    const node = render(property, { type: 'uri', value: VALUE });

    const names = buttonNames(node);
    const searchIndex = names.indexOf('SearchIcon');
    expect(names.slice(searchIndex, searchIndex + 3)).toEqual([
      'SearchIcon',
      'First',
      'Second',
    ]);

    act(() => getButton(node, 'First').click());
    act(() => getButton(node, 'Second').click());

    const [binding, field] = first.onClick.mock.calls[0];
    expect(binding.getValue()).toBe(VALUE);
    expect(field.appendChild).toEqual(expect.any(Function));
    expect(second.onClick).toHaveBeenCalledWith(binding, field);
    expect(getButton(node, 'First').title).toBe('First');
  });

  test.each([
    ['without actions', { type: 'uri', value: VALUE }],
    ['without a value', undefined],
  ])('renders only the built-in buttons %s', (_case, object) => {
    choices[VALUE] = { value: VALUE };
    const node = render(property, object);

    const names = buttonNames(node);
    expect(names).toContain('SearchIcon');
    // Every built-in button has an MUI icon, the test actions do not
    expect(names.every((name) => name.endsWith('Icon'))).toBe(true);
  });

  test('keeps only actions enabled when read-only enabled for a named-graph value', () => {
    choices[VALUE] = {
      value: VALUE,
      actions: [
        action('Inspect', { enabledWhenReadOnly: true }),
        action('Edit'),
      ],
    };
    const node = render(property, {
      type: 'uri',
      value: VALUE,
      ng: 'http://example.org/graph',
    });

    expect(getButton(node, 'Inspect').disabled).toBe(false);
    expect(getButton(node, 'Edit').disabled).toBe(true);
    expect(getSearchButton(node).disabled).toBe(true);
  });
});

test('ChoiceLookup renders the actions of a value picked in the chooser', () => {
  selectedInChooser = { value: VALUE, actions: [action('First')] };
  const node = render(LOOKUP_PROPERTY);

  act(() => getSearchButton(node).click());

  expect(getButton(node, 'First')).not.toBeNull();
});

test('ChoiceLookupAndInlineSearch renders the actions before the upgrade button', () => {
  choices[VALUE] = {
    value: VALUE,
    actions: [action('First')],
    upgrade: () => {},
  };
  const node = render(INLINE_SEARCH_PROPERTY, { type: 'uri', value: VALUE });

  const names = buttonNames(node);
  expect(names.indexOf('First')).toBe(names.indexOf('BuildIcon') - 1);
});
