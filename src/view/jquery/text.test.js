// Reading-order for the jquery text presenter: the value must come before the
// visible language indicator in the DOM so the reading order matches the visual
// order (WCAG 1.3.2 Meaningful Sequence), with the value node carrying a native
// `lang` attribute. Runs under the jsdom jest project.
import jquery from 'jquery';
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
import Presenter from '../Presenter';
// Side-effect import: installs the jquery renderingContext and registers the
// semantic presenters (CSS is stubbed by test/styleMock.cjs).
import './all';

// The jquery flavor references a global `jquery` (provided by webpack's
// ProvidePlugin in the bundle); jest has no such global, so install it here.
beforeAll(() => {
  globalThis.jquery = jquery;
});

afterAll(() => {
  delete globalThis.jquery;
});

const RESOURCE = 'http://example.org/r';
const TITLE = 'http://purl.org/dc/terms/title';

const template = (...children) => ({
  root: 'root',
  auxilliary: [{ '@id': 'root', '@type': 'group', content: children }],
});

const languageItem = () => ({
  '@type': 'text',
  nodetype: 'LANGUAGE_LITERAL',
  property: TITLE,
  label: { en: 'Title' },
});

const GRAPH = {
  [RESOURCE]: {
    [TITLE]: [
      { value: 'Hi', type: 'literal', lang: 'en' },
      { value: 'Hej', type: 'literal', lang: 'sv' },
    ],
  },
};

const render = (viewParams = {}) => {
  const root = new ItemStore().createTemplate(template(languageItem()));
  const binding = match(new Graph(GRAPH), RESOURCE, root);
  const node = document.createElement('div');
  new Presenter({ binding, locale: 'en', ...viewParams }, node);
  return node;
};

describe('jquery text presenter language ordering', () => {
  test('emits the value before the language indicator, value tagged with lang', () => {
    const node = render();
    const value = node.querySelector('.rdformsValue');
    const language = node.querySelector('.rdformsLanguage');

    expect(value).not.toBeNull();
    expect(language).not.toBeNull();
    // Locale-filtered to en: the shown value is the English one, tagged `lang`.
    expect(value.getAttribute('lang')).toBe('en');
    expect(value.textContent).toBe('Hi');
    expect(language.textContent).toBe('en');
    // The value must precede the indicator in document (reading) order.
    expect(
      value.compareDocumentPosition(language) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    // Both live in the field container, which opts into the flex layout.
    expect(value.parentNode).toBe(language.parentNode);
    expect(value.parentNode.classList.contains('rdformsWithLanguage')).toBe(
      true
    );
  });

  test('showLanguage:false drops the indicator but keeps the lang attribute', () => {
    const node = render({ showLanguage: false });
    expect(node.querySelector('.rdformsLanguage')).toBeNull();
    const value = node.querySelector('.rdformsValue');
    expect(value.getAttribute('lang')).toBe('en');
  });
});
