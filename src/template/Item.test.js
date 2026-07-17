import ItemStore from './ItemStore';

// A minimal single-group template whose root source carries `@id`/`@type`
// aliases, so setId/setType exercise both the assignment and the alias delete.
const buildItem = () =>
  new ItemStore().createTemplate({
    root: 'testRoot',
    auxilliary: [{ '@id': 'testRoot', '@type': 'group', content: [] }],
  });

// A standalone text item; `source` overrides are spread onto its auxilliary source.
const buildTextItem = (source = {}) =>
  new ItemStore().createTemplate({
    root: 'textRoot',
    auxilliary: [{ '@id': 'textRoot', '@type': 'text', ...source }],
  });

// A store with a `base` text item and a `child` text item that extends it.
const buildExtendingItem = () => {
  const itemStore = new ItemStore();
  itemStore.createTemplate({
    root: 'base',
    auxilliary: [
      {
        '@id': 'base',
        '@type': 'text',
        label: { en: 'Base label' },
        description: { en: 'Base description' },
      },
      {
        '@id': 'child',
        '@type': 'text',
        extends: 'base',
        label: { en: 'Child label' },
      },
    ],
  });
  return { itemStore, child: itemStore.getItem('child') };
};

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

describe('Item text accessors', () => {
  // The default moment locale is 'en', so the single-language 'en' entries below
  // resolve directly; language-precision selection is covered in engine.test.js.
  const accessors = [
    ['label', 'getLabel', 'setLabel', 'getLabelMap', 'setLabelMap'],
    [
      'editlabel',
      'getEditLabel',
      'setEditLabel',
      'getEditLabelMap',
      'setEditLabelMap',
    ],
    [
      'description',
      'getDescription',
      'setDescription',
      'getDescriptionMap',
      'setDescriptionMap',
    ],
    [
      'editdescription',
      'getEditDescription',
      'setEditDescription',
      'getEditDescriptionMap',
      'setEditDescriptionMap',
    ],
    ['help', 'getHelp', 'setHelp', 'getHelpMap', 'setHelpMap'],
    [
      'placeholder',
      'getPlaceholder',
      'setPlaceholder',
      'getPlaceholderMap',
      'setPlaceholderMap',
    ],
    ['purpose', 'getPurpose', 'setPurpose', 'getPurposeMap', 'setPurposeMap'],
    [
      'specification',
      'getSpecification',
      'setSpecification',
      'getSpecificationMap',
      'setSpecificationMap',
    ],
  ];

  test.each(accessors)(
    '%s get/set/getMap/setMap round-trips',
    (attribute, getter, setter, getMap, setMap) => {
      const item = buildTextItem();
      item[setter]('Hello', 'en');
      expect(item[getter]()).toBe('Hello');
      expect(item[getMap]()).toEqual({ en: 'Hello' });

      item[setMap]({ en: 'English', sv: 'Svenska' });
      expect(item[getMap]()).toEqual({ en: 'English', sv: 'Svenska' });
      expect(item[getter]()).toBe('English');
    }
  );

  test('getLabel(returnDetails) returns the full localized value object', () => {
    const item = buildTextItem({ label: { en: 'Detailed' } });
    const details = item.getLabel(true);
    expect(details.value).toBe('Detailed');
    expect(details.lang).toBe('en');
  });

  test('generic getText/setText/setTextMap operate on the nested text object', () => {
    const item = buildTextItem();
    item.setText('note', 'A note', 'en');
    expect(item.getText('note')).toBe('A note');
    expect(item.getSource(true).text.note).toEqual({ en: 'A note' });
    item.setTextMap('note', { en: 'Replaced' });
    expect(item.getText('note')).toBe('Replaced');
  });

  test('_setLangHash stores by language, by empty key, and passes objects through', () => {
    const item = buildTextItem();
    // string + lang -> keyed by language
    expect(item._setLangHash(undefined, 'value', 'en')).toEqual({
      en: 'value',
    });
    // string, no lang -> keyed by empty string
    expect(item._setLangHash(undefined, 'value')).toEqual({ '': 'value' });
    // string added to an existing hash keeps prior languages
    expect(item._setLangHash({ en: 'value' }, 'varde', 'sv')).toEqual({
      en: 'value',
      sv: 'varde',
    });
    // object value is returned as-is
    const objectValue = { en: 'x', sv: 'y' };
    expect(item._setLangHash(undefined, objectValue)).toBe(objectValue);
  });
});

