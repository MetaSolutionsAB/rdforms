// Headless smoke test for the examples matrix. Starts the all-flavors dev
// server (webpack.dev-all.js) in-process on a dedicated port and, for every
// flavor × example page, asserts that it renders into #node with no uncaught
// exceptions and no application console errors. Local-only (not wired into CI).
//
// Prerequisite (once): pnpm exec playwright install chromium
// Run: pnpm test:smoke
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { chromium } = require('playwright');
const devAllConfig = require('../../webpack.dev-all.js');

const PORT = 8099;
const flavors = ['bootstrap', 'react', 'jquery', 'vanilla'];
const examples = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Load one flavor × example page and report whether it rendered a real value
 * with no uncaught exceptions and no application console errors.
 *
 * @param {import('playwright').Browser} browser the shared browser instance
 * @param {string} flavor the flavor URL segment (bootstrap/react/jquery/vanilla)
 * @param {number} example the example number
 * @returns {Promise<{flavor: string, example: number, ok: boolean, errors: string[]}>} the per-cell result
 */
async function checkPage(browser, flavor, example) {
  const url = `http://localhost:${PORT}/${flavor}/example${example}/`;
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return;
    }
    const text = message.text();
    // Failed subresource loads log as console errors; ignore ONLY the cosmetic
    // CDN assets (Roboto web font, FontAwesome). Load-critical failures
    // (templates, rdfjson, the flavor bundle) must still fail the run — do not
    // filter them (they usually also surface as the render timeout below).
    if (
      /Failed to load resource/i.test(text) &&
      /fonts\.googleapis\.com|fontawesome|roboto/i.test(text)
    ) {
      return;
    }
    errors.push(text);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

  let rendered = false;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(
      () => {
        const node = document.getElementById('node');
        if (!node) {
          return false;
        }
        // Assert a real *value* rendered — not just the group scaffolding.
        // `node.children.length > 0` is satisfied by the <dl>/<dt> (vanilla) or
        // row/label (other flavors) structure alone, so it passed even when no
        // item presenter ran. Leaf value containers carry `rdforms-value`
        // (vanilla) or `rdformsField` (base View — jquery/bootstrap/react);
        // group containers are excluded on purpose, since their nested scaffold
        // has children even when the leaf presenter is missing.
        const values = node.querySelectorAll('.rdforms-value, .rdformsField');
        return Array.from(values).some(
          (element) =>
            element.textContent.trim().length > 0 ||
            element.querySelector('img') != null
        );
      },
      { timeout: 15000 }
    );
    rendered = true;
  } catch (renderError) {
    errors.push(`render: ${renderError.message}`);
  }
  // Let any late async work (template loading, choice resolution) surface errors.
  await page.waitForTimeout(300);
  await page.close();

  return { flavor, example, ok: rendered && errors.length === 0, errors };
}

/**
 * Print the flavor × example result grid and list any failing cells.
 *
 * @param {Array<{flavor: string, example: number, ok: boolean, errors: string[]}>} results the per-cell results
 * @returns {number} the number of failing cells
 */
function report(results) {
  const columnWidth = 12;
  const pad = (text) => String(text).padEnd(columnWidth);
  console.log(['', ...flavors].map(pad).join(''));
  for (const example of examples) {
    const row = [`example${example}`];
    for (const flavor of flavors) {
      const result = results.find(
        (entry) => entry.flavor === flavor && entry.example === example
      );
      row.push(result.ok ? '✓' : '✗');
    }
    console.log(row.map(pad).join(''));
  }

  const failed = results.filter((entry) => !entry.ok);
  if (failed.length > 0) {
    console.log(`\n${failed.length} failing cell(s):`);
    for (const entry of failed) {
      console.log(`  ${entry.flavor}/example${entry.example}`);
      for (const error of entry.errors) {
        console.log(`    - ${error}`);
      }
    }
  } else {
    console.log(`\nAll ${results.length} flavor × example cells passed.`);
  }
  return failed.length;
}

/**
 * Start the all-flavors dev server in-process, check every flavor × example
 * cell, and exit non-zero if any cell failed.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const compiler = webpack(devAllConfig);
  const firstCompile = new Promise((resolve) => {
    compiler.hooks.done.tap('smoke-first-compile', () => resolve());
  });
  const server = new WebpackDevServer(
    {
      ...(devAllConfig.devServer || {}),
      port: PORT,
      open: false,
      hot: false,
      liveReload: false,
    },
    compiler
  );

  await server.start();
  await firstCompile;

  const browser = await chromium.launch();
  const results = [];
  try {
    for (const flavor of flavors) {
      for (const example of examples) {
        results.push(await checkPage(browser, flavor, example));
      }
    }
  } finally {
    await browser.close();
    await server.stop();
  }

  const failedCount = report(results);
  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
