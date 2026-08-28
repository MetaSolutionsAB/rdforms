import utils from './utils';

const { getLocalizedValue, foreignLang } = utils;

describe('utils.foreignLang', () => {
  test('returns undefined when the value resolved in the page locale (exact)', () => {
    const resolved = getLocalizedValue({ sv: 'Hej', en: 'Hi' }, 'sv');
    expect(resolved.lang).toBe('sv');
    expect(foreignLang(resolved.lang, 'sv')).toBeUndefined();
  });

  test('returns the language when it fell back to the English default', () => {
    const resolved = getLocalizedValue({ en: 'Hi' }, 'sv');
    expect(resolved.precision).toBe('default');
    expect(foreignLang(resolved.lang, 'sv')).toBe('en');
  });

  test('returns the first-available language when no locale/en match (any)', () => {
    const resolved = getLocalizedValue({ de: 'Hallo' }, 'sv');
    expect(resolved.precision).toBe('any');
    expect(foreignLang(resolved.lang, 'sv')).toBe('de');
  });

  test('returns undefined when the base language matches the region locale (coarsen)', () => {
    const resolved = getLocalizedValue({ sv: 'Hej' }, 'sv_FI');
    expect(resolved.precision).toBe('coarsen');
    // sv content under an sv_FI page is the same language — no lang tag needed.
    expect(foreignLang(resolved.lang, 'sv_FI')).toBeUndefined();
  });

  test('compares base language subtags case-insensitively', () => {
    expect(foreignLang('EN', 'en')).toBeUndefined();
  });

  test('ignores region subtags on either side (hyphen or underscore)', () => {
    expect(foreignLang('de-DE', 'de')).toBeUndefined();
    expect(foreignLang('de', 'de-DE')).toBeUndefined();
    // genuinely different base languages still tag, keeping the original tag.
    expect(foreignLang('en-GB', 'sv')).toBe('en-GB');
  });

  test('returns undefined for a language-less (nolang) resolution', () => {
    const resolved = getLocalizedValue('plain', 'sv');
    expect(resolved.lang).toBe('');
    expect(foreignLang(resolved.lang, 'sv')).toBeUndefined();
  });

  test('returns undefined when nothing resolved (precision none)', () => {
    const resolved = getLocalizedValue({}, 'sv');
    expect(resolved.precision).toBe('none');
    expect(foreignLang(resolved.lang, 'sv')).toBeUndefined();
  });

  test('returns undefined for an empty or undefined language argument', () => {
    expect(foreignLang(undefined, 'sv')).toBeUndefined();
    expect(foreignLang('', 'sv')).toBeUndefined();
  });
});
