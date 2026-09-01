import { Graph } from '@entryscape/rdfjson';
import Binding from './Binding';
import GroupBinding from './GroupBinding';
import PropertyGroupBinding from './PropertyGroupBinding';
import ValueBinding from './ValueBinding';
import ItemStore from '../template/ItemStore';
import { uris, predicates } from '../../test/fixtures/rdfjson';
import template1 from '../../test/fixtures/template1';

const createTemplateRoot = () => {
  const itemStore = new ItemStore();
  const root = itemStore.createTemplate(template1);
  return { itemStore, root };
};

// An isolated text item with the given source, so pattern/valueTemplate tweaks
// don't mutate the shared template1 fixture.
const buildTextItem = (source = {}) =>
  new ItemStore().createTemplate({
    root: 'textRoot',
    auxilliary: [{ '@id': 'textRoot', '@type': 'text', ...source }],
  });

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
  const titleSlotStatement = graph.create(uris[0], predicates[0], {
    type: 'literal',
    value: 'Hepp',
  });
  const rootGroupBinding = new GroupBinding({ item: root });
  const titleSlotBinding = new ValueBinding({
    item: root.getChildren()[1],
    statement: titleSlotStatement,
  });
  return {
    graph,
    titleSlotStatement,
    itemStore,
    root,
    rootGroupBinding,
    titleSlotBinding,
  };
};

describe('Binding-hierarchy', () => {
  test('Adding childrenbindings', () => {
    const { rootGroupBinding, titleSlotBinding } = createSingleValueBindings();
    expect(rootGroupBinding.getChildBindings()).toHaveLength(0);
    rootGroupBinding.addChildBinding(titleSlotBinding);
    expect(rootGroupBinding.getChildBindings()).toHaveLength(1);
    rootGroupBinding.removeChildBinding(titleSlotBinding);
    expect(rootGroupBinding.getChildBindings()).toHaveLength(0);
  });
});

const createPersonHierarchyContext = () => {
  const { itemStore, root } = createTemplateRoot();
  const graph = new Graph({});
  const creatorStatement = graph.create(
    're1',
    'http://purl.org/dc/elements/1.1/creator',
    { type: 'bnode', value: '_:person' }
  );
  const personTypeStatement = graph.create(
    '_:person',
    'http://www.w3.org/TR/rdf-schema/type',
    { type: 'uri', value: 'http://xmlns.com/foaf/0.1/Person' }
  );
  const firstnameStatement = graph.create(
    '_:person',
    'http://xmlns.com/foaf/0.1/firstname',
    { type: 'literal', value: 'Anna' }
  );
  const titleStatement = graph.create(
    're1',
    'http://purl.org/dc/elements/1.1/title',
    { type: 'literal', value: 'Some title' }
  );
  return {
    graph,
    creatorStatement,
    personTypeStatement,
    firstnameStatement,
    titleStatement,
    itemStore,
    root,
  };
};

const createRootAndTitleBindings = (context) => {
  const { root, titleStatement } = context;
  const rootGroupBinding = new GroupBinding({ item: root });
  const titleBinding = new ValueBinding({
    item: root.getChildren()[1],
    statement: titleStatement,
  });
  return { rootGroupBinding, titleBinding };
};

const createGroupHierarchy = () => {
  const context = createPersonHierarchyContext();
  const { root, creatorStatement, personTypeStatement, firstnameStatement } =
    context;
  const { rootGroupBinding, titleBinding } =
    createRootAndTitleBindings(context);
  const authorGroupBinding = new GroupBinding({
    item: root.getChildren()[0],
    statement: creatorStatement,
    constraints: [personTypeStatement],
  });
  const firstnameBinding = new ValueBinding({
    item: root.getChildren()[0].getChildren()[0],
    statement: firstnameStatement,
  });
  rootGroupBinding.addChildBinding(authorGroupBinding);
  authorGroupBinding.addChildBinding(firstnameBinding);
  rootGroupBinding.addChildBinding(titleBinding);
  return {
    ...context,
    rootGroupBinding,
    authorGroupBinding,
    firstnameBinding,
    titleBinding,
  };
};

