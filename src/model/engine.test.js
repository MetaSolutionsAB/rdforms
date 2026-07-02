import { Graph } from '@entryscape/rdfjson';
import { match, create } from './engine';
import GroupBinding from './GroupBinding';
import ItemStore from '../template/ItemStore';
import { graph2 } from '../../test/fixtures/rdfjson';
import template1 from '../../test/fixtures/template1';

const createStoreAndTemplate = () => {
  const itemStore = new ItemStore();
  const template = itemStore.createTemplate(template1);
  return { itemStore, template };
};

const createMatchingContext = () => ({
  ...createStoreAndTemplate(),
  graph: new Graph(graph2),
});

const matchAboutBinding = () => {
  const { graph, template } = createMatchingContext();
  return match(graph, 'http://example.org/about', template);
};

const createEmptyGraphContext = () => {
  const base = createStoreAndTemplate();
  const graph = new Graph({});
  const rootBinding = new GroupBinding({
    item: base.template,
    childrenRootUri: 'http://example.org/about',
    graph,
  });
  return { ...base, graph, rootBinding };
};

describe('Engine matching test', () => {
  test('Matching a graph with a template', () => {
    const binding = matchAboutBinding();
    expect(binding).toBeInstanceOf(GroupBinding);
    expect(binding.getChildBindings()).toHaveLength(5); // A publisher, two titles, a subject and a creator.
    expect(binding.getItemGroupedChildBindings()[0]).toHaveLength(1); // One publisher
    expect(binding.getItemGroupedChildBindings()[1]).toHaveLength(2); // Two titles
    expect(binding.getItemGroupedChildBindings()[2]).toHaveLength(0); // No date
    expect(binding.getItemGroupedChildBindings()[3]).toHaveLength(1); // One subject
    expect(binding.getItemGroupedChildBindings()[4]).toHaveLength(1); // One contributor
  });

  test('Checking matched direct values', () => {
    const binding = matchAboutBinding();
    expect(binding.getItemGroupedChildBindings()[1][0].getValue()).toBe(
      "Anna's Homepage"
    );
    expect(binding.getItemGroupedChildBindings()[1][0].getLanguage()).toBe(
      'en'
    );
    expect(binding.getItemGroupedChildBindings()[1][1].getValue()).toBe(
      'Anna hemsida'
    );
    expect(binding.getItemGroupedChildBindings()[1][1].getLanguage()).toBe(
      'sv'
    );
    expect(binding.getItemGroupedChildBindings()[3][0].getValue()).toBe(
      'http://example.com/instance1'
    );
  });

  test('Checking matched grouped values', () => {
    const binding = matchAboutBinding();
    const authorGroupBinding = binding.getItemGroupedChildBindings()[0][0];
    expect(
      authorGroupBinding.getItemGroupedChildBindings()[0][0].getValue()
    ).toBe('Anna');
    expect(
      authorGroupBinding.getItemGroupedChildBindings()[0][1].getValue()
    ).toBe('Annie');
    expect(
      authorGroupBinding.getItemGroupedChildBindings()[1][0].getValue()
    ).toBe('Wilder');
    expect(binding.getItemGroupedChildBindings()[4]).toHaveLength(1); // One contributor
  });

  test('Checking matched PredicateGroup values', () => {
    const binding = matchAboutBinding();
    expect(
      binding
        .getItemGroupedChildBindings()[4][0]
        .getPredicateBinding()
        .getValue()
    ).toBe('http://purl.org/dc/terms/creator');
    expect(
      binding
        .getItemGroupedChildBindings()[4][0]
        .getObjectBinding()
        .getItemGroupedChildBindings()[0][0]
        .getValue()
    ).toBe('Steve');
    expect(
      binding
        .getItemGroupedChildBindings()[4][0]
        .getObjectBinding()
        .getItemGroupedChildBindings()[1][0]
        .getValue()
    ).toBe('Jobs');
  });
});

describe('Engine create test', () => {
  test('Creating direct value', () => {
    const { graph, template, rootBinding } = createEmptyGraphContext();
    const titleBinding = create(rootBinding, template.getChildren()[1]);
    expect(titleBinding.getParent()).toBe(rootBinding);
    expect(titleBinding.getValue()).toBe('');
    expect(titleBinding.isValid()).toBe(false);
    expect(graph.find()).toHaveLength(0);
    titleBinding.setValue('Hello');
    expect(titleBinding.getValue()).toBe('Hello');
    expect(titleBinding.isValid()).toBe(true);
    expect(graph.find()).toHaveLength(1);
  });

  test('Creating group with direct values', () => {
    const { graph, template, rootBinding } = createEmptyGraphContext();
    const groupBinding = create(rootBinding, template.getChildren()[0]);
    expect(groupBinding.getParent()).toBe(rootBinding);
    expect(groupBinding.isValid()).toBe(false);
    expect(graph.find()).toHaveLength(0);
    const valueBinding = create(
      groupBinding,
      template.getChildren()[0].getChildren()[0]
    );
    expect(groupBinding.isValid()).toBe(false);
    expect(valueBinding.isValid()).toBe(false);
    expect(graph.find()).toHaveLength(0);
    valueBinding.setValue('Pete');
    expect(groupBinding.isValid()).toBe(true);
    expect(valueBinding.isValid()).toBe(true);
    expect(graph.find()).toHaveLength(3);
  });

  test('Creating propertygroup', () => {
    const { graph, template, rootBinding } = createEmptyGraphContext();
    const propertyGroupBinding = create(rootBinding, template.getChildren()[4]);
    expect(propertyGroupBinding.getParent()).toBe(rootBinding);
    expect(propertyGroupBinding.isValid()).toBe(false);
    expect(graph.find()).toHaveLength(0);
    const groupBinding = propertyGroupBinding.getObjectBinding();
    const valueBinding = create(
      groupBinding,
      groupBinding.getItem().getChildren()[0]
    );
    expect(groupBinding.isValid()).toBe(false);
    expect(propertyGroupBinding.isValid()).toBe(false);
    expect(valueBinding.isValid()).toBe(false);
    expect(graph.find()).toHaveLength(0);
    valueBinding.setValue('Pete');
    expect(groupBinding.isValid()).toBe(false);
    expect(propertyGroupBinding.isValid()).toBe(false);
    expect(valueBinding.isValid()).toBe(true);
    expect(graph.find()).toHaveLength(0);
    propertyGroupBinding
      .getPredicateBinding()
      .setValue('http://purl.org/dc/terms/creator');
    expect(groupBinding.isValid()).toBe(true);
    expect(propertyGroupBinding.isValid()).toBe(true);
    expect(valueBinding.isValid()).toBe(true);
    expect(graph.find()).toHaveLength(3);
  });
});
