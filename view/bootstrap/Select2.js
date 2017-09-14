define([
  'rdforms/view/renderingContext',
  'jquery',
  'rdforms/utils',
  'select2',
], (renderingContext, jquery, utils) => {
  renderingContext.renderSelect = (fieldDiv, binding, context) => {
    const choices = context.choices;
    const $select = jquery('<select>').appendTo(fieldDiv).append('<option></option>');

    for (let i = 0; i < choices.length; i++) {
      const c = choices[i];
      let desc;
      if (c.description) {
        desc = utils.getLocalizedValue(c.description).value;
      }

      jquery('<option>')
        .val(c.choice.value)
        .attr('title', desc || c.seeAlso || c.value)
        .text(c.label)
        .appendTo($select);
    }

    // new Select2($select, {placeholder: ""});
    $select.select2({
      placeholder: '',
    });

    // Sets the value if any
    if (binding.getValue()) {
      /* if (binding.getChoice().mismatch) {
       fSelect.set("displayedValue", binding.getValue());
       }*/
      $select.val(binding.getValue()).trigger('change');
    }

    $select.change(() => {
      binding.setValue($select.val());
    });

    context.clear = () => {
      $select.val(null).trigger('change');
    };
  };
});
