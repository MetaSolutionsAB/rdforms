import { Graph } from '@entryscape/rdfjson';
import GroupBinding from '../../src/model/GroupBinding';
import PropertyGroupBinding from '../../src/model/PropertyGroupBinding';
import ValueBinding from '../../src/model/ValueBinding';
import ItemStore from '../../src/template/ItemStore';
import { uris, predicates } from '../fixtures/rdfjson';
import template1 from '../fixtures/template1';

const createTemplateRoot = () => {
  const itemStore = new ItemStore();
  const root = itemStore.createTemplate(template1);
  return { itemStore, root };
};

describe('Binding-creation', () => {
  test('GroupBinding creation', () => {
    const { root } = createTemplateRoot();
    const groupBinding = new GroupBinding({ item: root });
    expect(groupBinding).toBeInstanceOf(GroupBinding);
  });

  test('ValueBinding creation', () => {
    const { root } = createTemplateRoot();
    const valueBinding = new ValueBinding({ item: root.getChildren()[1] });
    expect(valueBinding).toBeInstanceOf(ValueBinding);
  });
});

const createSingleValueBindings = () => {
  const { itemStore, root } = createTemplateRoot();
  const graph = new Graph({});
  const makerStatement = graph.create(uris[0], predicates[1], { type: 'literal', value: 'Hepp' });
  const rootGroupBinding = new GroupBinding({ item: root });
  const makerBinding = new ValueBinding({ item: root.getChildren()[1], statement: makerStatement });
  return {
    graph, makerStatement, itemStore, root, rootGroupBinding, makerBinding,
  };
};

describe('Binding-hierarchy', () => {
  test('Adding childrenbindings', () => {
    const { rootGroupBinding, makerBinding } = createSingleValueBindings();
    expect(rootGroupBinding.getChildBindings()).toHaveLength(0);
    rootGroupBinding.addChildBinding(makerBinding);
    expect(rootGroupBinding.getChildBindings()).toHaveLength(1);
    rootGroupBinding.removeChildBinding(makerBinding);
    expect(rootGroupBinding.getChildBindings()).toHaveLength(0);
  });
});

const createPersonHierarchyContext = () => {
  const { itemStore, root } = createTemplateRoot();
  const graph = new Graph({});
  const creatorStatement = graph.create('re1', 'http://purl.org/dc/elements/1.1/creator', { type: 'bnode', value: '_:person' });
  const personTypeStatement = graph.create('_:person', 'http://www.w3.org/TR/rdf-schema/type', { type: 'uri', value: 'http://xmlns.com/foaf/0.1/Person' });
  const firstnameStatement = graph.create('_:person', 'http://xmlns.com/foaf/0.1/firstname', { type: 'literal', value: 'Anna' });
  const titleStatement = graph.create('re1', 'http://purl.org/dc/elements/1.1/title', { type: 'literal', value: 'Some title' });
  return {
    graph, creatorStatement, personTypeStatement, firstnameStatement, titleStatement, itemStore, root,
  };
};

const createGroupHierarchy = () => {
  const context = createPersonHierarchyContext();
  const {
    root, creatorStatement, personTypeStatement, firstnameStatement, titleStatement,
  } = context;
  const rootGroupBinding = new GroupBinding({ item: root });
  const authorGroupBinding = new GroupBinding({ item: root.getChildren()[0], statement: creatorStatement, constraints: [personTypeStatement] });
  const firstnameBinding = new ValueBinding({ item: root.getChildren()[0].getChildren()[0], statement: firstnameStatement });
  const titleBinding = new ValueBinding({ item: root.getChildren()[1], statement: titleStatement });
  rootGroupBinding.addChildBinding(authorGroupBinding);
  authorGroupBinding.addChildBinding(firstnameBinding);
  rootGroupBinding.addChildBinding(titleBinding);
  return {
    ...context, rootGroupBinding, authorGroupBinding, firstnameBinding, titleBinding,
  };
};

const createPropertyGroupHierarchy = () => {
  const context = createPersonHierarchyContext();
  const {
    root, creatorStatement, personTypeStatement, firstnameStatement, titleStatement,
  } = context;
  const rootGroupBinding = new GroupBinding({ item: root });
  const contributionBinding = new PropertyGroupBinding({ item: root.getChildren()[4], statement: creatorStatement, constraints: [personTypeStatement] });
  const firstnameBinding = new ValueBinding({ item: root.getChildren()[4].getChildren()[1].getChildren()[0], statement: firstnameStatement });
  const titleBinding = new ValueBinding({ item: root.getChildren()[1], statement: titleStatement });
  rootGroupBinding.addChildBinding(contributionBinding);
  contributionBinding.getObjectBinding().addChildBinding(firstnameBinding);
  rootGroupBinding.addChildBinding(titleBinding);
  return {
    ...context, rootGroupBinding, contributionBinding, firstnameBinding, titleBinding,
  };
};

