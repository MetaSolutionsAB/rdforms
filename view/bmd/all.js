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
      jquery(node).find(jquery.material.options.withRipples).each((idx, el) => {
        jquery.material.ripples(el);
      });
      jquery(node).find(jquery.material.options.inputElements).each((idx, el) => {
        jquery.material.input(el);
      });
      jquery(node).find(jquery.material.options.checkboxElements).each((idx, el) => {
        jquery.material.checkbox(el);
      });
      jquery(node).find(jquery.material.options.radioElements).each((idx, el) => {
        jquery.material.radio(el);
      });
      jquery(node).find(jquery.material.options.togglebuttonElements).each((idx, el) => {
        jquery.material.togglebutton(el);
      });
    }
  };

  const updateExternalGraphUI = (node, binding) => { // change background color
    node.classList.add('rdformsExternal');

    // add ng icon/info
    const newDiv = document.createElement('div');
    newDiv.classList.add('rdformsExternalInfo');

    const newA = document.createElement('a');
    newA.setAttribute('href', '#');
    newA.setAttribute('data-toggle', 'popover');
    newA.setAttribute('data-container', 'body');
  //<button type="button" class="btn btn-default" data-container="body" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">Left</button>

    newA.setAttribute('title', 'Source'); // nls
    newA.setAttribute('data-content', `<a href="${binding._statement.getNamedGraph()}">DBPedia</a>`); // nls

    const newI = document.createElement('i');
    newI.classList.add('fa', 'fa-info');
    newA.appendChild(newI);
    newDiv.appendChild(newA);

    node.appendChild(newDiv);

    jquery(newA).popover({
      html: true,
      placement: 'auto',
      template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3' +
      ' class="popover-title"></h3><div class="popover-content"><a></a></div></div>',
      trigger: 'focus',
      title: 'Source',
    });
  };

  renderingContext.postEditorRenderer = function (fieldDiv, binding, context) {
    context.$controlDiv.appendTo(fieldDiv);
    updateMaterial(fieldDiv);
  };


  renderingContext.postPresenterRenderer = function (fieldDiv, binding, context) {
    if (binding.isReadOnly()) {
      updateExternalGraphUI(fieldDiv, binding);
    }
  };
});
