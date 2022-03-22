import jquery from 'jquery';
import renderingContext from '../renderingContext';
import Editor from '../Editor';

renderingContext.renderEditorLabel = (rowNode, binding, item, context) => {
  if (item.hasStyle('nonEditable') || item.hasStyle('heading')) {
    return renderingContext.renderPresenterLabel(rowNode, binding, item, context, true);
  }

  let label = item.getEditLabel() || item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  const $labelDiv = jquery('<div class="rdformsLabelRow">').appendTo(rowNode);
  context.labelNode = $labelDiv[0];
  const $label = jquery('<span class="rdformsLabel">').text(label).appendTo($labelDiv);
  const card = item.getCardinality();
  const b = context.view.messages;
  if (card.min > 0) {
    jquery('<span class="rdformsMark rdformsMandatoryMark">').text(b.mandatoryMark)
      .appendTo($labelDiv);
  } else if (card.pref > 0) {
    jquery('<span class="rdformsMark rdformsRecommendedMark">').text(b.recommendedMark)
      .appendTo($labelDiv);
  } else {
    jquery('<span class="rdformsMark rdformsOptionalMark">').text(b.optionalMark)
      .appendTo($labelDiv);
  }

  renderingContext.attachItemInfo(item, $label[0], context);

  if (binding == null) {
    renderingContext.addExpandButton(rowNode, $labelDiv[0], item, context);
    return undefined;
  }
  // If table, no add or remove buttons.
  if (context.view.showAsTable(item)) {
    return undefined;
  }
  if (card.max != null && (card.max === card.min)) {
    return undefined;
  }

  if (item.getType() === 'group') {
    renderingContext.addGroupButtons(rowNode, $labelDiv[0], binding, context);
  } else {
    renderingContext.addCreateChildButton(rowNode, $labelDiv[0], binding, context);
  }
  return undefined;
};

renderingContext.attachItemInfo = function (item, aroundNode, context) {
  if (item == null || (item.getProperty() == null && item.getDescription() == null
    && item.getEditDescription() == null)) {
    jquery(aroundNode).addClass('noPointer');
    return;
  }

  const description = (context.view instanceof Editor ?
    item.getEditDescription() || item.getDescription() : item.getDescription()) || '';
  let propinfo = '';
  if (item.getProperty()) {
    propinfo = `<div class="property"><a target="_blank" href="${item.getProperty()}">${
      item.getProperty()}</a></div>`;
  }

  let label = context.view instanceof Editor ? item.getEditLabel() || item.getLabel() : item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  const popoverOptions = {
    html: true,
    container: renderingContext.getPopoverContainer(),
    placement: 'auto',
    trigger: 'focus',
    title: label,
    content: `<div class="description">${
      description.replace(/(\r\n|\r|\n)/g, '<br/>')
      }</div>${propinfo}`,
  };
  jquery(aroundNode).popover(popoverOptions).attr('data-toggle', 'popover');
};
