import jquery from 'jquery';
import renderingContext from '../renderingContext';
import Editor from '../Editor';
import utils from '../../utils';

renderingContext.renderPresenterLabel = (rowNode, binding, item, context, labelRow) => {
  let labelMap = context.view instanceof Editor ? item.getEditLabelMap() || item.getLabelMap() : item.getLabelMap();
  let label = utils.getLocalizedValue(labelMap, context.view.getLocale()).value
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }

  const headingElement = `h${context.view.headingLevel}`;
  const $labelDiv = item.hasStyle('heading') ?
    jquery(`<${headingElement} class="rdformsLabel" tabindex="0">`).text(label).appendTo(rowNode) :
    jquery('<div class="rdformsLabel" tabindex="0">').text(label).appendTo(rowNode);
  if (binding) {
    $labelDiv.attr('id', context.view.createLabelIndex(binding));
  }
  if (labelRow) {
    $labelDiv.addClass('rdformsLabelRow');
  }
  if (context) {
    context.labelNode = $labelDiv[0];
  }
  const view = context.view;
  if (item.hasStyle('showDescriptionInPresent') || view.showDescription) {
    // An item is compact if it is exclicitly set as compact or
    // the view is set as compact and the item is not explicitly set as not compact AND
    // we are at the top
    const compactField = item.hasStyle('compact') ||
      (view.compact && !item.hasStyle('nonCompact') && (
        (view.topLevel && item.getType() !== 'group') ||
        (view.parentView && view.parentView.topLevel && view.binding.getItem().hasStyle('heading'))));
    const desc = utils.getLocalizedValue(item.getDescriptionMap(), context.view.getLocale()).value

    if (!compactField && desc) {
      jquery('<div class="rdformsDescription">').text(desc).appendTo(rowNode);
    }
  }

  renderingContext.attachItemInfo(item, $labelDiv[0], context);
};

renderingContext.attachItemInfo = function (item, aroundNode, context) {
  if (item == null || item.getDescriptionMap() == null) {
    return;
  }
  const desc = utils.getLocalizedValue(item.getDescriptionMap(), context.view.getLocale()).value
  aroundNode.setAttribute('title', desc);
};
