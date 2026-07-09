const path = require('path');

// Single source of truth for which root-level html/ assets ship into a built
// sample. The example init.js files are copied raw (never bundled) and loaded
// as native ES modules, so anything they import at runtime — e.g.
// editorFallbackNotice.js — must be physically present in the output. Listing
// the rule here (instead of enumerating each file in webpack.samples.js) means
// a new shared helper ships automatically rather than silently 404-ing, which
// is the regression that broke build:samples in RDFORMS-163.

const htmlDir = path.resolve(__dirname, 'html');

// Root-level html/ scripts the built samples must NOT ship: these are injected
// only by the dev servers (webpack.dev.js / webpack.dev-all.js) as page chrome
// — the "← Examples" back link + flavor label, and the vanilla CSS on/off
// toggle. No sample page references them, so copying them would be dead weight.
const devOnlyRootScripts = ['exampleNav.js', 'vanillaCssToggle.js'];

// The copy rule the samples build applies for shared root-level scripts:
// every html/*.js except the dev-only chrome above.
const sharedRootScripts = {
  from: '*.js',
  context: htmlDir,
  globOptions: {
    ignore: devOnlyRootScripts.map((name) => `**/${name}`),
  },
};

module.exports = { htmlDir, devOnlyRootScripts, sharedRootScripts };
