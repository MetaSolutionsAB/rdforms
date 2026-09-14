// Reading-order for the react text presenter: the value must come before the
// visible language indicator in the DOM so the reading order matches the visual
// order (WCAG 1.3.2 Meaningful Sequence), with the value node carrying a native
// `lang` attribute. Runs under the jsdom jest project.
import { act } from 'react';
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
// Side-effect import: installs the react renderingContext and registers the
// semantic presenters.
import './components';
import { Presenter as ReactPresenter } from './Wrappers';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

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
  document.body.appendChild(node);
  act(() => {
    new ReactPresenter({ binding, locale: 'en', ...viewParams }, node);
  });
  return node;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('react text presenter language ordering', () => {
  test('emits the value before the language indicator, value tagged with lang', () => {
    const node = render();
    const language = node.querySelector('.rdformsLanguage');
    // The value span carries the native `lang`; locale-filtered to en.
    const value = node.querySelector('[lang="en"]');

    expect(value).not.toBeNull();
    expect(language).not.toBeNull();
    expect(value.textContent).toBe('Hi');
    expect(language.textContent).toBe('en');
    // The value must precede the indicator in document (reading) order.
    expect(
      value.compareDocumentPosition(language) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  test('showLanguage:false drops the indicator but keeps the lang attribute', () => {
    const node = render({ showLanguage: false });
    expect(node.querySelector('.rdformsLanguage')).toBeNull();
    expect(node.querySelector('[lang="en"]')).not.toBeNull();
  });
});
