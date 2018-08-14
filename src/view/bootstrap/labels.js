import renderingContext from '../renderingContext';

renderingContext.renderPresenterLabel = (rowNode, binding, item, context, labelRow) => {
  let label = item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }

  const $labelDiv = jquery('<div class="rdformsLabel">').text(label).appendTo(rowNode);
  if (labelRow) {
    $labelDiv.addClass('rdformsLabelRow');
  }
  context.labelNode = $labelDiv[0];
  renderingContext.attachItemInfo(item, $labelDiv[0], context);
};

renderingContext.renderEditorLabel = (rowNode, binding, item, context) => {
  if (item.hasStyle('nonEditable') || item.hasStyle('heading')) {
    return renderingContext.renderPresenterLabel(rowNode, binding, item, context, true);
  }

  let label = item.getLabel();
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

jquery('body').on('show.bs.popover click', function (e) {
  jquery('[data-toggle="popover"]').each((node, a) => {
    if (e.target.innerHTML !== a.innerHTML) {
      jquery(a).popover('hide');
    }
  });
});

renderingContext.attachItemInfo = function (item, aroundNode/* , context */) {
  if (item == null || (item.getProperty() == null && item.getDescription() == null)) {
    jquery(aroundNode).addClass('noPointer');
    return;
  }

  const description = item.getDescription() || '';
  let propinfo = '';
  if (item.getProperty()) {
    propinfo = `<div class="property"><a target="_blank" href="${item.getProperty()}">${
      item.getProperty()}</a></div>`;
  }

  let label = item.getLabel();
  if (label != null && label !== '') {
    label = label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    label = '';
  }

  const popoverOptions = {
    html: true,
    container: renderingContext.getPopoverContainer(),
    placement: 'auto',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
    trigger: 'click',
    title: label,
    content: `<div class="description">${
      description.replace(/(\r\n|\r|\n)/g, '<br/>')
      }</div>${propinfo}`,
  };
  jquery(aroundNode).popover(popoverOptions).attr('data-toggle', 'popover');
};
