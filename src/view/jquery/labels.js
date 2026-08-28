import jquery from 'jquery';
import renderingContext from '../renderingContext';
import Editor from '../Editor';
import utils from '../../utils';

renderingContext.renderPresenterLabel = (
  rowNode,
  binding,
  item,
  context,
  labelRow
) => {
  let labelMap =
    context.view instanceof Editor
      ? item.getEditLabelMap() || item.getLabelMap()
      : item.getLabelMap();
  const pageLocale = context.view.getLocale();
  const labelResolved = utils.getLocalizedValue(labelMap, pageLocale);
  let label = labelResolved.value;
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }

  const headingElement = `h${context.view.headingLevel}`;
  // No tabindex here: this renderPresenterLabel is shared by the jQuery and
  // bootstrap flavors, so focusability/role are added — content-gated — by each
  // flavor's own attachItemInfo (bootstrap: a focus-triggered popover; jQuery: a
  // title announced on focus). A blanket tabindex here would make every label a
  // tab stop even when it has nothing to reveal.
  const $labelDiv = item.hasStyle('heading')
    ? jquery(`<${headingElement} class="rdformsLabel">`)
        .text(label)
        .appendTo(rowNode)
    : jquery('<div class="rdformsLabel">').text(label).appendTo(rowNode);
  if (binding) {
    $labelDiv.attr('id', context.view.createLabelIndex(binding));
  }
  if (labelRow) {
    $labelDiv.addClass('rdformsLabelRow');
  }
  if (context) {
    context.labelNode = $labelDiv[0];
  }
  // Tag the label with its resolved language when it fell back to something
  // other than the page locale (WCAG 3.1.2); no attribute when it matches or
  // when the label is empty.
  const labelLang = utils.foreignLang(labelResolved.lang, pageLocale);
  if (labelLang && label) {
    $labelDiv.attr('lang', labelLang);
  }
  const view = context.view;
  if (item.hasStyle('showDescriptionInPresent') || view.showDescription) {
    // An item is compact if it is exclicitly set as compact or
    // the view is set as compact and the item is not explicitly set as not compact AND
    // we are at the top
    const compactField =
      item.hasStyle('compact') ||
      (view.compact &&
        !item.hasStyle('nonCompact') &&
        ((view.topLevel && item.getType() !== 'group') ||
          (view.parentView &&
            view.parentView.topLevel &&
            view.binding.getItem().hasStyle('heading'))));
    const descResolved = utils.getLocalizedValue(
      item.getDescriptionMap(),
      pageLocale
    );
    const desc = descResolved.value;

    if (!compactField && desc) {
      const $desc = jquery('<div class="rdformsDescription">').text(desc);
      const descLang = utils.foreignLang(descResolved.lang, pageLocale);
      if (descLang) {
        $desc.attr('lang', descLang);
      }
      $desc.appendTo(rowNode);
    }
  }

  renderingContext.attachItemInfo(item, $labelDiv[0], context);
};

renderingContext.attachItemInfo = function (item, aroundNode, context) {
  if (item == null || item.getDescriptionMap() == null) {
    return;
  }
  const desc = utils.getLocalizedValue(
    item.getDescriptionMap(),
    context.view.getLocale()
  ).value;
  if (!desc) {
    return;
  }
  aroundNode.setAttribute('title', desc);
  // Make the label focusable so screen readers announce the description (via the
  // title) on Tab focus — in this flavor that is the only path to it (the title
  // is otherwise mouse-hover only). Only when there is a description to reveal.
  aroundNode.setAttribute('tabindex', '0');
};
