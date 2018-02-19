define([
  'rdforms/view/renderingContext',
  'jquery',
  'rdforms/view/bootstrap/labels',
  'rdforms/view/bootstrap/text',
  'rdforms/view/bootstrap/choice',
  'rdforms/view/bootstrap/buttons',
  'rdforms/view/bootstrap/table',
  'rdforms/view/bootstrap/auto',
], (renderingContext, jquery) => {
  renderingContext.domQuery = (selector, node) => jquery(selector, node)[0];

  renderingContext.domCreate = (nodeStr, parent) => jquery(`<${nodeStr}>`).appendTo(parent)[0];

  renderingContext.domCreateAfter = (nodeStr, sibling) => {
    const node = jquery(`<${nodeStr}>`);
    jquery(sibling).after(node);
    return node;
  };
  renderingContext.domSetAttr = (node, attr, value) => {
    jquery(node).attr(attr, value);
  };

  renderingContext.domText = (node, text) => {
    jquery(node).text(text);
  };

  renderingContext.domClassToggle = (node, classStr, addOrRemove) => {
    jquery(node).toggleClass(classStr, addOrRemove);
  };

  renderingContext.preEditorRenderer = (fieldDiv, binding, context) => {
    context.$controlDiv = jquery('<div class="rdformsFieldControl">');
    context.controlDiv = context.$controlDiv[0];
    if (it !== 'group' && context.noCardinalityButtons !== true) {
      renderingContext.addRemoveButton(fieldDiv, binding, context);
    }
  };

  renderingContext.postEditorRenderer = (fieldDiv, binding, context) => {
    context.$controlDiv.appendTo(fieldDiv);
  };
});
