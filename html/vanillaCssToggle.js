// Dev/example helper (NOT part of the shipped library). The vanilla flavor's
// stylesheet is opt-in — the bundle injects no CSS — so this script links the
// standalone sheet and adds a checkbox to toggle it on/off. Flipping it shows
// the difference between the minimal styled output (e.g. language-tagged values
// gain a "(en)" suffix) and the raw semantic HTML on browser default styles.
(() => {
  const link = document.createElement('link');
  link.id = 'rdforms-vanilla-css';
  link.rel = 'stylesheet';
  link.href = '/vanilla-css/vanilla.css';
  document.head.appendChild(link);

  // Its own block so the example's own layout can't reposition it.
  const controlBar = document.createElement('div');
  controlBar.className = 'rdforms-vanilla-css-toggle';
  controlBar.style.margin = '0 0 1em';

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.addEventListener('change', () => {
    link.disabled = !checkbox.checked;
  });
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(' Basic vanilla CSS'));
  controlBar.appendChild(label);

  // Anchor the checkbox directly under the page's <h1> title, as its next
  // sibling. This keeps it in the same (block) context as the heading — always
  // just below the title — no matter how the example lays out its own content
  // (flex two-column examples, nested .col1 wrappers, a deep #node, etc.).
  // Inserting relative to #node instead pulled the control into the example's
  // column/flex layout or above the title on the nested-layout examples.
  const heading = document.querySelector('h1');
  if (heading && heading.parentNode) {
    heading.parentNode.insertBefore(controlBar, heading.nextSibling);
  } else {
    const fallback =
      document.querySelector('.main, .container-fluid') || document.body;
    fallback.insertBefore(controlBar, fallback.firstChild);
  }
})();
