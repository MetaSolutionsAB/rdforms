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
