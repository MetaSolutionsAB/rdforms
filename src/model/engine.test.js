import { Graph } from '@entryscape/rdfjson';
import moment from 'moment';
import {
  match,
  fuzzyMatch,
  create,
  detectLevel,
  levelProfile,
  constructTemplate,
  findFirstValueBinding,
  findPopularChoice,
  matchPathBelowBinding,
} from './engine';
import GroupBinding from './GroupBinding';
import ValueBinding from './ValueBinding';
import Group from '../template/Group';
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

describe('detectLevel', () => {
  const makeProfile = (mandatory, recommended, optional) => ({
    mandatory,
    recommended,
    optional,
  });

  test('only mandatory items', () => {
    expect(detectLevel(makeProfile(2, 0, 0))).toBe('mandatory');
  });
  test('only recommended items', () => {
    expect(detectLevel(makeProfile(0, 2, 0))).toBe('recommended');
  });
  test('only optional items', () => {
    // Regression: this branch was previously unreachable and fell through to 'mixed_all'.
    expect(detectLevel(makeProfile(0, 0, 2))).toBe('optional');
  });
  test('mandatory and recommended items', () => {
    expect(detectLevel(makeProfile(1, 1, 0))).toBe(
      'mixed_mandatory_recommended'
    );
  });
  test('mandatory and optional items', () => {
    expect(detectLevel(makeProfile(1, 0, 1))).toBe('mixed_mandatory_optional');
  });
  test('recommended and optional items', () => {
    expect(detectLevel(makeProfile(0, 1, 1))).toBe(
      'mixed_recommended_optional'
    );
  });
  test('a mix of all item levels', () => {
    expect(detectLevel(makeProfile(1, 1, 1))).toBe('mixed_all');
  });
  test('an empty profile (no items) falls through to mixed_all', () => {
    // The `optional > 0` guard routes (0,0,0) past 'optional' into 'mixed_all'.
    expect(detectLevel(makeProfile(0, 0, 0))).toBe('mixed_all');
  });
});

describe('levelProfile', () => {
  test('summarizes item levels and keeps itemCount consistent', () => {
    const profile = levelProfile(createStoreAndTemplate().template);
    expect(typeof profile.mandatory).toBe('number');
    expect(typeof profile.recommended).toBe('number');
    expect(typeof profile.optional).toBe('number');
    // template1 has a title with cardinality.min = 2, so at least one mandatory.
    expect(profile.mandatory).toBeGreaterThanOrEqual(1);
    expect(profile.itemCount).toBe(
      profile.mandatory + profile.recommended + profile.optional
    );
  });
});

describe('fuzzyMatch', () => {
  test('returns a GroupBinding that is a superset of the strict match', () => {
    const { template } = createStoreAndTemplate();
    const graph = new Graph(graph2);
    const strict = match(graph, 'http://example.org/about', template);
    const fuzzy = fuzzyMatch(
      new Graph(graph2),
      'http://example.org/about',
      template
    );
    expect(fuzzy).toBeInstanceOf(GroupBinding);
    expect(fuzzy.getItem()).toBe(template);
    // The fuzzy pass runs the strict matcher first, then a relaxed second pass,
    // so it never captures fewer bindings than the strict match.
    expect(fuzzy.getChildBindings().length).toBeGreaterThanOrEqual(
      strict.getChildBindings().length
    );
  });
});

