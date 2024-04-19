import '@selectize/selectize/dist/js/standalone/selectize.min';
//import '@selectize/selectize/dist/css/selectize.bootstrap4.css';
import renderingContext from '../renderingContext';
import utils from '../../utils';
import { getNamedGraphId } from '../viewUtils';

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
      context.chooser.search(binding, query).then((choices) => {
        callback(choices.map(c => ({
          id: c.value,
          text: utils.getLocalizedValue(c.editlabel || c.label, context.view.getLocale()).value || '',
          choice: c,
        })));
      });
    };
  }
  sel = $select.selectize(settings)[0].selectize;

  if (disable || getNamedGraphId(binding, context)) {
    sel.disable();
  }

  context.clear = () => {
    sel.clear();
  };
  context.setValue = (choice) => {
    $select.toggleClass('mismatch', choice.mismatch === true);
    const label = utils.getLocalizedValue(choice.editlabel || choice.label, context.view.getLocale()).value || '';
    const op = sel.options[choice.value];
    if (!op) {
      sel.addOption({ id: choice.value, text: label, choice });
    }
    sel.addItem(choice.value, true);
    // $select.val(choice.value).trigger('change');
  };
};
