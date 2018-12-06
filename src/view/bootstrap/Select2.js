import renderingContext from '../renderingContext';
import utils from '../../utils';
import ArrayAdapter from 'select2/src/js/select2/data/array';
import Select2QueryAdapter from './Select2QueryAdapter';
import 'select2/src/js/jquery.select2';

renderingContext.renderSelect = (fieldDiv, binding, context) => {
  const choices = context.choices;
  const $select = jquery('<select>').appendTo(fieldDiv).append('<option></option>');

  const options = {
    placeholder: binding.getItem().getPlaceholder() || '',
    rdformsItem: binding.getItem(),
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
    const label = utils.getLocalizedValue(choice.label).value || '';
    if ($select.find(`option[value='${choice.value}']`).length === 0) {
      $select.append(new Option(label, choice.value, true, true)).trigger('change');
      $select.trigger({
        type: 'select2:select',
        params: {
          data: {id: choice.val, text: label, choice},
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
      $node.attr('title', utils.getLocalizedValue(choice.description).value);
    }
  });
};