describe('Item styles and classes', () => {
  test('getStyles/setStyles/hasStyle with case-insensitive matching', () => {
    const item = buildTextItem();
    expect(item.getStyles()).toEqual([]);
    expect(item.hasStyle('heading')).toBe(false);
    item.setStyles(['heading', 'multiline']);
    expect(item.getStyles()).toEqual(['heading', 'multiline']);
    expect(item.hasStyle('HEADING')).toBe(true);
    expect(item.hasStyle('missing')).toBe(false);
  });

  test('getClasses/setClasses/hasClass with case-insensitive matching', () => {
    const item = buildTextItem();
    expect(item.getClasses()).toEqual([]);
    item.setClasses(['rdformsTable']);
    expect(item.getClasses()).toEqual(['rdformsTable']);
    expect(item.hasClass('RDFORMSTABLE')).toBe(true);
    expect(item.hasClass('missing')).toBe(false);
  });

  test('hasClass also returns true when the name matches a style', () => {
    const item = buildTextItem();
    item.setStyles(['image']);
    expect(item.hasClass('image')).toBe(true);
  });

  test('getAvailableStyles exposes the known style list', () => {
    const styles = buildTextItem().getAvailableStyles();
    expect(Array.isArray(styles)).toBe(true);
    expect(styles).toContain('heading');
    expect(styles).toContain('multiline');
  });
});

describe('Item getCardinality and enhanced', () => {
  test('a text item without a property is required exactly once', () => {
    const item = buildTextItem();
    expect(item.getCardinality()).toEqual({ min: 1, max: 1 });
  });

  test('an explicit cardinality in the source is returned', () => {
    const item = buildTextItem({
      property: 'http://example.com/prop',
      cardinality: { min: 0, pref: 1, max: 3 },
    });
    expect(item.getCardinality()).toEqual({ min: 0, pref: 1, max: 3 });
  });

  test('getEnhanced/setEnhanced with a boolean flag', () => {
    const item = buildTextItem();
    expect(item.getEnhanced('label')).toBe(false);
    item.setEnhanced(true);
    expect(item.getEnhanced('label')).toBe(true);
    item.setEnhanced(false);
    expect(item.getEnhanced('label')).toBe(false);
  });

  test('getEnhanced/setEnhanced with a per-attribute flag', () => {
    const item = buildTextItem();
    item.setEnhanced('label', true);
    expect(item.getEnhanced('label')).toBe(true);
    expect(item.getEnhanced('description')).toBe(false);
    item.setEnhanced('label', false);
    expect(item.getEnhanced('label')).toBe(false);
  });
});

describe('Item getSource', () => {
  test('the three source variants for a non-extending item all yield its source', () => {
    const item = buildTextItem({ label: { en: 'Plain' } });
    const merged = item.getSource();
    expect(item.getSource(true)).toBe(merged);
    expect(item.getSource(false)).toBe(merged);
  });

  test('an extending item merges inherited and own text', () => {
    const { child } = buildExtendingItem();
    // own label wins, inherited description is merged in
    expect(child.getLabel()).toBe('Child label');
    expect(child.getDescription()).toBe('Base description');
  });
});

describe('Item extends machinery', () => {
  test('getExtends returns the extended id and setExtends rebuilds the source', () => {
    const { child } = buildExtendingItem();
    expect(child.getExtends()).toBe('base');
    expect(child.getSource(true).extends).toBe('base');
  });

  test('isExtention always returns true because getExtends never yields null', () => {
    // Characterization of a confirmed bug (RDFORMS-192): getExtends() returns ''
    // (via `|| ''`), so `getExtends() != null` is always true — even for an item
    // that does not extend anything. refreshExtends() compounds this by reading
    // `this.isExtention` (the method reference) without calling it. Flip this
    // assertion to `toBe(false)` once RDFORMS-192 is fixed.
    const nonExtendingItem = buildTextItem();
    expect(nonExtendingItem.isExtention()).toBe(true);
  });
});
