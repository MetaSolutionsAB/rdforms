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

  const controlBar = document.createElement('div');
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

  const main = document.querySelector('.main') || document.body;
  const node = document.getElementById('node');
  if (node && node.parentNode) {
    node.parentNode.insertBefore(controlBar, node);
  } else {
    main.insertBefore(controlBar, main.firstChild);
  }
})();
