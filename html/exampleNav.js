// Dev/example helper (NOT shipped). Adds navigation chrome to each example page:
// a "← Examples" link back to the index, and the flavor being viewed appended to
// the <h1>. The flavor comes from a `?flavor=` query on this script's own src
// (set by the dev config), falling back to the /<flavor>/ URL segment used by
// the dev:all matrix.
(() => {
  const knownFlavors = ['bootstrap', 'react', 'jquery', 'vanilla'];

  let flavor = '';
  const scriptTag = document.querySelector('script[src*="exampleNav.js"]');
  if (scriptTag) {
    try {
      flavor =
        new URL(scriptTag.src, location.href).searchParams.get('flavor') || '';
    } catch (error) {
      // A relative or malformed src can't be parsed as a URL; that's expected —
      // fall through to URL-path detection below rather than failing.
      flavor = '';
    }
  }
  if (!flavor) {
    const firstSegment = location.pathname.split('/').filter(Boolean)[0];
    if (knownFlavors.includes(firstSegment)) {
      flavor = firstSegment;
    }
  }

  const main = document.querySelector('.main') || document.body;

  // "← Examples" back link at the top of the page (index lives at / in both the
  // single-flavor dev server and the dev:all matrix).
  if (main && !main.querySelector('.rdforms-example-nav')) {
    const nav = document.createElement('nav');
    nav.className = 'rdforms-example-nav';
    nav.style.margin = '0 0 1em';
    const backLink = document.createElement('a');
    backLink.href = '/';
    backLink.textContent = '← Examples';
    nav.appendChild(backLink);
    main.insertBefore(nav, main.firstChild);
  }

  // Append the flavor to the heading.
  if (flavor) {
    const heading = main.querySelector('h1') || document.querySelector('h1');
    if (heading && !heading.dataset.flavorLabelled) {
      heading.textContent = `${heading.textContent} (${flavor})`;
      heading.dataset.flavorLabelled = 'true';
    }
  }
})();
