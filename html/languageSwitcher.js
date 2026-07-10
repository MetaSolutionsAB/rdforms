// Dev/example helper (NOT part of the shipped library). Adds a language <select>
// so you can flip the display locale and watch the locale-dependent rendering
// change — date/time formatting (moment), localized labels, and language-tagged
// value filtering. The chosen locale is carried in the `?lang` query param;
// localeBoot.js (compiled into the dev bundle) reads it and sets moment's locale
// before the example renders, so changing it just reloads the page.
(() => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sv', name: 'Svenska' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
  ];
  const current = new URLSearchParams(location.search).get('lang') || 'en';

  const controlBar = document.createElement('div');
  controlBar.style.margin = '0 0 1em';

  const label = document.createElement('label');
  label.appendChild(document.createTextNode('Language '));
  const select = document.createElement('select');
  languages.forEach((language) => {
    const option = document.createElement('option');
    option.value = language.code;
    option.textContent = language.name;
    option.selected = language.code === current;
    select.appendChild(option);
  });
  select.addEventListener('change', () => {
    const url = new URL(location.href);
    url.searchParams.set('lang', select.value);
    location.assign(url.href);
  });
  label.appendChild(select);
  controlBar.appendChild(label);

  const main = document.querySelector('.main') || document.body;
  const node = document.getElementById('node');
  if (node && node.parentNode) {
    node.parentNode.insertBefore(controlBar, node);
  } else {
    main.insertBefore(controlBar, main.firstChild);
  }
})();
