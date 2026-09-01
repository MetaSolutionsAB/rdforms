// Runs under the `jsdom` jest project (jest.config.cjs → src/view/**/*.test.js).
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
import { VanillaPresenter } from './all';
import template1 from '../../../test/fixtures/template1';
import { graph2 } from '../../../test/fixtures/rdfjson';

const renderTemplate1 = () => {
  const itemStore = new ItemStore();
  const templateRoot = itemStore.createTemplate(template1);
  const graph = new Graph(graph2);
  const binding = match(graph, 'http://example.org/about', templateRoot);
  const node = document.createElement('div');
  // Constructing the view renders it into `node`.
  new VanillaPresenter({ binding, locale: 'en' }, node);
  return node;
};

const renderHeadingTemplate = () => {
  const templateRoot = new ItemStore().createTemplate({
    root: 'root',
    auxilliary: [
      { '@id': 'root', '@type': 'group', content: ['personGroup'] },
      {
        '@id': 'personGroup',
        '@type': 'group',
        styles: ['heading'],
        label: { en: 'Person' },
        content: ['nameText'],
      },
      {
        '@id': 'nameText',
        '@type': 'text',
        nodetype: 'LITERAL',
        property: 'http://xmlns.com/foaf/0.1/name',
        label: { en: 'Name' },
      },
    ],
  });
  const graph = new Graph({
    'http://example.org/p': {
      'http://xmlns.com/foaf/0.1/name': [{ value: 'Ada', type: 'literal' }],
    },
  });
  const binding = match(graph, 'http://example.org/p', templateRoot);
  const node = document.createElement('div');
  new VanillaPresenter({ binding, locale: 'en' }, node);
  return node;
};

describe('VanillaPresenter — dl/dt/dd structural seam', () => {
  test('renders a group as <dl class="rdforms-group"> with <dt> and <dd>', () => {
    const node = renderTemplate1();
    const list = node.querySelector('dl.rdforms-group');
    expect(list).not.toBeNull();
    expect(list.querySelectorAll('dt.rdforms-label').length).toBeGreaterThan(0);
    expect(list.querySelectorAll('dd').length).toBeGreaterThan(0);
  });

  test('emits no nested-div (rdformsRow/rdformsField) structure', () => {
    const node = renderTemplate1();
    expect(node.querySelector('.rdformsRow')).toBeNull();
    expect(node.querySelector('.rdformsField')).toBeNull();
  });

  test('renders the matched title value into a <dd> (locale-filtered)', () => {
    const node = renderTemplate1();
    // filterTranslations keeps only the best match for locale 'en'.
    expect(node.textContent).toContain("Anna's Homepage");
    expect(node.textContent).not.toContain('Anna hemsida');
  });

  test('a nested group renders a nested <dl> inside a <dd>', () => {
    const node = renderTemplate1();
    // The Contribution property-group nests a person group → dl inside a dd.
    const nested = node.querySelector(
      'dd.rdforms-group-value dl.rdforms-group'
    );
    expect(nested).not.toBeNull();
    // And the nested list lives inside the outer one.
    expect(
      node.querySelectorAll('dl.rdforms-group dl.rdforms-group').length
    ).toBeGreaterThan(0);
  });

  test('a table-styled group renders a semantic <table>', () => {
    const node = renderTemplate1();
    const table = node.querySelector('table.rdforms-table');
    expect(table).not.toBeNull();
    expect(table.querySelector('caption')).not.toBeNull();
    const headers = table.querySelectorAll('thead th[scope="col"]');
    expect(headers.length).toBe(2); // First name, Surname
    const bodyRow = table.querySelector('tbody tr');
    expect(bodyRow).not.toBeNull();
    expect(bodyRow.textContent).toContain('Anna');
    expect(bodyRow.textContent).toContain('Wilder');
  });

  test('a choice value renders as a labelled link', () => {
    const node = renderTemplate1();
    const link = node.querySelector('dd.rdforms-value a.rdforms-link');
    expect(link).not.toBeNull();
    expect(link.textContent).toBe('Mathematics');
    expect(link.getAttribute('href')).toBe('http://example.com/instance1');
  });

  test('a language literal is tagged with lang', () => {
    const node = renderTemplate1();
    const titleValue = Array.from(
      node.querySelectorAll('dd.rdforms-value')
    ).find((dd) => dd.getAttribute('lang') === 'en');
    expect(titleValue).not.toBeNull();
    expect(titleValue.textContent).toContain("Anna's Homepage");
  });

  test('a heading-styled group renders a <section> with an <h2>', () => {
    const node = renderHeadingTemplate();
    const section = node.querySelector('section.rdforms-section');
    expect(section).not.toBeNull();
    const heading = section.querySelector('h2.rdforms-heading');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Person');
    // its content (the name) still renders below the heading
    expect(section.textContent).toContain('Ada');
  });

  test('the root node uses the rdforms-presenter class by default', () => {
    const node = renderTemplate1();
    expect(node.classList.contains('rdforms-presenter')).toBe(true);
  });

  test('a consumer-supplied styleCls is honored on the root node', () => {
    const templateRoot = new ItemStore().createTemplate(template1);
    const binding = match(
      new Graph(graph2),
      'http://example.org/about',
      templateRoot
    );
    const node = document.createElement('div');
    new VanillaPresenter(
      { binding, locale: 'en', styleCls: 'my-presenter' },
      node
    );
    expect(node.classList.contains('my-presenter')).toBe(true);
    expect(node.classList.contains('rdforms-presenter')).toBe(false);
  });
});

