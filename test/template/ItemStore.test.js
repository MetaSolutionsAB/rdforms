import ItemStore from '../../src/template/ItemStore';
import Group from '../../src/template/Group';
import PropertyGroup from '../../src/template/PropertyGroup';
import Choice from '../../src/template/Choice';
import template1 from '../fixtures/template1';

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
    const choices = await new Promise((resolve) => {
      choice.getDynamicChoices(resolve);
    });
    expect(choices).toHaveLength(3);
  });
});
