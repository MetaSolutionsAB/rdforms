import ArrayAdapter from 'select2/src/js/select2/data/array';
import 'select2';
import renderingContext from '../renderingContext';
import utils from '../../utils';
import Select2QueryAdapter from './Select2QueryAdapter';
import { getNamedGraphId } from '../viewUtils';


renderingContext.renderSelect = (fieldDiv, binding, context) => {
  const choices = context.choices;
  const disabledAttr = getNamedGraphId(binding, context) ? 'disabled' : '';
  const $select = jquery(`<select ${disabledAttr}>`).appendTo(fieldDiv).append('<option></option>');

  const options = {
    placeholder: binding.getItem().getPlaceholder() || '',
    rdformsItem: binding.getItem(),
    binding,
    chooser: context.chooser,
  };
  if (choices && choices.length > 0) {
    options.data = choices;
    options.dataAdapter = ArrayAdapter;
  } else {
    options.dataAdapter = Select2QueryAdapter;
    $select.prop('disabled', !context.chooser || typeof context.chooser.search !== 'function');
  }
  $select.select2(options);

  context.clear = () => {
    $select.val(null).trigger('change');
  };
  context.setValue = (choice) => {
    $select.toggleClass('mismatch', choice.mismatch === true);
    const label = utils.getLocalizedValue(choice.editlabel || choice.label, context.view.getLocale()).value || '';
    if ($select.find(`option[value='${choice.value}']`).length === 0) {
      $select.append(new Option(label, choice.value, true, true)).trigger('change');
      $select.trigger({
        type: 'select2:select',
        params: {
          data: { id: choice.val, text: label, choice },
        },
      });
    } else {
      $select.val(choice.value).trigger('change');
    }
  };

  $select.on('select2:select', (params) => {
    const choice = params.params.data.choice;
    binding.setChoice(choice);
    $select.toggleClass('mismatch', choice.mismatch);
    const $node = $select.next().find('.select2-selection__rendered');
    if (choice.description) {
      $node.attr('title',
        utils.getLocalizedValue(choice.editdescription || choice.description, context.view.getLocale()).value);
    }
  });
};
