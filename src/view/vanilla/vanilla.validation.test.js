// Validation presenter for the vanilla flavor: the shared validation logic
// (validationMixin) layered on VanillaPresenter, so the report renders inside
// the semantic <dl>/<dt>/<dd> structure. Runs under the jsdom jest project.
import { Graph } from '@entryscape/rdfjson';
import ItemStore from '../../template/ItemStore';
import { match } from '../../model/engine';
import './all'; // registers the vanilla renderingContext hooks (incl. renderValidationMessage)
import VanillaValidationPresenter from './VanillaValidationPresenter';

const RESOURCE = 'http://example.org/r';
const REQUIRED = 'http://purl.org/dc/terms/title';
const NAME = 'http://xmlns.com/foaf/0.1/name';

const render = (source, graphData) => {
  const root = new ItemStore().createTemplate(source);
  const binding = match(new Graph(graphData), RESOURCE, root);
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
    expect(node.querySelector('.rdformsRow, .rdformsField, .rdformsFields')).toBeNull();
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
});
