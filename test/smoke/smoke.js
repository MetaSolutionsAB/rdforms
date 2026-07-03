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

async function checkPage(browser, flavor, example) {
  const url = `http://localhost:${PORT}/${flavor}/example${example}/`;
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return;
    }
    const text = message.text();
    // Failed subresource loads (e.g. the Roboto web font from a CDN) log as
    // console errors but are cosmetic; genuinely load-critical failures
    // (templates, rdfjson, the bundle) instead surface as a render timeout below.
    if (/Failed to load resource/i.test(text)) {
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
        return Boolean(node) && node.children.length > 0;
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

async function main() {
  const compiler = webpack(devAllConfig);
  const firstCompile = new Promise((resolve) => {
    compiler.hooks.done.tap('smoke-first-compile', () => resolve());
  });
  const server = new WebpackDevServer(
    { ...(devAllConfig.devServer || {}), port: PORT, open: false, hot: false, liveReload: false },
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
