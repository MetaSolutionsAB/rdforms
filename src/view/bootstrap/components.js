import jquery from 'jquery';
import renderingContext from '../renderingContext';
import system from '../../model/system';
import '../jquery/components';
import './auto';
import './labels';
import './text';
import './choice';
import './buttons';
import './table';

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

renderingContext.postEditorRenderer = (fieldDiv, binding, context) => {
  context.$controlDiv.appendTo(fieldDiv);
};

const type2class = {
  error: 'exclamation-triangle',
  warning: 'exclamation-circle',
  deprecated: 'question-circle',
};

renderingContext.renderValidationMessage = (fieldDiv, type, message) => {
  const cls = type2class[type];
  const nw = renderingContext.domCreate('div', fieldDiv);
  renderingContext.domClassToggle(nw, 'rdformsValidationMessageWrapper', true);
  const i = renderingContext.domCreate('i', nw);
  renderingContext.domClassToggle(i, `fas fa-${cls}`, true);
  const n = renderingContext.domCreate('span', nw);
  renderingContext.domClassToggle(n, 'rdformsValidationMessage', true);
  renderingContext.domText(n, message);
};