describe('constructTemplate', () => {
  const createDetectionContext = () => {
    const itemStore = new ItemStore();
    // Force lazy child creation so inline root items (e.g. the title text) are
    // registered by property, which is what getItemByProperty relies on.
    itemStore.createTemplate(template1).getChildren();
    return { itemStore, graph: new Graph(graph2) };
  };

  test('auto-detects a template from the graph properties', () => {
    const { itemStore, graph } = createDetectionContext();
    const detected = constructTemplate(
      graph,
      'http://example.org/about',
      itemStore
    );
    expect(detected).toBeInstanceOf(Group);
    const properties = detected.getChildren().map((item) => item.getProperty());
    expect(properties).toContain('http://purl.org/dc/terms/title');
    expect(properties).toContain('http://purl.org/dc/terms/subject');
  });

  test('honors requiredItems even when the property is absent from the graph', () => {
    const { itemStore, graph } = createDetectionContext();
    const detected = constructTemplate(
      graph,
      'http://example.org/about',
      itemStore,
      ['publisheddate']
    );
    const properties = detected.getChildren().map((item) => item.getProperty());
    // The published-date property is not in graph2 but is forced by requiredItems.
    expect(properties).toContain('http://purl.org/dc/terms/date');
  });

  test('warns when a required item is neither a known id nor property', () => {
    const { itemStore, graph } = createDetectionContext();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    constructTemplate(graph, 'http://example.org/about', itemStore, [
      'not-a-real-item',
    ]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('findFirstValueBinding', () => {
  test('returns the first value binding depth-first', () => {
    const binding = matchAboutBinding();
    const firstValueBinding = findFirstValueBinding(binding);
    expect(firstValueBinding).toBeInstanceOf(ValueBinding);
    // Depth-first descends into the first author group and returns its first name.
    expect(firstValueBinding.getValue()).toBe('Anna');
  });

  test('picks the locale-matching language for LANGUAGE_LITERAL groups', () => {
    const { template } = createStoreAndTemplate();
    // A graph whose only values are two language-tagged titles.
    const graph = new Graph({
      'http://example.org/about': {
        'http://www.w3.org/TR/rdf-schema/type': [
          { value: 'http://xmlns.com/foaf/0.1/Document', type: 'uri' },
        ],
        'http://purl.org/dc/terms/title': [
          { value: 'English title', type: 'literal', lang: 'en' },
          { value: 'Svensk titel', type: 'literal', lang: 'sv' },
        ],
      },
    });
    const binding = match(graph, 'http://example.org/about', template);
    const originalLocale = moment.locale();
    try {
      moment.locale('sv');
      expect(findFirstValueBinding(binding).getValue()).toBe('Svensk titel');
      moment.locale('en');
      expect(findFirstValueBinding(binding).getValue()).toBe('English title');
    } finally {
      moment.locale(originalLocale);
    }
  });

  test('createIfMissing lazily creates a value binding', () => {
    const { template } = createStoreAndTemplate();
    const graph = new Graph({});
    const rootBinding = new GroupBinding({
      item: template,
      childrenRootUri: 'http://example.org/about',
      graph,
    });
    const created = findFirstValueBinding(rootBinding, true);
    expect(created).toBeInstanceOf(ValueBinding);
  });
});

describe('matchPathBelowBinding', () => {
  test('navigates to a binding by predicate path', () => {
    const binding = matchAboutBinding();
    const subjectBinding = matchPathBelowBinding(binding, [
      'http://purl.org/dc/terms/subject',
    ]);
    expect(subjectBinding).toBeDefined();
    expect(subjectBinding.getValue()).toBe('http://example.com/instance1');
  });

  test('a leading slash is stripped before matching', () => {
    const binding = matchAboutBinding();
    const subjectBinding = matchPathBelowBinding(binding, [
      '/',
      'http://purl.org/dc/terms/subject',
    ]);
    expect(subjectBinding).toBeDefined();
    expect(subjectBinding.getValue()).toBe('http://example.com/instance1');
  });

  test('returns undefined for a path that matches nothing', () => {
    const binding = matchAboutBinding();
    expect(
      matchPathBelowBinding(binding, ['http://example.com/does-not-exist'])
    ).toBeUndefined();
  });
});

describe('findPopularChoice', () => {
  test('returns the choice most bindings depend on', () => {
    const itemStore = new ItemStore();
    const template = itemStore.createTemplate({
      root: 'popularityRoot',
      auxilliary: [
        {
          '@id': 'popularityRoot',
          '@type': 'group',
          nodetype: 'RESOURCE',
          constraints: {
            'http://www.w3.org/TR/rdf-schema/type': 'http://example.com/Doc',
          },
          content: [
            {
              '@id': 'kindChoice',
              '@type': 'choice',
              nodetype: 'RESOURCE',
              property: 'http://example.com/kind',
              choices: [
                { value: 'http://example.com/alpha', label: { en: 'Alpha' } },
                { value: 'http://example.com/beta', label: { en: 'Beta' } },
              ],
            },
            {
              '@type': 'text',
              property: 'http://example.com/note',
              nodetype: 'LITERAL',
              deps: ['kindChoice', 'http://example.com/beta'],
            },
          ],
        },
      ],
    });
    const graph = new Graph({
      'http://example.com/res': {
        'http://www.w3.org/TR/rdf-schema/type': [
          { value: 'http://example.com/Doc', type: 'uri' },
        ],
        'http://example.com/note': [{ value: 'a note', type: 'literal' }],
      },
    });
    const rootBinding = match(graph, 'http://example.com/res', template);
    const popular = findPopularChoice(
      itemStore.getItem('kindChoice'),
      rootBinding
    );
    expect(popular.value).toBe('http://example.com/beta');
  });
});
