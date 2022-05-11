/**
 * @see ./chooser.js
 */
const { renderingContext, system } = rdforms;
const fixedChoices = [
  { value: 'http://example.com/1', label: { en: 'Example 1' }, description: { en: 'hoppla' } },
  { value: 'http://example.com/2', label: { en: 'Example 2' } },
];

export default () => {
  renderingContext.chooserRegistry.itemtype('choice').register({
    getChoice(item, value) {
      const choice = {
        value: value,
        load: function(onSuccess, onError) {
          setTimeout(() => {
            // Update current choice instande rather than returning a new.
            delete choice.load;
            const foundChoice = fixedChoices.find(c => c.value === value);
            if (foundChoice) {
              choice.label = foundChoice.label;
              choice.description = foundChoice.description;
              onSuccess();
            } else {
              choice.label = { en: 'Upgradable choice' };
              choice.upgrade = function (binding, callback) {
                delete choice.upgrade;
                choice.label = { '': 'Upgraded choice' };
                callback(choice);
              };
              onSuccess();
            }
          }, 2000);
        },
      };
      return choice;
    },
    show(binding, onSelect, field) {
      if (field) {
        const struct = renderingContext.domCreate('div', field);
        renderingContext.domText(struct, 'Browse and select or create clicked');
      }
      onSelect({ value: 'http://example.com/3', label: { en: 'Example 3' } });
    },
    search() {
      return new Promise(success => success(fixedChoices));
    },
    supportsInlineCreate(/* binding */) {
      return true;
    },
  });
};
