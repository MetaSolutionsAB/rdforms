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

  const $labelDiv = jquery('<div class="rdformsLabel" tabindex="0">').text(label).appendTo(rowNode);
  if (binding) {
    $labelDiv.attr('id', context.view.createLabelIndex(binding));
  }
  if (labelRow) {
    $labelDiv.addClass('rdformsLabelRow');
  }
  if (context) {
    context.labelNode = $labelDiv[0];
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
