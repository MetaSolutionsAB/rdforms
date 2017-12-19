define([
  'rdforms/view/renderingContext',
  'jquery',
  './util',
  'rdforms/view/bootstrap/components',
  'bmd/js/material',
  'bmd/js/ripples',
  'jquery.mousewheel',
  'rdforms/view/bmd/Selectize',
  'sizzle',
  'bootstrap/tooltip',
  'bootstrap/popover',
  'rdforms/view/bmd/DateTimeMD',
], (renderingContext, jquery, util) => {

  // initializeMaterial is not called more than once per X ms
  const updateMaterial = (node) => {
    if (jquery.material) {
      jquery.material.ripples(node);
      jquery.material.input(node);
      jquery.material.checkbox(node);
      jquery.material.radio(node);
      jquery.material.togglebutton(node);
    }
  };

  renderingContext.postEditorRenderer = function (fieldDiv, binding, context) {
    context.$controlDiv.appendTo(fieldDiv);
    updateMaterial(fieldDiv);
  };
});
