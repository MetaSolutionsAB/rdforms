define([
  'rdforms/view/renderingContext',
  'jquery',
  'select2',
], function(renderingContext, jquery) {

  renderingContext.renderSelect = function(fieldDiv, binding, context) {
    var choices = context.choices;
    var $select = jquery('<select>').appendTo(fieldDiv).append("<option></option>");

    for (var i = 0; i < choices.length; i++) {
      var c = choices[i];
      var desc;
      if (c.description) {
        desc = utils.getLocalizedValue(c.description).value;
      }

      jquery('<option>')
        .val(c.choice.value)
        .attr("title", desc || c.seeAlso || c.value)
        .text(c.label)
        .appendTo($select);
    }

    //new Select2($select, {placeholder: ""});
    $select.select2({
      placeholder: ""
    });

    //Sets the value if any
    if (binding.getValue()) {
      /*if (binding.getChoice().mismatch) {
       fSelect.set("displayedValue", binding.getValue());
       }*/
      $select.val(binding.getValue()).trigger("change");
    }

    $select.change(function () {
      binding.setValue($select.val());
    });

    context.clear = function () {
      $select.val(null).trigger("change");
    };
  };
});