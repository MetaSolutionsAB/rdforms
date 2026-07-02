import ItemStore from './ItemStore';

// A minimal single-group template whose root source carries `@id`/`@type`
// aliases, so setId/setType exercise both the assignment and the alias delete.
const buildItem = () =>
  new ItemStore().createTemplate({
    root: 'testRoot',
    auxilliary: [{ '@id': 'testRoot', '@type': 'group', content: [] }],
  });

describe('Item setId/setType', () => {
  test('setId sets the id, drops the @id alias, and does not throw', () => {
    const item = buildItem();
    // Regression: setId referenced an undeclared `s` and threw ReferenceError.
    expect(() => item.setId('newId')).not.toThrow();
    expect(item.getId()).toBe('newId');
    expect(item.getSource(true)['@id']).toBeUndefined();
  });

  test('setType sets the type, drops the @type alias, and does not throw', () => {
    const item = buildItem();
    // Regression: setType referenced an undeclared `s` and threw ReferenceError.
    expect(() => item.setType('text')).not.toThrow();
    expect(item.getType(true)).toBe('text');
    expect(item.getSource(true)['@type']).toBeUndefined();
  });
});
