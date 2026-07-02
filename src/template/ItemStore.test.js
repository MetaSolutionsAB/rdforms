import ItemStore from './ItemStore';
import Group from './Group';
import PropertyGroup from './PropertyGroup';
import Choice from './Choice';
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
