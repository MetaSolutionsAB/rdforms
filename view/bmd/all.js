define([
  "rdforms/view/renderingContext",
  "jquery",
  "rdforms/view/bootstrap/components",
  'bmd/js/material',
  'bmd/js/ripples',
  "jquery.mousewheel",
  "rdforms/view/bmd/Selectize",
  "sizzle",
  "bootstrap/tooltip",
  "bootstrap/popover",
  "rdforms/view/bmd/DateTimeMD",
], function(renderingContext, jquery) {

  renderingContext.postEditorRenderer = function (fieldDiv, binding, context) {
    context.$controlDiv.appendTo(fieldDiv);
    if (jquery.material) {
      jquery.material.init(fieldDiv);
    }
  };
});