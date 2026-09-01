// Runs under the `jsdom` jest project (jest.config.cjs → src/view/**/*.test.js).
//
// Focused unit test for `localizedChoice`'s `labelLang`: it exposes the language
// the choice label resolved to, so the choice editors can tag `lang` when it
// differs from the page locale (WCAG 3.1.2). The wiring that matters is that
// `labelLang` carries the *resolved language* of the shown label — not its
// value, and not a stale field — across both the presenter and editor
// (editlabel-preferring) resolutions. `localizedChoice` is a pure function, so
// this exercises it directly without rendering a component.
import { localizedChoice, editLocalizedChoice } from './hooks';

describe('localizedChoice labelLang', () => {
  test('carries the resolved language of the shown label', () => {
    const choice = localizedChoice({ value: 'x', label: { en: 'Dog' } }, false);
    // The label resolves to the English entry, so the shown text and the tagged
    // language describe the same value.
    expect(choice.label).toBe('Dog');
    expect(choice.labelLang).toBe('en');
  });

  test('is empty (falsy) for a language-less string label so nothing gets tagged', () => {
    const choice = localizedChoice({ value: 'y', label: 'Plain' }, false);
    expect(choice.label).toBe('Plain');
    // A `nolang` resolution yields '' — foreignLang treats this as "no tag".
    expect(choice.labelLang).toBe('');
  });

  test('tracks the editlabel resolution in editor mode', () => {
    const choice = editLocalizedChoice({
      value: 'z',
      label: { en: 'Dog' },
      editlabel: { de: 'Hund' },
    });
    // editLocalizedChoice prefers editlabel, so both the shown value and its
    // language must come from the editlabel map, not the presenter label.
    expect(choice.label).toBe('Hund');
    expect(choice.labelLang).toBe('de');
  });
});
