/**
 * @jest-environment jsdom
 */
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
});
