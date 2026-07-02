import renderingContext from '../renderingContext';
import utils from '../../utils';

// Renders a property label into the <dt> node the VanillaPresenter created.
renderingContext.renderPresenterLabel = (labelNode, binding, item, context) => {
  const labelMap = item.getLabelMap();
  const localized = utils.getLocalizedValue(
    labelMap,
    context.view.getLocale()
  ).value;
  const label = localized
    ? localized.charAt(0).toUpperCase() + localized.slice(1)
    : '';
  renderingContext.domText(labelNode, label);
  if (context) {
    context.labelNode = labelNode;
  }
  renderingContext.attachItemInfo(item, labelNode, context);
};

// Expose an item's description as a native title tooltip on the label.
renderingContext.attachItemInfo = (item, aroundNode, context) => {
  if (item == null || item.getDescriptionMap() == null) {
    return;
  }
  const description = utils.getLocalizedValue(
    item.getDescriptionMap(),
    context.view.getLocale()
  ).value;
  if (description) {
    renderingContext.domSetAttr(aroundNode, 'title', description);
  }
};
