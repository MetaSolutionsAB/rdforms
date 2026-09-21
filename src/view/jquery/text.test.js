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

// A label item that is the first child of a group whose value is a URI renders
// the value as a link (`<a class="rdformsUrl">`) instead of a plain `<div>`. The
// anchor is the value node, so it must also carry `rdformsValue`.
const SEEALSO = 'http://www.w3.org/2000/01/rdf-schema#seeAlso';
const TARGET = 'http://example.org/linked';

const linkTemplate = () => ({
  root: 'root',
  auxilliary: [
    { '@id': 'root', '@type': 'group', content: ['linkGroup'] },
    {
      '@id': 'linkGroup',
      '@type': 'group',
      property: SEEALSO,
      content: ['linkLabel'],
    },
    {
      '@id': 'linkLabel',
      '@type': 'text',
      nodetype: 'LANGUAGE_LITERAL',
      property: TITLE,
      label: { en: 'Title' },
      styles: ['label'],
    },
  ],
});

const LINK_GRAPH = {
  [RESOURCE]: { [SEEALSO]: [{ value: TARGET, type: 'uri' }] },
  [TARGET]: { [TITLE]: [{ value: 'Linked', type: 'literal', lang: 'en' }] },
};

const renderLink = () => {
  const root = new ItemStore().createTemplate(linkTemplate());
  const binding = match(new Graph(LINK_GRAPH), RESOURCE, root);
  const node = document.createElement('div');
  new Presenter({ binding, locale: 'en' }, node);
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
    // Value and indicator share one flex-row wrapper.
    expect(value.parentNode).toBe(language.parentNode);
    const wrapper = value.parentNode;
    expect(wrapper.classList.contains('rdformsWithLanguage')).toBe(true);
    // The wrapper is a dedicated child of the field, not the field itself, so a
    // validation message appended to the field stays a block below the row
    // instead of joining it as a third flex item.
    expect(wrapper.classList.contains('rdformsField')).toBe(false);
    const field = node.querySelector('.rdformsField');
    expect(field).not.toBeNull();
    expect(field.contains(wrapper)).toBe(true);
  });

  test('showLanguage:false drops the indicator but keeps the lang attribute', () => {
    const node = render({ showLanguage: false });
    expect(node.querySelector('.rdformsLanguage')).toBeNull();
    const value = node.querySelector('.rdformsValue');
    expect(value.getAttribute('lang')).toBe('en');
  });

  test('the label-as-link value branch tags the anchor rdformsValue, before the indicator', () => {
    const node = renderLink();
    const anchor = node.querySelector('a.rdformsUrl');
    const language = node.querySelector('.rdformsLanguage');

    // Assert we actually hit the link branch, not the plain-div branch.
    expect(anchor).not.toBeNull();
    expect(language).not.toBeNull();
    // The anchor is the value node: it must carry rdformsValue (so the flex rule
    // applies) and the native lang, and precede the indicator in reading order.
    expect(anchor.classList.contains('rdformsValue')).toBe(true);
    expect(anchor.getAttribute('lang')).toBe('en');
    expect(anchor.textContent).toBe('Linked');
    expect(language.textContent).toBe('en');
    expect(
      anchor.compareDocumentPosition(language) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    const wrapper = anchor.parentNode;
    expect(wrapper.classList.contains('rdformsWithLanguage')).toBe(true);
    // The wrapper is a dedicated element, not the field container itself.
    expect(wrapper.classList.contains('rdformsField')).toBe(false);
  });
});
