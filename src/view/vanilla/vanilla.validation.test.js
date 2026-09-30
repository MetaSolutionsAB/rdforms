// Validation presenter for the vanilla flavor: the shared validation logic
// (validationMixin) layered on VanillaPresenter, so the report renders inside
// the semantic <dl>/<dt>/<dd> structure. Runs under the jsdom jest project.
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
import { bindingReport } from '../../model/validate';
import './all'; // registers the vanilla renderingContext hooks (incl. renderValidationMessage)
import VanillaValidationPresenter from './VanillaValidationPresenter';

const RESOURCE = 'http://example.org/r';
const REQUIRED = 'http://purl.org/dc/terms/title';
const NAME = 'http://xmlns.com/foaf/0.1/name';
const TYPE = 'http://purl.org/dc/terms/type';
const TYPE_A = 'http://example.org/typeA';
const TYPE_B = 'http://example.org/typeB';
const DEPENDENT = 'http://purl.org/dc/terms/description';

const matchSource = (source, graphData) =>
  match(new Graph(graphData), RESOURCE, new ItemStore().createTemplate(source));

const render = (source, graphData) => {
  const binding = matchSource(source, graphData);
  const node = document.createElement('div');
  new VanillaValidationPresenter({ binding, locale: 'en' }, node);
  return node;
};

// A mandatory Title (cardinality min 1) with no value in the graph is an error;
// Name has a value and is fine.
const source = {
  root: 'root',
  auxilliary: [
    {
      '@id': 'root',
      '@type': 'group',
      content: [
        {
          '@type': 'text',
          nodetype: 'LITERAL',
          property: REQUIRED,
          label: { en: 'Title' },
          cardinality: { min: 1, pref: 1, max: 1 },
        },
        {
          '@type': 'text',
          nodetype: 'LITERAL',
          property: NAME,
          label: { en: 'Name' },
        },
      ],
    },
  ],
};

const graphData = {
  [RESOURCE]: { [NAME]: [{ value: 'Ada', type: 'literal' }] },
};

describe('VanillaValidationPresenter', () => {
  test('renders the report inside semantic <dl>/<dt>/<dd> markup', () => {
    const node = render(source, graphData);
    expect(node.querySelector('dl.rdforms-group')).not.toBeNull();
    expect(node.querySelector('dt.rdforms-label')).not.toBeNull();
    expect(node.querySelector('dd.rdforms-value')).not.toBeNull();
    // No legacy div structure leaks through.
    expect(
      node.querySelector('.rdformsRow,   .rdformsField, .rdformsFields')
    ).toBeNull();
  });

  test('the validator marker class survives on the root node', () => {
    // The mixin injects 'rdformsValidator' via params.styleCls; VanillaPresenter
    // must not clobber it when applying its own default class.
    const node = render(source, graphData);
    expect(node.classList.contains('rdformsValidator')).toBe(true);
  });

  test('a missing mandatory value gets an error class and an alert message', () => {
    const node = render(source, graphData);
    const errorField = node.querySelector('dd.rdforms-value.error');
    expect(errorField).not.toBeNull();
    const message = errorField.querySelector(
      'p.rdforms-validation.rdforms-validation-error'
    );
    expect(message).not.toBeNull();
    expect(message.getAttribute('role')).toBe('alert');
    expect(message.textContent).toBe('at least one value is required');
  });

  test('a satisfied value produces no error class or message', () => {
    const node = render(source, graphData);
    const values = [...node.querySelectorAll('dd.rdforms-value')];
    const nameField = values.find((dd) => dd.textContent.includes('Ada'));
    expect(nameField).not.toBeNull();
    expect(nameField.classList.contains('error')).toBe(false);
    expect(nameField.querySelector('p.rdforms-validation')).toBeNull();
  });

  // Description only applies when Type is A, mirroring how the editor hides it.
  describe('with deps', () => {
    const depsSource = (cardinality) => ({
      root: 'root',
      auxilliary: [
        {
          '@id': 'root',
          '@type': 'group',
          content: [
            {
              '@type': 'choice',
              nodetype: 'URI',
              property: TYPE,
              label: { en: 'Type' },
              choices: [
                { value: TYPE_A, label: { en: 'A' } },
                { value: TYPE_B, label: { en: 'B' } },
              ],
            },
            {
              '@type': 'text',
              nodetype: 'LITERAL',
              property: DEPENDENT,
              label: { en: 'Description' },
              cardinality,
              deps: [TYPE, TYPE_A],
            },
          ],
        },
      ],
    });

    const graphWithType = (type, descriptions = []) => ({
      [RESOURCE]: {
        [TYPE]: [{ value: type, type: 'uri' }],
        [DEPENDENT]: descriptions.map((value) => ({ value, type: 'literal' })),
      },
    });

    test.each([
      ['mandatory', { min: 1, pref: 1, max: 1 }],
      ['recommended', { pref: 1 }],
    ])(
      'an empty %s field with unfulfilled deps is neither rendered nor reported',
      (_level, cardinality) => {
        const source = depsSource(cardinality);
        const graph = graphWithType(TYPE_B);

        const node = render(source, graph);
        const report = bindingReport(matchSource(source, graph));

        expect(node.textContent).not.toContain('Description');
        expect(node.querySelector('p.rdforms-validation')).toBeNull();
        const flagged = [...report.errors, ...report.warnings].filter(
          (issue) => issue.item.getProperty() === DEPENDENT
        );
        expect(flagged).toEqual([]);
      }
    );

    test('an empty mandatory field with fulfilled deps is still flagged', () => {
      const node = render(
        depsSource({ min: 1, pref: 1, max: 1 }),
        graphWithType(TYPE_A)
      );

      expect(node.textContent).toContain('Description');
      const message = node.querySelector(
        'dd.rdforms-value.error p.rdforms-validation-error'
      );
      expect(message?.textContent).toBe('at least one value is required');
    });

    test('existing values with unfulfilled deps render without padded placeholders', () => {
      const node = render(
        depsSource({ min: 2 }),
        graphWithType(TYPE_B, ['Only one'])
      );

      expect(node.textContent).toContain('Only one');
      expect(node.querySelector('p.rdforms-validation')).toBeNull();
    });
  });
});
