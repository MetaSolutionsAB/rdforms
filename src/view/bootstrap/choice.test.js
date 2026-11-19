// Application-supplied actions on the bootstrap lookup editor: a choice
// object's actions render as buttons after the search button and before the
// upgrade button, and follow the choice as it is loaded, selected, upgraded or
// cleared. Runs under the jsdom jest project.
import jquery from 'jquery';
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
import system from '../../model/system';
import renderingContext from '../renderingContext';
import Editor from '../Editor';
// Side-effect imports: install the bootstrap renderingContext and register the
// editors, with the popover plugin the field labels use.
import 'bootstrap';
import './components';
import './Select2';

/**
 * webpack loads select2 and its source modules through AMD, which jest cannot.
 * This installs select2's CommonJS build on jquery instead and takes the source
 * modules from its bundled AMD loader. A function declaration, since the
 * hoisted jest.mock factories call it before the module body runs.
 *
 * @param {string} [name] AMD module name, such as select2/data/array
 * @returns {object} the module, or an empty object for select2 itself
 */
function mockSelect2Module(name) {
  const jquery = jest.requireActual('jquery');
  if (!jquery.fn.select2) jest.requireActual('select2')(window, jquery);
  return name ? jquery.fn.select2.amd.require(name) : {};
}
jest.mock('select2', () => mockSelect2Module());
jest.mock('select2/src/js/select2/data/array', () =>
  mockSelect2Module('select2/data/array')
);
jest.mock('select2/src/js/select2/utils', () =>
  mockSelect2Module('select2/utils')
);

// The bootstrap flavor references a global `jquery` (provided by webpack's
// ProvidePlugin in the bundle); jest has no such global, so install it here.
beforeAll(() => {
  globalThis.jquery = jquery;
});

afterAll(() => {
  delete globalThis.jquery;
});

const RESOURCE = 'http://example.org/r';
const VALUE = 'http://example.org/value';
const OTHER_VALUE = 'http://example.org/other';
const LOOKUP_PROPERTY = 'http://example.org/lookup';
const INLINE_SEARCH_PROPERTY = 'http://example.org/inlineSearch';

let choices = {};
let selectedInChooser;
let searchResults = [];

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
registerChooser(INLINE_SEARCH_PROPERTY, { search: async () => searchResults });

const action = (label, extra = {}) => ({
  label,
  icon: label[0],
  onClick: jest.fn(),
  ...extra,
});

const render = (object, property = LOOKUP_PROPERTY) => {
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
  new Editor({ binding, locale: 'en' }, node);
  return node;
};

const uri = (value) => ({ type: 'uri', value });

const actionLabels = (node) =>
  [...node.querySelectorAll('.rdformsChoiceAction')].map((button) =>
    button.getAttribute('aria-label')
  );

const getButton = (node, label) =>
  node.querySelector(`button[aria-label="${label}"]`);

const getSearchButton = (node) =>
  node.querySelector('.fa-search').closest('button');

const getUpgradeButton = (node) =>
  node.querySelector('.fa-magic').closest('button');

afterEach(() => {
  choices = {};
  selectedInChooser = undefined;
  searchResults = [];
  document.body.innerHTML = '';
});

