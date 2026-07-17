import ItemStore from './ItemStore';
import Group from './Group';
import PropertyGroup from './PropertyGroup';
import Choice from './Choice';
import Text from './Text';
import template1 from '../../test/fixtures/template1';

const buildTemplate1 = () => new ItemStore().createTemplate(template1);

describe('Create-ItemStore', () => {
  test('createTemplateStore', () => {
    const itemStore = new ItemStore();
    expect(itemStore).toBeInstanceOf(ItemStore);
  });

  test('createEmptyTemplate', () => {
    const itemStore = new ItemStore();
    // createTemplate() resolves `root` as an item id, so the empty root group is
    // registered in `auxilliary` and referenced by id.
    const template = itemStore.createTemplate({
      root: 'emptyRoot',
      auxilliary: [{ '@id': 'emptyRoot', '@type': 'group', content: [] }],
    });
    expect(template).toBeInstanceOf(Group);
    expect(template.getChildren()).toHaveLength(0);
    expect(template.getId()).toBe('emptyRoot');
  });

  test('createTemplateFromSource', () => {
    const children = buildTemplate1().getChildren();
    expect(children).toHaveLength(5);
    expect(children[0].getChildren()).toHaveLength(2);
  });

  test('checkPropertyGroup', () => {
    const children = buildTemplate1().getChildren();
    expect(children[4]).toBeInstanceOf(PropertyGroup);
    expect(children[4].getChildren()).toHaveLength(2);
    expect(children[4].getChildren()[0]).toBeInstanceOf(Choice);
    expect(children[4].getChildren()[1]).toBeInstanceOf(Group);
  });

  test('checkCachedChoices', async () => {
    const choice = buildTemplate1().getChildren()[3];
    expect(choice).toBeInstanceOf(Choice);
    const choices = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(
        () =>
          reject(
            new Error(
              'getDynamicChoices never invoked its callback — ontology lookup miss'
            )
          ),
        1000
      );
      choice.getDynamicChoices((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      });
    });
    expect(Array.isArray(choices)).toBe(true);
    expect(choices).toHaveLength(3);
  });
});

describe('ItemStore.createExtendedSource', () => {
  const itemStore = new ItemStore();

  test('merges the extension over the original and drops inherited id', () => {
    const merged = itemStore.createExtendedSource(
      { id: 'original', type: 'text', label: { en: 'Original' } },
      { label: { sv: 'Tillägg' } }
    );
    // The extension has no id, so the inherited id is removed.
    expect(merged.id).toBeUndefined();
    expect(merged.type).toBe('text');
    // Without an `enhanced` directive the extension's label simply overwrites.
    expect(merged.label).toEqual({ sv: 'Tillägg' });
    expect(merged.extends).toBeNull();
    expect(merged.children).toBeUndefined();
  });

  test('keeps an explicit id supplied by the extension', () => {
    const merged = itemStore.createExtendedSource(
      { id: 'original', type: 'text' },
      { id: 'extension' }
    );
    expect(merged.id).toBe('extension');
  });

  test('deep-merges the keys listed in a per-attribute enhanced map', () => {
    const merged = itemStore.createExtendedSource(
      { label: { en: 'English' }, cls: ['base'] },
      {
        label: { sv: 'Svenska' },
        cls: ['ext'],
        enhanced: { label: true, cls: true },
      }
    );
    // objects merge key-wise, arrays concatenate
    expect(merged.label).toEqual({ en: 'English', sv: 'Svenska' });
    expect(merged.cls).toEqual(['base', 'ext']);
  });

  test('enhanced === true deep-merges across all keys', () => {
    const merged = itemStore.createExtendedSource(
      { label: { en: 'English' } },
      { label: { sv: 'Svenska' }, enhanced: true }
    );
    expect(merged.label).toEqual({ en: 'English', sv: 'Svenska' });
  });

  test('an enhanced key absent from the extension keeps the original value', () => {
    const merged = itemStore.createExtendedSource(
      { description: { en: 'Original description' } },
      { label: { en: 'New label' }, enhanced: { description: true } }
    );
    expect(merged.description).toEqual({ en: 'Original description' });
  });
});

