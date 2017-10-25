define([
  'rdforms/view/renderingContext',
  'jquery',
  'rdforms/utils',
  'selectize',
], (renderingContext, jquery, utils) => {
  renderingContext.renderSelect = function (fieldDiv, binding, context) {
    const formgroup = jquery('<div class="form-group selectizeException">').appendTo(fieldDiv);
    const $select = jquery('<div class="form-control">').appendTo(formgroup);
    const choices = [{
      label: ' ',
      value: '',
    }];
    for (let i = 0; i < context.choices.length; i++) {
      const c = context.choices[i];
      let desc;
      if (c.description) {
        desc = utils.getLocalizedValue(c.description).value;
      }

      choices.push({
        label: c.label,
        title: desc || c.seeAlso || c.value,
        value: c.choice.value,
      });
    }
    const items = [];
    // Sets the value if any
    if (binding.getValue()) {
      items.push(binding.getValue());
    }

    // new Select2($select, {placeholder: ""});
    $select.selectize({
      options: choices,
      items,
      valueField: 'value',
      labelField: 'label',
      sortField: 'label',
      searchField: 'label',
      allowEmptyOption: false,
      maxItems: 1,
      mode: 'single',
      onChange(/* value */) {
        binding.setValue($select.val());
        this.clearCache();
      },
    });

/*    $select.change(function () {
      binding.setValue($select.val());
    });*/

    context.clear = function () {
      $select.val(null).trigger('change');
    };
  };
});