describe('Binding-assertions', () => {
  test('Changing values', () => {
    const { makerStatement, rootGroupBinding, makerBinding } = createSingleValueBindings();
    rootGroupBinding.addChildBinding(makerBinding);
    expect(makerStatement.isAsserted()).toBe(true);
    makerBinding.setValue('');
    expect(makerStatement.isAsserted()).toBe(false);
    makerBinding.setValue('hopp');
    expect(makerStatement.isAsserted()).toBe(true);
    // setValue requires a string or null (Binding._isValidObjectValue throws otherwise); null is the clear value.
    makerBinding.setValue(null);
    expect(makerStatement.isAsserted()).toBe(false);
  });

  test('Changing values in hierarchy', () => {
    const {
      creatorStatement, personTypeStatement, firstnameStatement, titleStatement, firstnameBinding,
    } = createGroupHierarchy();
    expect(creatorStatement.isAsserted()).toBe(true);
    expect(personTypeStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(true);
    expect(titleStatement.isAsserted()).toBe(true);
    firstnameBinding.setValue('');
    expect(creatorStatement.isAsserted()).toBe(false);
    expect(personTypeStatement.isAsserted()).toBe(false);
    expect(firstnameStatement.isAsserted()).toBe(false);
    expect(titleStatement.isAsserted()).toBe(true);
    firstnameBinding.setValue('Anna Wilder');
    expect(creatorStatement.isAsserted()).toBe(true);
    expect(personTypeStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(true);
    expect(titleStatement.isAsserted()).toBe(true);
  });

  test('Checking two children validity in hierarchy', () => {
    const {
      graph, creatorStatement, firstnameStatement, root, authorGroupBinding, firstnameBinding,
    } = createGroupHierarchy();
    const surnameStatement = graph.create('_:person', 'http://xmlns.com/foaf/0.1/surame', { type: 'literal', value: 'Wilder' });
    const surnameBinding = new ValueBinding({ item: root.getChildren()[0].getChildren()[1], statement: surnameStatement });
    authorGroupBinding.addChildBinding(surnameBinding);

    expect(creatorStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(true);
    expect(surnameStatement.isAsserted()).toBe(true);
    firstnameBinding.setValue('');
    expect(creatorStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(false);
    expect(surnameStatement.isAsserted()).toBe(true);
    surnameBinding.setValue('');
    expect(creatorStatement.isAsserted()).toBe(false);
    expect(firstnameStatement.isAsserted()).toBe(false);
    expect(surnameStatement.isAsserted()).toBe(false);
    surnameBinding.setValue('Wilder2');
    expect(creatorStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(false);
    expect(surnameStatement.isAsserted()).toBe(true);
  });

  test('Checking propertyGroup bindings', () => {
    const {
      creatorStatement, personTypeStatement, firstnameStatement, titleStatement, contributionBinding, firstnameBinding,
    } = createPropertyGroupHierarchy();
    // First check leaf validity effect.
    expect(creatorStatement.isAsserted()).toBe(true);
    expect(personTypeStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(true);
    expect(titleStatement.isAsserted()).toBe(true);
    firstnameBinding.setValue('');
    expect(creatorStatement.isAsserted()).toBe(false);
    expect(personTypeStatement.isAsserted()).toBe(false);
    expect(firstnameStatement.isAsserted()).toBe(false);
    expect(titleStatement.isAsserted()).toBe(true);
    firstnameBinding.setValue('Anna');
    expect(creatorStatement.isAsserted()).toBe(true);
    expect(personTypeStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(true);
    expect(titleStatement.isAsserted()).toBe(true);
    // Second, check hierarchy updated when predicate changed above.
    contributionBinding.getPredicateBinding().setValue('');
    expect(creatorStatement.isAsserted()).toBe(false);
    expect(personTypeStatement.isAsserted()).toBe(false);
    expect(firstnameStatement.isAsserted()).toBe(false);
    expect(titleStatement.isAsserted()).toBe(true);
    contributionBinding.getPredicateBinding().setValue('http://purl.org/dc/elements/1.1/creator');
    expect(creatorStatement.isAsserted()).toBe(true);
    expect(personTypeStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(true);
    expect(titleStatement.isAsserted()).toBe(true);
  });
});