const NAME = 'http://xmlns.com/foaf/0.1/name';
const NICK = 'http://xmlns.com/foaf/0.1/nick';
const HOMEPAGE = 'http://xmlns.com/foaf/0.1/homepage';

// Three property rows, limit 2 → Name + Alias shown, Homepage held as overflow.
// The node is attached to document.body so jsdom focus()/activeElement work.
const renderTruncated = () => {
  const templateRoot = new ItemStore().createTemplate({
    root: 'root',
    auxilliary: [
      { '@id': 'root', '@type': 'group', content: ['n', 'a', 'h'] },
      {
        '@id': 'n',
        '@type': 'text',
        nodetype: 'LITERAL',
        property: NAME,
        label: { en: 'Name' },
      },
      {
        '@id': 'a',
        '@type': 'text',
        nodetype: 'LITERAL',
        property: NICK,
        label: { en: 'Alias' },
        cardinality: { min: 0, pref: 1, max: 3 },
      },
      {
        '@id': 'h',
        '@type': 'text',
        nodetype: 'URI',
        property: HOMEPAGE,
        label: { en: 'Homepage' },
      },
    ],
  });
  const graph = new Graph({
    'http://example.org/p': {
      [NAME]: [{ value: 'Ada', type: 'literal' }],
      [NICK]: [
        { value: 'Ada', type: 'literal' },
        { value: 'Ida', type: 'literal' },
      ],
      [HOMEPAGE]: [{ value: 'http://example.org/', type: 'uri' }],
    },
  });
  const binding = match(graph, 'http://example.org/p', templateRoot);
  const node = document.createElement('div');
  document.body.appendChild(node);
  new VanillaPresenter(
    { binding, locale: 'en', truncate: true, truncateLimit: 2 },
    node
  );
  return node;
};

const labelsIn = (node) =>
  Array.from(node.querySelectorAll('dt.rdforms-label')).map(
    (dt) => dt.textContent
  );

describe('VanillaPresenter — row-level truncation toggle', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('initial render shows only the rows within the limit + a collapsed Show more button after the dl', () => {
    const node = renderTruncated();
    expect(labelsIn(node)).toEqual(['Name', 'Alias']);
    // Overflow row (Homepage) is held out of the DOM entirely.
    expect(node.textContent).not.toContain('http://example.org/');
    const button = node.querySelector('button.rdforms-show-more');
    expect(button).not.toBeNull();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.textContent).toBe('Show more');
    // The button is a sibling after the dl, never a child of it.
    expect(node.querySelector('dl button')).toBeNull();
    expect(node.querySelector('dl').nextElementSibling).toBe(button);
  });

  test('clicking Show more reveals the overflow rows, flips aria-expanded, relabels, and moves focus to the first revealed row', () => {
    const node = renderTruncated();
    const button = node.querySelector('button.rdforms-show-more');
    button.click();
    expect(labelsIn(node)).toEqual(['Name', 'Alias', 'Homepage']);
    expect(node.textContent).toContain('http://example.org/');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.textContent).toBe('Show less');
    const revealed = labelsIn(node)
      .map((_, index) => node.querySelectorAll('dt.rdforms-label')[index])
      .find((dt) => dt.textContent === 'Homepage');
    expect(revealed.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(revealed);
  });

  test('the revealed rows re-enter the same <dl>, with the button still a sibling after it', () => {
    const node = renderTruncated();
    const list = node.querySelector('dl');
    const button = node.querySelector('button.rdforms-show-more');
    button.click();
    // Scoped to the <dl>: a regression appending revealed rows elsewhere in the
    // node (invalid dt/dd markup) would leave this query empty.
    const revealedTerm = Array.from(
      list.querySelectorAll('dt.rdforms-label')
    ).find((dt) => dt.textContent === 'Homepage');
    expect(revealedTerm).not.toBeUndefined();
    expect(revealedTerm.parentElement).toBe(list);
    const revealedValue = revealedTerm.nextElementSibling;
    expect(revealedValue.tagName).toBe('DD');
    expect(revealedValue.parentElement).toBe(list);
    expect(revealedValue.textContent).toContain('http://example.org/');
    // The toggle button is never pulled inside the <dl>; it stays right after it.
    expect(node.querySelector('dl button')).toBeNull();
    expect(list.nextElementSibling).toBe(button);
  });

  test('clicking again collapses the overflow rows, restores aria-expanded/label, and returns focus to the button', () => {
    const node = renderTruncated();
    const button = node.querySelector('button.rdforms-show-more');
    button.click();
    button.click();
    expect(labelsIn(node)).toEqual(['Name', 'Alias']);
    expect(node.textContent).not.toContain('http://example.org/');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.textContent).toBe('Show more');
    expect(document.activeElement).toBe(button);
  });
});

