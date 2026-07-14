import utils from './utils';

const { sanitizeUrl } = utils;

describe('utils.sanitizeUrl', () => {
  test('passes through allow-listed schemes unchanged', () => {
    [
      'http://example.org/x',
      'https://example.org/x?q=1#f',
      'mailto:someone@example.org',
      'tel:+46123456',
      'ftp://files.example.org/a',
    ].forEach((url) => {
      expect(sanitizeUrl(url)).toBe(url);
    });
  });

  test('allow-listed scheme detection is case-insensitive (value returned unchanged)', () => {
    expect(sanitizeUrl('HTTPS://Example.org')).toBe('HTTPS://Example.org');
    expect(sanitizeUrl('MailTo:a@b.c')).toBe('MailTo:a@b.c');
  });

  test('passes through schemeless URLs (relative, root, protocol-relative, fragment, query)', () => {
    [
      'path/to/thing',
      './relative',
      '../up',
      '/root/path',
      '//cdn.example.org/lib.js',
      '#section',
      '?query=1',
      'foo/bar:baz', // colon after a path segment is not a scheme
    ].forEach((url) => {
      expect(sanitizeUrl(url)).toBe(url);
    });
  });

  test('neutralizes dangerous schemes to #', () => {
    [
      'javascript:alert(document.cookie)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
      'blob:https://example.org/uuid',
      'file:///etc/passwd',
    ].forEach((url) => {
      expect(sanitizeUrl(url)).toBe('#');
    });
  });

  test('neutralizes obfuscated javascript: (control chars, whitespace, mixed case)', () => {
    [
      'javascript:alert(1)',
      'JavaScript:alert(1)',
      'JaVaScRiPt:alert(1)',
      '  javascript:alert(1)',
      '\tjavascript:alert(1)',
      'java\tscript:alert(1)',
      'java\nscript:alert(1)',
      'javascript:alert(1)',
    ].forEach((url) => {
      expect(sanitizeUrl(url)).toBe('#');
    });
  });

  test('returns # for empty and non-string input', () => {
    expect(sanitizeUrl('')).toBe('#');
    expect(sanitizeUrl(null)).toBe('#');
    expect(sanitizeUrl(undefined)).toBe('#');
    expect(sanitizeUrl(42)).toBe('#');
    expect(sanitizeUrl({})).toBe('#');
  });
});
