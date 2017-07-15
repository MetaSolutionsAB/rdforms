define([
  "rdforms/view/renderingContext",
  "jquery",
  "rdforms/view/bootstrap/components",
  'bmd/material',
  'bmd/ripples',
  "jquery.mousewheel",
  "select2/jquery.select2",
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