const property = (name) => `http://example.org/p/${name}`;
const textDef = (id, prop, label, extra) => ({
  '@id': id,
  '@type': 'text',
  nodetype: 'LITERAL',
  property: prop,
  label: { en: label },
  ...extra,
});

// Root group with a heading-styled child in the middle, so rendering produces
// two independent <dl> segments (before/after the section). With truncateLimit
// 2, each segment truncates on its own: A,B shown / C held, then the section,
// then D,E shown / F held.
const renderMultiSegment = () => {
  const templateRoot = new ItemStore().createTemplate({
    root: 'root',
    auxilliary: [
      {
        '@id': 'root',
        '@type': 'group',
        content: ['ia', 'ib', 'ic', 'sec', 'id', 'ie', 'if'],
      },
      textDef('ia', property('a'), 'A'),
      textDef('ib', property('b'), 'B'),
      textDef('ic', property('c'), 'C'),
      {
        '@id': 'sec',
        '@type': 'group',
        styles: ['heading'],
        label: { en: 'Section' },
        content: ['ig'],
      },
      textDef('ig', property('g'), 'G'),
      textDef('id', property('d'), 'D'),
      textDef('ie', property('e'), 'E'),
      textDef('if', property('f'), 'F'),
    ],
  });
  const graph = new Graph({
    'http://example.org/p': Object.fromEntries(
      ['a', 'b', 'c', 'g', 'd', 'e', 'f'].map((name) => [
        property(name),
        [{ value: name, type: 'literal' }],
      ])
    ),
  });
  const binding = match(graph, 'http://example.org/p', templateRoot);
  const node = document.createElement('div');
  document.body.appendChild(node);
  new VanillaPresenter(
    { binding, locale: 'en', truncate: true, truncateLimit: 2 },
    node
  );
  return node;
};

// Overflow row (Alias) is multi-valued, so expanding it must reveal its <dt>
// plus all its <dd>s together, in order.
const renderMultiValueOverflow = () => {
  const templateRoot = new ItemStore().createTemplate({
    root: 'root',
    auxilliary: [
      { '@id': 'root', '@type': 'group', content: ['in', 'ih', 'ial'] },
      textDef('in', NAME, 'Name'),
      { ...textDef('ih', HOMEPAGE, 'Homepage'), nodetype: 'URI' },
      textDef('ial', NICK, 'Alias', {
        cardinality: { min: 0, pref: 1, max: 3 },
      }),
    ],
  });
  const graph = new Graph({
    'http://example.org/p': {
      [NAME]: [{ value: 'Ada', type: 'literal' }],
      [HOMEPAGE]: [{ value: 'http://example.org/', type: 'uri' }],
      [NICK]: [
        { value: 'Zed', type: 'literal' },
        { value: 'Ida', type: 'literal' },
      ],
    },
  });
  const binding = match(graph, 'http://example.org/p', templateRoot);
  const node = document.createElement('div');
  document.body.appendChild(node);
  new VanillaPresenter(
    { binding, locale: 'en', truncate: true, truncateLimit: 2 },
    node
  );
  return node;
};

describe('VanillaPresenter — truncation across multiple <dl> segments', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('a heading splits the group into independently-truncated segments, each with its own button; expanding one does not affect the other', () => {
    const node = renderMultiSegment();
    const buttons = node.querySelectorAll('button.rdforms-show-more');
    expect(buttons.length).toBe(2);
    const labels = () =>
      Array.from(node.querySelectorAll('dt.rdforms-label')).map(
        (dt) => dt.textContent
      );
    // C (segment 1) and F (segment 2) start held; G is the section's content.
    expect(labels()).toEqual(['A', 'B', 'G', 'D', 'E']);
    // Expanding segment 1 reveals only C — F stays held (no cross-segment leak).
    buttons[0].click();
    expect(labels()).toEqual(['A', 'B', 'C', 'G', 'D', 'E']);
    // Expanding segment 2 reveals F.
    buttons[1].click();
    expect(labels()).toEqual(['A', 'B', 'C', 'G', 'D', 'E', 'F']);
  });

  test('expanding a multi-value overflow row reveals its <dt> and every <dd> in order', () => {
    const node = renderMultiValueOverflow();
    expect(node.textContent).not.toContain('Alias');
    node.querySelector('button.rdforms-show-more').click();
    const aliasTerm = Array.from(
      node.querySelectorAll('dt.rdforms-label')
    ).find((dt) => dt.textContent === 'Alias');
    expect(aliasTerm).toBeTruthy();
    const firstValue = aliasTerm.nextElementSibling;
    const secondValue = firstValue.nextElementSibling;
    expect([firstValue.tagName, firstValue.textContent]).toEqual(['DD', 'Zed']);
    expect([secondValue.tagName, secondValue.textContent]).toEqual([
      'DD',
      'Ida',
    ]);
  });
});
