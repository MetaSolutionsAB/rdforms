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
  const initializeMaterial = util.throttle(() => {
    if (jquery.material) {
      jquery.material.init();
    }
  }, 300, { leading: false });


  renderingContext.postEditorRenderer = function (fieldDiv, binding, context) {
    context.$controlDiv.appendTo(fieldDiv);
    initializeMaterial();
  };
});