test('renders one button per action after the search button and calls each with the binding and field', () => {
  const first = action('First');
  const second = action('Second');
  choices[VALUE] = { value: VALUE, actions: [first, second] };
  const node = render(uri(VALUE));

  expect(actionLabels(node)).toEqual(['First', 'Second']);
  const firstButton = getButton(node, 'First');
  expect(firstButton.title).toBe('First');
  expect(
    getSearchButton(node).compareDocumentPosition(firstButton) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();

  firstButton.click();
  getButton(node, 'Second').click();

  const [binding, field] = first.onClick.mock.calls[0];
  expect(binding.getValue()).toBe(VALUE);
  expect(field.contains(firstButton)).toBe(true);
  expect(second.onClick).toHaveBeenCalledWith(binding, field);
});

test('shows a string icon as text and a copy of a DOM icon', () => {
  const icon = document.createElement('span');
  icon.className = 'fas fa-info-circle';
  choices[VALUE] = {
    value: VALUE,
    actions: [action('Glyph', { icon: 'ⓘ' }), action('Element', { icon })],
  };
  const node = render(uri(VALUE));

  expect(getButton(node, 'Glyph').textContent).toBe('ⓘ');
  const shown = getButton(node, 'Element').querySelector('.fa-info-circle');
  expect(shown).not.toBeNull();
  expect(shown).not.toBe(icon);
});

test.each([
  ['without actions', uri(VALUE)],
  ['without a value', undefined],
])('renders no action buttons %s', (_case, object) => {
  choices[VALUE] = { value: VALUE };
  const node = render(object);

  expect(getSearchButton(node)).not.toBeNull();
  expect(actionLabels(node)).toEqual([]);
});

test('keeps only actions enabled when read-only enabled for a named-graph value', () => {
  choices[VALUE] = {
    value: VALUE,
    actions: [action('Inspect', { enabledWhenReadOnly: true }), action('Edit')],
  };
  const node = render({ ...uri(VALUE), ng: 'http://example.org/graph' });

  expect(getButton(node, 'Inspect').disabled).toBe(false);
  expect(getButton(node, 'Edit').disabled).toBe(true);
  expect(getSearchButton(node).disabled).toBe(true);
});

test('renders the actions once the choice has loaded', () => {
  let finishLoading;
  choices[VALUE] = {
    value: VALUE,
    load: (onLoaded) => {
      finishLoading = onLoaded;
    },
  };
  const node = render(uri(VALUE));
  expect(actionLabels(node)).toEqual([]);

  choices[VALUE].actions = [action('First')];
  finishLoading();

  expect(actionLabels(node)).toEqual(['First']);
});

test('replaces the actions with those of a value picked in the chooser', () => {
  choices[VALUE] = { value: VALUE, actions: [action('Before')] };
  selectedInChooser = { value: OTHER_VALUE, actions: [action('After')] };
  const node = render(uri(VALUE));

  getSearchButton(node).click();

  expect(actionLabels(node)).toEqual(['After']);
});

test('renders the actions of a value picked in the inline search', async () => {
  searchResults = [{ value: VALUE, actions: [action('First')] }];
  const node = render(undefined, INLINE_SEARCH_PROPERTY);

  jest.useFakeTimers();
  jquery(node).find('select').select2('open');
  // Past the search delay, then let the search promise resolve
  jest.advanceTimersByTime(300);
  jest.useRealTimers();
  await Promise.resolve();
  jquery('.select2-results__option[role="treeitem"]').trigger('mouseup');

  expect(actionLabels(node)).toEqual(['First']);
});

test('renders the actions before the upgrade button and replaces them on upgrade', () => {
  choices[VALUE] = {
    value: VALUE,
    actions: [action('Before')],
    load: (onLoaded) => onLoaded(),
    upgrade: (binding, onUpgrade) =>
      onUpgrade({ value: VALUE, actions: [action('After')] }),
  };
  const node = render(uri(VALUE));

  expect(actionLabels(node)).toEqual(['Before']);
  expect(getButton(node, 'Before').parentElement.nextElementSibling).toBe(
    getUpgradeButton(node)
  );

  getUpgradeButton(node).click();

  expect(actionLabels(node)).toEqual(['After']);
  expect(node.querySelector('.fa-magic')).toBeNull();
});

test.each([
  ['', {}],
  [
    ' while it can be upgraded',
    { load: (onLoaded) => onLoaded(), upgrade: () => {} },
  ],
])('removes the actions when the value is cleared%s', (_case, extra) => {
  choices[VALUE] = { value: VALUE, actions: [action('First')], ...extra };
  const node = render(uri(VALUE));
  expect(actionLabels(node)).toEqual(['First']);

  node.querySelector('.rdformsFieldControl .fa-times').click();

  expect(actionLabels(node)).toEqual([]);
});

test('removes the previous actions while a value picked in the chooser loads', () => {
  let finishLoading;
  choices[VALUE] = { value: VALUE, actions: [action('Before')] };
  selectedInChooser = {
    value: OTHER_VALUE,
    actions: [action('After')],
    load: (onLoaded) => {
      finishLoading = onLoaded;
    },
  };
  const node = render(uri(VALUE));

  getSearchButton(node).click();
  expect(actionLabels(node)).toEqual([]);

  finishLoading();
  expect(actionLabels(node)).toEqual(['After']);
});

test('lets drag and drop target the field', () => {
  jest.spyOn(system, 'hasDnDSupport').mockReturnValue(true);
  const addDnD = jest.spyOn(system, 'addDnD');
  const node = render();

  const [, dropNode] = addDnD.mock.calls[0];
  expect(dropNode.contains(node.querySelector('select'))).toBe(true);
});