describe('ItemStore registration and lookup', () => {
  test('registerBundle stores the bundle and registers its items', () => {
    const itemStore = new ItemStore();
    const bundle = itemStore.registerBundle({ source: template1 });
    expect(itemStore.getBundles()).toContain(bundle);
    expect(itemStore.getItem('subjectVocab')).toBeInstanceOf(Choice);
  });

  test('id resolution helpers', () => {
    const itemStore = new ItemStore();
    itemStore.createTemplate(template1);
    expect(itemStore.getItem('subjectVocab')).toBeInstanceOf(Choice);
    expect(itemStore.getTemplate('subjectVocab')).toBe(
      itemStore.getItem('subjectVocab')
    );
    expect(itemStore.getItem(null)).toBeUndefined();
    expect(itemStore.getItemIds()).toContain('subjectVocab');
    expect(itemStore.getItems().length).toBeGreaterThan(0);
    expect(
      itemStore.getItemByProperty('http://purl.org/dc/terms/subject')
    ).toBeInstanceOf(Choice);
  });

  test('getChildren returns the group children and tolerates null', () => {
    const itemStore = new ItemStore();
    const root = itemStore.createTemplate(template1);
    expect(itemStore.getChildren(root)).toHaveLength(5);
    expect(itemStore.getChildren(root, true)).toHaveLength(5);
    expect(itemStore.getChildren(null)).toEqual([]);
  });

  test('removeItem clears the id and property registrations', () => {
    const itemStore = new ItemStore();
    itemStore.createTemplate(template1);
    const item = itemStore.getItem('subjectVocab');
    itemStore.removeItem(item);
    expect(itemStore.getItem('subjectVocab')).toBeUndefined();
    expect(
      itemStore.getItemByProperty('http://purl.org/dc/terms/subject')
    ).toBeUndefined();
  });
});

describe('ItemStore.renameItem', () => {
  // renameItem calls setId on the item, which mutates its source object; deep-clone
  // the shared template1 fixture so these tests don't pollute the others.
  const cloneTemplate1 = () => JSON.parse(JSON.stringify(template1));

  test('renames an item in the registry and updates its id', () => {
    const itemStore = new ItemStore();
    itemStore.createTemplate(cloneTemplate1());
    itemStore.renameItem('subjectVocab', 'renamedSubject');
    expect(itemStore.getItem('subjectVocab')).toBeUndefined();
    expect(itemStore.getItem('renamedSubject')).toBeInstanceOf(Choice);
    expect(itemStore.getItem('renamedSubject').getId()).toBe('renamedSubject');
  });

  test('throws when renaming to an existing id', () => {
    const itemStore = new ItemStore();
    itemStore.createTemplate(cloneTemplate1());
    expect(() =>
      itemStore.renameItem('subjectVocab', 'publisheddate')
    ).toThrow();
  });

  test('throws when renaming to an empty id', () => {
    const itemStore = new ItemStore();
    itemStore.createTemplate(cloneTemplate1());
    expect(() => itemStore.renameItem('subjectVocab', '')).toThrow();
  });
});

describe('ItemStore.createItem', () => {
  const buildStore = () => {
    const itemStore = new ItemStore();
    itemStore.createTemplate(template1);
    return itemStore;
  };

  test('throws when extending an unknown item', () => {
    expect(() =>
      buildStore().createItem({ '@type': 'text', extends: 'no-such-item' })
    ).toThrow();
  });

  test('extends a known item and returns the fleshed-out item', () => {
    // The extended source inherits the base's @id, so creating it logs an
    // id-conflict; silence that expected noise.
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const item = buildStore().createItem({
      '@type': 'text',
      extends: 'publisheddate',
      property: 'http://example.com/extended',
    });
    expect(item).toBeInstanceOf(Text);
    logSpy.mockRestore();
  });

  test('throws when neither type nor id is provided', () => {
    expect(() => buildStore().createItem({})).toThrow();
  });

  test('throws when referencing an unknown id', () => {
    expect(() => buildStore().createItem({ id: 'ghost' })).toThrow();
  });

  test('clones a referenced item when extra properties are present', () => {
    const cloned = buildStore().createItem({
      id: 'subjectVocab',
      label: { en: 'Overridden' },
    });
    expect(cloned).toBeInstanceOf(Choice);
    expect(cloned.getLabel()).toBe('Overridden');
  });

  test('logs a conflict when overwriting an existing id', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    buildStore().createItem({ '@id': 'subjectVocab', '@type': 'choice' });
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  test('routes errors through handleErrorAs instead of throwing', () => {
    const itemStore = buildStore();
    itemStore.handleErrorAs = 'warn';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => itemStore.createItem({})).not.toThrow();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
