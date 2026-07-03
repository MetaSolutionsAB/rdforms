// All-flavors dev server. Unlike webpack.dev.js (one flavor via --env type=),
// this builds every flavor bundle and serves a matrix of per-flavor example
// pages plus a top-level index. Flavors mutate the shared renderingContext
// singleton on import, so each page loads exactly ONE flavor bundle; the pages
// live under /<flavor>/example<n>/ and html/ is mounted under each /<flavor>/
// prefix so the examples' page-relative template fetches (../templates/…) and
// module imports (../rdf.js, ../chooser/*, ../editorFallbackNotice.js) resolve.
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const path = require('path');
const common = require('./webpack.common');

const flavors = ['bootstrap', 'react', 'jquery', 'vanilla'];
const editorCapableFlavors = ['bootstrap', 'react'];
const examples = [
  { number: 1, title: 'Simple Editor' },
  { number: 2, title: 'Full Editor' },
  { number: 3, title: 'Presenter' },
  { number: 4, title: 'Validation Presenter' },
  { number: 5, title: 'Building on default templates' },
  { number: 6, title: 'RDF output from editor' },
  { number: 7, title: 'Editor with registered chooser' },
  { number: 8, title: 'Editor with field-level controls' },
];

// One generated HTML page + its asset tags per (flavor, example) cell.
const pagePlugins = flavors.flatMap((flavor) =>
  examples.flatMap(({ number }) => [
    new HtmlWebpackPlugin({
      filename: `${flavor}/example${number}/index.html`,
      template: path.join(__dirname, 'html', `example${number}`, 'index.html'),
      chunks: [flavor], // inject only this flavor's bundle
      inject: true,
    }),
    new HtmlWebpackTagsPlugin({
      files: [`${flavor}/example${number}/**/*.html`],
      append: true,
      tags: [
        {
          path: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
          type: 'css',
          publicPath: false,
        },
        {
          path: '/fontawesome-free/css/all.min.css',
          type: 'css',
          publicPath: false,
        },
        {
          path: '/rdfjson/dist/rdfjson.js',
          type: 'js',
          publicPath: false,
        },
        { path: `/${flavor}/styles.css`, type: 'css', publicPath: false },
        {
          path: `/${flavor}/example${number}/init.js`,
          type: 'js',
          attributes: { type: 'module' },
          publicPath: false,
        },
        // Vanilla styling is opt-in (the bundle injects no CSS); add the dev
        // checkbox that links + toggles the standalone sheet, vanilla pages only.
        ...(flavor === 'vanilla'
          ? [{ path: `/${flavor}/vanillaCssToggle.js`, type: 'js', publicPath: false }]
          : []),
        // Example nav chrome (dev only): "← Examples" back link + the flavor
        // being viewed appended to the <h1>.
        {
          path: `/${flavor}/exampleNav.js?flavor=${flavor}`,
          type: 'js',
          publicPath: false,
        },
      ],
    }),
  ])
);

// Top-level index: a flavor × example grid linking into each cell.
const buildIndexHtml = () => {
  const headCells = flavors
    .map((flavor) => {
      const kind = editorCapableFlavors.includes(flavor)
        ? 'editor + presenter'
        : 'presentation only';
      return `<th scope="col">${flavor}<br /><small>${kind}</small></th>`;
    })
    .join('');
  const rows = examples
    .map(({ number, title }) => {
      const cells = flavors
        .map(
          (flavor) =>
            `<td><a href="/${flavor}/example${number}/">open</a></td>`
        )
        .join('');
      return `<tr><th scope="row">example${number}<br /><small>${title}</small></th>${cells}</tr>`;
    })
    .join('');
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>RDForms — all flavors × examples</title>
    <style>
      body { font-family: Roboto, system-ui, sans-serif; margin: 2rem; color: #222; }
      h1 { font-weight: 400; }
      p { color: #444; max-width: 60rem; }
      table { border-collapse: collapse; margin-top: 1rem; }
      th, td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
      thead th { background: #f4f4f4; }
      td { text-align: center; }
      small { color: #666; font-weight: 400; }
      a { color: #1565c0; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <h1>RDForms — all flavors × examples</h1>
    <p>
      Each cell loads exactly one flavor bundle. Flavors share a global rendering
      context, so only one can be active per page. Presentation-only flavors
      (jQuery, Vanilla) have no editor — editor examples fall back to a read-only
      presenter with a notice.
    </p>
    <table>
      <thead>
        <tr>
          <th scope="col">Example</th>
          ${headCells}
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
</html>`;
};

const indexPlugin = new HtmlWebpackPlugin({
  filename: 'index.html',
  templateContent: buildIndexHtml(),
  inject: false,
});

// Mount html/ at the root and under each /<flavor>/ prefix so page-relative
// asset/template paths resolve regardless of the /<flavor>/example<n>/ depth.
const flavorStaticMounts = flavors.map((flavor) => ({
  directory: path.join(__dirname, 'html'),
  publicPath: `/${flavor}`,
}));

module.exports = merge(common, {
  // Inherit common's 4-flavor entry (bootstrap/react/jquery/vanilla).
  output: { publicPath: '/' },
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [indexPlugin, ...pagePlugins],
  devServer: {
    hot: true,
    open: true,
    static: [
      ...flavorStaticMounts,
      // Serve the opt-in vanilla stylesheet from source so the toggle can link it.
      {
        directory: path.join(__dirname, 'src', 'view', 'vanilla'),
        publicPath: '/vanilla-css',
      },
      { directory: path.join(__dirname, 'node_modules', '@entryscape') },
      { directory: path.join(__dirname, 'node_modules', '@fortawesome') },
    ],
  },
});