const createPropertyGroupHierarchy = () => {
  const context = createPersonHierarchyContext();
  const { root, creatorStatement, personTypeStatement, firstnameStatement } =
    context;
  const { rootGroupBinding, titleBinding } =
    createRootAndTitleBindings(context);
  const contributionBinding = new PropertyGroupBinding({
    item: root.getChildren()[4],
    statement: creatorStatement,
    constraints: [personTypeStatement],
  });
  const firstnameBinding = new ValueBinding({
    item: root.getChildren()[4].getChildren()[1].getChildren()[0],
    statement: firstnameStatement,
  });
  rootGroupBinding.addChildBinding(contributionBinding);
  contributionBinding.getObjectBinding().addChildBinding(firstnameBinding);
  rootGroupBinding.addChildBinding(titleBinding);
  return {
    ...context,
    rootGroupBinding,
    contributionBinding,
    firstnameBinding,
    titleBinding,
  };
};

describe('Binding-assertions', () => {
  test('Changing values', () => {
    const { titleSlotStatement, rootGroupBinding, titleSlotBinding } =
      createSingleValueBindings();
    rootGroupBinding.addChildBinding(titleSlotBinding);
    expect(titleSlotStatement.isAsserted()).toBe(true);
    titleSlotBinding.setValue('');
    expect(titleSlotStatement.isAsserted()).toBe(false);
    titleSlotBinding.setValue('hopp');
    expect(titleSlotStatement.isAsserted()).toBe(true);
    expect(titleSlotStatement.getValue()).toBe('hopp');
    // setValue requires a string or null (Binding._isValidObjectValue throws otherwise); null is the clear value.
    titleSlotBinding.setValue(null);
    expect(titleSlotStatement.isAsserted()).toBe(false);
  });

  test('Changing values in hierarchy', () => {
    const {
      creatorStatement,
      personTypeStatement,
      firstnameStatement,
      titleStatement,
      firstnameBinding,
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
      graph,
      creatorStatement,
      firstnameStatement,
      root,
      authorGroupBinding,
      firstnameBinding,
    } = createGroupHierarchy();
    const surnameStatement = graph.create(
      '_:person',
      'http://xmlns.com/foaf/0.1/surname',
      { type: 'literal', value: 'Wilder' }
    );
    const surnameBinding = new ValueBinding({
      item: root.getChildren()[0].getChildren()[1],
      statement: surnameStatement,
    });
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
      creatorStatement,
      personTypeStatement,
      firstnameStatement,
      titleStatement,
      contributionBinding,
      firstnameBinding,
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
    contributionBinding
      .getPredicateBinding()
      .setValue('http://purl.org/dc/elements/1.1/creator');
    expect(creatorStatement.isAsserted()).toBe(true);
    expect(personTypeStatement.isAsserted()).toBe(true);
    expect(firstnameStatement.isAsserted()).toBe(true);
    expect(titleStatement.isAsserted()).toBe(true);
  });
});

describe('Binding value validation', () => {
  test('_isValidObjectValue without a pattern accepts non-empty strings', () => {
    const binding = new Binding({ item: buildTextItem() });
    expect(binding._isValidObjectValue('hello')).toBe(true);
    expect(binding._isValidObjectValue('')).toBe(false);
    expect(binding._isValidObjectValue(null)).toBe(false);
    expect(() => binding._isValidObjectValue(42)).toThrow();
  });

  test('_isValidObjectValue with a pattern enforces the pattern', () => {
    const binding = new Binding({ item: buildTextItem({ pattern: '[0-9]+' }) });
    expect(binding._isValidObjectValue('123')).toBe(true);
    expect(binding._isValidObjectValue('abc')).toBe(false);
    expect(binding._isValidObjectValue('')).toBe(false);
  });

  test('_isValidObjectValue strips the value template before applying the pattern', () => {
    // The pattern is tested against the gist, not the full value: the value
    // template is stripped first (Binding._isValidObjectValue via extractGist).
    const binding = new Binding({
      item: buildTextItem({
        pattern: '[0-9]+',
        valueTemplate: 'http://example.com/$1',
      }),
    });
    expect(binding._isValidObjectValue('http://example.com/123')).toBe(true);
    expect(binding._isValidObjectValue('http://example.com/abc')).toBe(false);
  });

  test('_isValidPredicateValue accepts non-empty strings', () => {
    const binding = new Binding({ item: buildTextItem() });
    expect(binding._isValidPredicateValue('http://example.com/p')).toBe(true);
    expect(binding._isValidPredicateValue('')).toBe(false);
    expect(binding._isValidPredicateValue(null)).toBe(false);
    expect(() => binding._isValidPredicateValue(42)).toThrow();
  });
});

