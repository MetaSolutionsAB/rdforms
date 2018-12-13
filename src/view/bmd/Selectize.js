import 'selectize';
import renderingContext from '../renderingContext';
import system from '../../model/system';
import utils from '../../utils';

renderingContext.renderSelect = function (fieldDiv, binding, context) {
  const formgroup = jquery('<div class="form-group selectizeException">').appendTo(fieldDiv);
  const formcontrol = jquery('<div class="form-control">').appendTo(formgroup);
  const $select = jquery('<input type="text">').appendTo(formcontrol);

  const items = [];
  // Sets the value if any
  if (binding.getValue()) {
    items.push(binding.getValue());
  }
  let sel;
  const settings = {
    items,
    valueField: 'id',
    labelField: 'text',
    sortField: 'text',
    searchField: 'text',
    allowEmptyOption: false,
    preload: 'focus',
    maxItems: 1,
    mode: 'single',
    onChange(value) {
      const op = sel.options[value];
      binding.setChoice(op ? op.choice : null);
      this.clearCache();
    },
  };
  let disable = true;
  if (context.choices && context.choices.length > 0) {
    disable = false;
    settings.options = context.choices;
  } else if (context.chooser && typeof context.chooser.search === 'function') {
    disable = false;
    settings.load = (query, callback) => {
      context.chooser.search(binding.getItem(), query).then((choices) => {
        callback(choices.map(c => ({
          id: c.value,
          text: utils.getLocalizedValue(c.label).value || '',
          choice: c,
        })));
      });
    };
  }
  sel = $select.selectize(settings)[0].selectize;

  if (disable) {
    sel.disable();
  }

  context.clear = () => {
    $select.val(null).trigger('change');
  };
  context.setValue = (choice) => {
    $select.toggleClass('mismatch', choice.mismatch === true);
    const label = utils.getLocalizedValue(choice.label).value || '';
    const op = sel.options[choice.value];
    if (!op) {
      sel.addOption({id: choice.value, text: label, choice});
    }
    sel.addItem(choice.value, true);
    // $select.val(choice.value).trigger('change');
  };
};
