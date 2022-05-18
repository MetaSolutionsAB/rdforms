import jquery from 'jquery';
import renderingContext from '../renderingContext';
import Editor from '../Editor';

renderingContext.renderPresenterLabel = (rowNode, binding, item, context, labelRow) => {
  let label = context.view instanceof Editor ? item.getEditLabel() || item.getLabel() : item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }

  const $labelDiv = item.hasStyle('heading') ?
    jquery('<h2 class="rdformsLabel" tabindex="0">').text(label).appendTo(rowNode) :
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
    const desc = item.getDescription();
    if (!compactField && desc) {
      jquery('<div class="rdformsDescription" tabindex="0">').text(desc).appendTo(rowNode);
    }
  }

  renderingContext.attachItemInfo(item, $labelDiv[0], context);
};

renderingContext.attachItemInfo = function (item, aroundNode/* , context */) {
  if (item == null || item.getDescription() == null) {
    return;
  }
  const desc = item.getDescription();
  aroundNode.setAttribute('title', desc);
};
