// The shared @entryscape/linting-config ships three flat configs: the default
// (`base`: JS + JSDoc + prettier, browser globals, NO JSX parser), `node`
// (base + Node globals) and `react` (base + the @babel/eslint-parser JSX setup
// + react/jsx-a11y rules). rdforms has React views, so we use the `react`
// export — the default `base` does not parse JSX and silently leaves the whole
// src/view/react tree unlinted.
import { react } from '@entryscape/linting-config';
import globals from 'globals';

export default [
  ...react,
  {
    // Node/CommonJS globals for the build tooling and the node entry point —
    // these files aren't covered by the shared config's browser default.
    files: ['webpack.*.js', 'main.node.js', 'html.assets.js', '**/*.cjs'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // jQuery ($, jQuery, jquery) is injected build-wide by webpack's
    // ProvidePlugin (see webpack.common.js), so the view code uses it as a
    // runtime global rather than importing it — mirror that here.
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: { $: 'readonly', jQuery: 'readonly', jquery: 'readonly' },
    },
  },
  {
    // rdforms is a template-driven library without a PropTypes convention;
    // enforcing prop-types would mean adding declarations across every
    // component for little value. Disable it to match the codebase's approach.
    files: ['**/*.js', '**/*.jsx'],
    rules: { 'react/prop-types': 'off' },
  },
  {
    // Local-only Playwright smoke harness — a CommonJS Node script, not a
    // browser ES module. Node globals + CommonJS source type so require/process
    // resolve, and drop import/extensions (require() paths keep the .js suffix).
    files: ['test/smoke/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: { 'import/extensions': 'off' },
  },
  // Example apps, demo HTML, bundled build output, and legacy test fixtures are
  // not lint targets. samples/**/rdforms.js are ~1MB webpack bundles and
  // src/**/tests/data.js is a ~350KB fixture of generated object literals;
  // running Prettier-as-an-ESLint-rule over them is pathologically slow (it
  // hangs the lint). html/** and config/** are demo/legacy example code.
  { ignores: ['samples/**', 'html/**', 'config/**', 'src/**/tests/**'] },
];
