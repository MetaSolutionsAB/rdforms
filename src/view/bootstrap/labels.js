import jquery from 'jquery';
import renderingContext from '../renderingContext';
import Editor from '../Editor';
import utils from '../../utils';


renderingContext.renderEditorLabel = (rowNode, binding, item, context) => {
  if (item.hasStyle('nonEditable') || item.hasStyle('heading')) {
    return renderingContext.renderPresenterLabel(rowNode, binding, item, context, true);
  }

  const labelMap = item.getEditLabelMap() || item.getLabelMap();
  let label = utils.getLocalizedValue(labelMap, context.view.getLocale()).value
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  const $labelDiv = jquery('<div class="rdformsLabelRow">').appendTo(rowNode);
  if (binding) {
    $labelDiv.attr('id', context.view.createLabelIndex(binding));
  }
  context.labelNode = $labelDiv[0];
  const $label = jquery('<span class="rdformsLabel" tabindex="0">').text(label).appendTo($labelDiv);
  const card = item.getCardinality();
  const b = context.view.messages;
  // Only show mark if there is a property that allows the item to have an expression on its own
  if (item.getProperty()) {
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
  }

  // Buttons of various sorts
  if (binding == null) {
    renderingContext.addExpandButton(rowNode, $labelDiv[0], item, context);
  } else if (!context.view.showAsTable(item) &&
    (card.max === null || card.max !== card.min)) {
    // If not table or min and max are not the same, then add buttons.
    if (item.getType() === 'group') {
      if (item.getProperty()) {
        renderingContext.addGroupButtons(rowNode, $labelDiv[0], binding, context);
      }
    } else {
      renderingContext.addCreateChildButton(rowNode, $labelDiv[0], binding, context);
    }
  }

  const view = context.view;
  if (item.hasStyle('showDescriptionInEdit') || view.showDescription) {
    // An item is compact if it is exclicitly set as compact or
    // the view is set as compact and the item is not explicitly set as not compact AND
    // we are at the top
    const compactField = item.hasStyle('compact') ||
      (view.compact && !item.hasStyle('nonCompact') && (
        (view.topLevel && item.getType() !== 'group') ||
        (view.parentView && view.parentView.topLevel && view.binding.getItem().hasStyle('heading'))));
    const descMap = context.view instanceof Editor ? item.getEditDescriptionMap() || item.getDescriptionMap() :
      item.getDescriptionMap();
    let desc = utils.getLocalizedValue(descMap, context.view.getLocale()).value

    if (!compactField && desc) {
      jquery('<div class="rdformsDescription">').text(desc).appendTo(rowNode);
    }
  }
  renderingContext.attachItemInfo(item, $label[0], context);

  return undefined;
};

renderingContext.attachItemInfo = function (item, aroundNode, context) {
  if (context.view.popupOnLabel === false) {
    renderingContext.domClassToggle(aroundNode, 'rdformsNoPopup', true);
    return;
  }
  renderingContext.domSetAttr(aroundNode, 'role', 'button');
  if (item == null || (item.getProperty() == null && item.getDescriptionMap() == null
    && item.getEditDescriptionMap() == null)) {
    jquery(aroundNode).addClass('noPointer');
    return;
  }

  const descriptionMap = (context.view instanceof Editor ?
    item.getEditDescriptionMap() || item.getDescriptionMap() : item.getDescriptionMap()) || {};
  const description = utils.getLocalizedValue(descriptionMap, context.view.getLocale()).value || '';

  let propinfo = '';
  if (item.getProperty()) {
    propinfo = `<div class="property"><a target="_blank" href="${item.getProperty()}">${
      item.getProperty()}</a></div>`;
  }

  const labelMap = context.view instanceof Editor ? item.getEditLabelMap() || item.getLabelMap() : item.getLabelMap();
  let label = utils.getLocalizedValue(labelMap, context.view.getLocale()).value

  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  const popoverOptions = {
    html: true,
    container: aroundNode, // renderingContext.getPopoverContainer(),
    placement: 'auto',
    trigger: 'focus',
    title: label,
    content: `<div class="description">${
      description.replace(/(\r\n|\r|\n)/g, '<br/>')
      }</div>${propinfo}`,
  };
  jquery(aroundNode).popover(popoverOptions).attr('data-toggle', 'popover');
};
