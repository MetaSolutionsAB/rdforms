define([
  'rdforms/view/renderingContext',
  'jquery',
  "rdforms/utils",
  'selectize',
], function(renderingContext, jquery, utils) {

  renderingContext.renderSelect = function(fieldDiv, binding, context) {
    var choices = context.choices;
    var formgroup = jquery('<div class="form-group selectizeException">').appendTo(fieldDiv);
    var $select = jquery('<div class="form-control">').appendTo(formgroup);

    var choices = [{
      label: ' ',
      value: ''
    }];
    for (var i = 0; i < context.choices.length; i++) {
      var c = context.choices[i];
      var desc;
      if (c.description) {
        desc = utils.getLocalizedValue(c.description).value;
      }

      choices.push({
        label: c.label,
        title: desc || c.seeAlso || c.value,
        value: c.choice.value,
      });
    }

    //new Select2($select, {placeholder: ""});
    $select.selectize({
      options: choices,
      valueField: 'value',
      labelField: 'label',
      sortField: 'label',
      searchField: 'label',
      allowEmptyOption: false,
      maxItems: 1,
      mode: 'single',
      onChange: function(value) {
        binding.setValue($select.val());
      }
    });

    //Sets the value if any
    if (binding.getValue()) {
      /*if (binding.getChoice().mismatch) {
       fSelect.set("displayedValue", binding.getValue());
       }*/
      $select.val(binding.getValue()).trigger("change");
    }

/*    $select.change(function () {
      binding.setValue($select.val());
    });*/

    context.clear = function () {
      $select.val(null).trigger("change");
    };
  };
});