describe('Binding gist and value template', () => {
  const buildValueBinding = () => {
    const root = new ItemStore().createTemplate({
      root: 'gistRoot',
      auxilliary: [
        {
          '@id': 'gistRoot',
          '@type': 'group',
          nodetype: 'RESOURCE',
          content: [
            {
              '@type': 'text',
              property: 'http://purl.org/dc/terms/identifier',
              nodetype: 'LITERAL',
              valueTemplate: 'http://example.com/$1',
            },
          ],
        },
      ],
    });
    const graph = new Graph({});
    const statement = graph.create(
      'subject',
      'http://purl.org/dc/terms/identifier',
      { type: 'literal', value: '' }
    );
    const rootGroupBinding = new GroupBinding({ item: root });
    const valueBinding = new ValueBinding({
      item: root.getChildren()[0],
      statement,
    });
    rootGroupBinding.addChildBinding(valueBinding);
    return valueBinding;
  };

  test('setGist expands the value template and getGist extracts it back', () => {
    const valueBinding = buildValueBinding();
    valueBinding.setGist('123');
    expect(valueBinding.getValue()).toBe('http://example.com/123');
    expect(valueBinding.getGist()).toBe('123');
  });
});

describe('Binding listeners and change propagation', () => {
  test('addListener/removeListener control change notifications', () => {
    const binding = new Binding({ item: buildTextItem() });
    let notifications = 0;
    const listener = () => {
      notifications += 1;
    };
    binding.addListener(listener);
    binding.bindingChange(binding);
    expect(notifications).toBe(1);
    binding.removeListener(listener);
    binding.bindingChange(binding);
    expect(notifications).toBe(1);
  });

  test('bindingChange propagates to the parent and cardinality tracker', () => {
    const item = buildTextItem();
    const parent = new Binding({ item });
    let parentNotifications = 0;
    parent.addListener(() => {
      parentNotifications += 1;
    });
    const child = new Binding({ item });
    child.setParent(parent);
    let touchCount = 0;
    child.setCardinalityTracker({
      touch: () => {
        touchCount += 1;
      },
    });
    child.bindingChange(child);
    expect(parentNotifications).toBe(1);
    expect(touchCount).toBe(1);
  });
});

describe('Binding.getGraph', () => {
  test('returns undefined without any graph, statement, or parent', () => {
    const binding = new Binding({ item: buildTextItem() });
    expect(binding.getGraph()).toBeUndefined();
  });

  test('falls back to the parent graph', () => {
    const item = buildTextItem();
    const graph = new Graph({});
    const parent = new Binding({ item, graph });
    const child = new Binding({ item });
    child.setParent(parent);
    expect(child.getGraph()).toBe(graph);
  });
});

describe('Binding.isReadOnly', () => {
  test('a binding without a named-graph statement is not read-only', () => {
    const binding = new Binding({ item: buildTextItem() });
    expect(binding.isReadOnly()).toBe(false);
  });

  test('a binding whose statement is in a named graph is read-only', () => {
    // The base class only calls statement.getNamedGraph(); a minimal stub
    // exercises the named-graph branch without rdfjson named-graph plumbing.
    const namedGraphStatement = {
      getNamedGraph: () => 'http://example.com/named-graph',
    };
    const binding = new Binding({
      item: buildTextItem(),
      statement: namedGraphStatement,
    });
    expect(binding.isReadOnly()).toBe(true);
  });

  test('a child of a read-only parent returns undefined instead of true', () => {
    // Characterization of a confirmed bug (RDFORMS-192): the parent-is-read-only
    // branch assigns to the misspelled `this._readyOnly` instead of `_readOnly`,
    // so isReadOnly() returns undefined and read-only inheritance is broken.
    // Flip these assertions once RDFORMS-192 is fixed.
    const item = buildTextItem();
    const parent = new Binding({ item });
    parent._readOnly = true;
    const child = new Binding({ item });
    child.setParent(parent);
    expect(child.isReadOnly()).toBeUndefined();
    expect(child._readyOnly).toBe(true);
  });
});
