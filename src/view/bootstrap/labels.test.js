// Runs under the `jsdom` jest project (jest.config.cjs → src/view/**/*.test.js).
//
// Focused unit test for the RDFORMS-187 fix in the bootstrap `attachItemInfo`:
// a label is made interactive (role="button", tabindex="0", info popover) only
// when there is content that actually *resolves* for the active locale — not
// when a description map merely exists. A description key present but empty for
// the active locale (e.g. filled for 'en', empty for the active 'sv') must leave
// the label non-interactive rather than a focusable empty popover.
//
// `bootstrap/labels.js` imports only jquery/renderingContext/Editor/utils (not
// the bootstrap/select2/datepicker plugin bundle, which lives in `all.js`), so
// this exercises the gate without constructing a full flavored view. The
// interactive path calls the Bootstrap `.popover()` jQuery plugin, which is not
// loaded here, so it is stubbed.
import jquery from 'jquery';
import renderingContext from '../renderingContext';
import '../jquery/components'; // registers domSetAttr / domClassToggle
import './labels'; // overrides the no-op attachItemInfo with the bootstrap one

beforeAll(() => {
  // Bootstrap's popover plugin is not imported here; stub it so the interactive
  // path (which calls `.popover(...).attr(...)`) can run and chain.
  jquery.fn.popover = function popover() {
    return this;
  };
});

const makeItem = ({ property = null, descriptionMap = null }) => ({
  getProperty: () => property,
  getDescriptionMap: () => descriptionMap,
  getEditDescriptionMap: () => null,
  getLabelMap: () => ({ en: 'A label' }),
  getEditLabelMap: () => null,
});

// A plain (non-Editor) view object: `instanceof Editor` is false, so the
// presenter description path (getDescriptionMap) is used.
const makeContext = (locale) => ({
  view: { popupOnLabel: true, getLocale: () => locale },
});

const attach = (item, locale) => {
  const labelNode = document.createElement('span');
  renderingContext.attachItemInfo(item, labelNode, makeContext(locale));
  return labelNode;
};

describe('bootstrap attachItemInfo — locale-resolved interactivity gate (RDFORMS-187)', () => {
  test('description present but empty for the active locale → non-interactive', () => {
    const labelNode = attach(
      makeItem({ descriptionMap: { en: 'x', sv: '' } }),
      'sv'
    );
    expect(labelNode.getAttribute('role')).toBeNull();
    expect(labelNode.getAttribute('tabindex')).toBeNull();
    expect(labelNode.classList.contains('noPointer')).toBe(true);
  });

  test('description absent for the locale but resolvable via fallback → interactive', () => {
    const labelNode = attach(makeItem({ descriptionMap: { en: 'x' } }), 'sv');
    expect(labelNode.getAttribute('role')).toBe('button');
    expect(labelNode.getAttribute('tabindex')).toBe('0');
  });

  test('property with no description → interactive (a property is content)', () => {
    const labelNode = attach(
      makeItem({ property: 'http://example.org/p', descriptionMap: null }),
      'sv'
    );
    expect(labelNode.getAttribute('role')).toBe('button');
    expect(labelNode.getAttribute('tabindex')).toBe('0');
  });

  test('empty-string property with empty resolved description → non-interactive', () => {
    // Guards the gate/propinfo agreement: an empty-string property is falsy, so
    // it renders no propinfo; the gate must treat it as "no property" too, or
    // the label is a focusable empty popover again.
    const labelNode = attach(
      makeItem({ property: '', descriptionMap: { en: 'x', sv: '' } }),
      'sv'
    );
    expect(labelNode.getAttribute('role')).toBeNull();
    expect(labelNode.getAttribute('tabindex')).toBeNull();
    expect(labelNode.classList.contains('noPointer')).toBe(true);
  });
});
