import renderingContext from '../renderingContext';
import system from '../../model/system';
import './auto';
import './labels';
import './text';
import './choice';
import './buttons';
import './table';

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
  const it = binding.getItem().getType();
  if (it !== 'group' && context.noCardinalityButtons !== true) {
    renderingContext.addRemoveButton(fieldDiv, binding, context);
  }
};

renderingContext.preEditorViewRenderer = (viewNode, binding, context) => {
  const item = binding.getItem();
  if (!context.hideAddress) {
    let $element;
    if (item.hasStyle('showURI')) {
      $element = jquery('<div class="rdformsField rdformsGroupURI">').text(binding.getValue());
    } else if (item.hasStyle('showLink')) {
      $element = jquery('<a class="rdformsField rdformsGroupURI rdformsUrl">').text(binding.getValue())
        .attr('href', binding.getValue());
      system.attachExternalLinkBehaviour($element[0], binding);
    }

    if ($element) {
      const $row = jquery('<div class="rdformsRow">').appendTo(viewNode);
      if (context.topLevel) {
        $row.addClass('rdformsTopLevel');
      }
      jquery('<div class="rdformsLabel">').text(context.view.messages.address_label).appendTo($row);
      $element.appendTo(jquery('<div class="rdformsFields">').appendTo($row));
    }
  }
};
renderingContext.prePresenterViewRenderer = renderingContext.preEditorViewRenderer;

renderingContext.postEditorRenderer = (fieldDiv, binding, context) => {
  context.$controlDiv.appendTo(fieldDiv);
};
