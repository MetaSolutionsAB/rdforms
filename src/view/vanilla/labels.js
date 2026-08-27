import renderingContext from '../renderingContext';
import utils from '../../utils';

// Whether an item's inline description should be suppressed because the field
// is compact. Mirrors the other flavors so behavior is consistent across them.
const isCompactField = (item, view) =>
  item.hasStyle('compact') ||
  (view.compact &&
    !item.hasStyle('nonCompact') &&
    ((view.topLevel && item.getType() !== 'group') ||
      (view.parentView &&
        view.parentView.topLevel &&
        view.binding.getItem().hasStyle('heading'))));

// Renders a property label into the <dt> (or heading) node the VanillaPresenter
// created. When showDescription is on, the item description is also rendered as
// a visible element (more accessible than the title tooltip, which is not
// keyboard/touch reachable) — matching the other flavors, compact suppression
// included.
renderingContext.renderPresenterLabel = (labelNode, binding, item, context) => {
  const view = context.view;
  const labelMap = item.getLabelMap();
  const localized = utils.getLocalizedValue(labelMap, view.getLocale()).value;
  const label = localized
    ? localized.charAt(0).toUpperCase() + localized.slice(1)
    : '';
  renderingContext.domText(labelNode, label);

  if (
    (item.hasStyle('showDescriptionInPresent') || view.showDescription) &&
    item.getDescriptionMap() != null &&
    !isCompactField(item, view)
  ) {
    const description = utils.getLocalizedValue(
      item.getDescriptionMap(),
      view.getLocale()
    ).value;
    if (description) {
      // A heading renders into an <h*> inside a <section>; place the description
      // after the heading (in the section), not inside it. Other items render
      // into a <dt>, where the description belongs with the term.
      const parent = item.hasStyle('heading')
        ? labelNode.parentNode
        : labelNode;
      const descriptionNode = renderingContext.domCreate('div', parent);
      renderingContext.domClassToggle(
        descriptionNode,
        'rdforms-description',
        true
      );
      renderingContext.domText(descriptionNode, description);
    }
  }

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
