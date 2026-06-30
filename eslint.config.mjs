import lintingConfig from '@entryscape/linting-config';

export default [
  ...lintingConfig,
  // Example apps, demo HTML, bundled build output, and legacy test fixtures are
  // not lint targets. samples/**/rdforms.js are ~1MB webpack bundles and
  // src/**/tests/data.js is a ~350KB fixture of generated object literals;
  // running Prettier-as-an-ESLint-rule over them is pathologically slow (it
  // hangs the lint). html/** and config/** are demo/legacy example code.
  { ignores: ['samples/**', 'html/**', 'config/**', 'src/**/tests/**'] },
];
