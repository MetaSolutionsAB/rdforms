import jquery from 'jquery';
import renderingContext from '../renderingContext';
import Editor from '../Editor';
import utils from '../../utils';

renderingContext.renderEditorLabel = (rowNode, binding, item, context) => {
  if (item.hasStyle('nonEditable') || item.hasStyle('heading')) {
    return renderingContext.renderPresenterLabel(
      rowNode,
      binding,
      item,
      context,
      true
    );
  }

  const pageLocale = context.view.getLocale();
  const labelMap = item.getEditLabelMap() || item.getLabelMap();
  const labelResolved = utils.getLocalizedValue(labelMap, pageLocale);
  let label = labelResolved.value;
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
  // Focusability + role="button" are added by attachItemInfo only when the
  // label actually has an info popover to reveal (see below) — a label with
  // nothing to show must not be a keyboard tab stop.
  const $label = jquery('<span class="rdformsLabel">')
    .text(label)
    .appendTo($labelDiv);
  // Tag the label with its resolved language when it fell back to something
  // other than the page locale (WCAG 3.1.2); no attribute when it matches or
  // when the label is empty.
  const labelLang = utils.foreignLang(labelResolved.lang, pageLocale);
  if (labelLang && label) {
    $label.attr('lang', labelLang);
  }
  const card = item.getCardinality();
  const b = context.view.messages;
  // Only show mark if there is a property that allows the item to have an expression on its own
  if (item.getProperty()) {
    if (card.min > 0) {
      jquery('<span class="rdformsMark rdformsMandatoryMark">')
        .text(b.mandatoryMark)
        .appendTo($labelDiv);
    } else if (card.pref > 0) {
      jquery('<span class="rdformsMark rdformsRecommendedMark">')
        .text(b.recommendedMark)
        .appendTo($labelDiv);
    } else {
      jquery('<span class="rdformsMark rdformsOptionalMark">')
        .text(b.optionalMark)
        .appendTo($labelDiv);
    }
  }

  // Buttons of various sorts
  if (binding == null) {
    renderingContext.addExpandButton(rowNode, $labelDiv[0], item, context);
  } else if (
    !context.view.showAsTable(item) &&
    (card.max === null || card.max !== card.min)
  ) {
    // If not table or min and max are not the same, then add buttons.
    if (item.getType() === 'group') {
      if (item.getProperty()) {
        renderingContext.addGroupButtons(
          rowNode,
          $labelDiv[0],
          binding,
          context
        );
      }
    } else {
      renderingContext.addCreateChildButton(
        rowNode,
        $labelDiv[0],
        binding,
        context
      );
    }
  }

  const view = context.view;
  if (item.hasStyle('showDescriptionInEdit') || view.showDescription) {
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
    const descMap =
      context.view instanceof Editor
        ? item.getEditDescriptionMap() || item.getDescriptionMap()
        : item.getDescriptionMap();
    const descResolved = utils.getLocalizedValue(descMap, pageLocale);
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
  renderingContext.attachItemInfo(item, $label[0], context);

  return undefined;
};

renderingContext.attachItemInfo = function (item, aroundNode, context) {
  if (context.view.popupOnLabel === false) {
    renderingContext.domClassToggle(aroundNode, 'rdformsNoPopup', true);
    return;
  }
  if (
    item == null ||
    (item.getProperty() == null &&
      item.getDescriptionMap() == null &&
      item.getEditDescriptionMap() == null)
  ) {
    // Nothing to reveal — leave the label non-interactive (no role, no tab stop).
    jquery(aroundNode).addClass('noPointer');
    return;
  }
  // The label opens an info popover on focus, so it is a real keyboard control.
  renderingContext.domSetAttr(aroundNode, 'role', 'button');
  renderingContext.domSetAttr(aroundNode, 'tabindex', '0');

  const descriptionMap =
    (context.view instanceof Editor
      ? item.getEditDescriptionMap() || item.getDescriptionMap()
      : item.getDescriptionMap()) || {};
  const pageLocale = context.view.getLocale();
  const descriptionResolved = utils.getLocalizedValue(
    descriptionMap,
    pageLocale
  );
  const description = descriptionResolved.value || '';
  // When the description resolved to a language other than the page locale
  // (a fallback because no translation exists for the active locale), tag it
  // with that language so screen readers pronounce it correctly (WCAG 3.1.2).
  // No attribute when it matches the locale or is language-less.
  const descriptionLang = utils.foreignLang(
    descriptionResolved.lang,
    pageLocale
  );
  const descriptionLangAttr = descriptionLang
    ? ` lang="${descriptionLang}"`
    : '';

  let propinfo = '';
  if (item.getProperty()) {
    propinfo = `<div class="property"><a target="_blank" href="${item.getProperty()}">${item.getProperty()}</a></div>`;
  }

  const labelMap =
    context.view instanceof Editor
      ? item.getEditLabelMap() || item.getLabelMap()
      : item.getLabelMap();
  const labelResolved = utils.getLocalizedValue(labelMap, pageLocale);
  let label = labelResolved.value;

  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }
  const labelLang = utils.foreignLang(labelResolved.lang, pageLocale);
  const popoverOptions = {
    html: true,
    container: aroundNode, // renderingContext.getPopoverContainer(),
    placement: 'auto',
    trigger: 'focus',
    title:
      label !== '' && labelLang
        ? `<span lang="${labelLang}">${label}</span>`
        : label,
    content: `<div class="description"${descriptionLangAttr}>${description.replace(
      /(\r\n|\r|\n)/g,
      '<br/>'
    )}</div>${propinfo}`,
  };
  jquery(aroundNode).popover(popoverOptions).attr('data-toggle', 'popover');
  jquery(aroundNode).on('keydown', (e) => {
    if (e.key === 'Escape' && aroundNode.getAttribute('aria-describedby')) {
      jquery(aroundNode).popover('hide');
      e.stopPropagation();
    }
  });
};
