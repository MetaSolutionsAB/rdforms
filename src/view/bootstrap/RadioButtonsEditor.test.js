// Runs under the `jsdom` jest project (jest.config.cjs → src/view/**/*.test.js).
//
// Pins the choice-label `lang` tagging in the bootstrap radio-button editor: a
// visible choice label whose value resolves to a language other than the page
// locale is wrapped in a `<span lang="…">` (WCAG 3.1.2 Language of Parts), a
// label that resolves in the page locale gets no span, and an empty-resolving
// label emits no span at all (never an empty lang-carrying node).
//
// The editor references a global `jquery` (provided by webpack's ProvidePlugin
// in the bundle); jest has no such global, so it is installed here. Only real
// leaf dependencies are exercised — label resolution runs through the actual
// `utils.getLocalizedValue`/`utils.foreignLang`, not a stub.
import jquery from 'jquery';
import utils from '../../utils';
import RadioButtonsEditor from './RadioButtonsEditor';

beforeAll(() => {
  globalThis.jquery = jquery;
});

afterAll(() => {
  delete globalThis.jquery;
});

// Minimal item/binding fakes carrying only what the editor reads. Label
// resolution is wired to the real helper so the test asserts against genuine
// fallback behaviour.
const makeItem = (labelHash) => ({
  getChoices: () => [{ label: labelHash, value: 'value-1' }],
  hasStyle: () => false,
  _getLocalizedValue: utils.getLocalizedValue,
});

const makeBinding = (item) => ({
  getItem: () => item,
  getChoice: () => null,
  getValue: () => undefined,
  getStatement: () => null,
  getParent: () => ({ getStatement: () => null }),
});

const renderLabel = (labelHash, pageLocale) => {
  const item = makeItem(labelHash);
  const domNode = document.createElement('div');
  new RadioButtonsEditor(
    {
      binding: makeBinding(item),
      context: { view: { getLocale: () => pageLocale } },
    },
    domNode
  );
  return jquery(domNode).find('label');
};

describe('bootstrap RadioButtonsEditor — choice-label lang tagging', () => {
  test('label resolving to a foreign language → span[lang] wraps the text', () => {
    const $label = renderLabel({ en: 'English label' }, 'sv');
    const $span = $label.find('span[lang]');
    expect($span.length).toBe(1);
    expect($span.attr('lang')).toBe('en');
    expect($span.text()).toBe('English label');
  });

  test('label resolving in the page locale → no span[lang]', () => {
    const $label = renderLabel({ sv: 'Svensk etikett' }, 'sv');
    expect($label.find('span[lang]').length).toBe(0);
    expect($label.text()).toContain('Svensk etikett');
  });

  test('empty foreign-resolving label → no span[lang] emitted', () => {
    const $label = renderLabel({ en: '' }, 'sv');
    expect($label.find('span[lang]').length).toBe(0);
  });
});
