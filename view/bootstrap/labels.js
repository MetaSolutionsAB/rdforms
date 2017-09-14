define([
  'rdforms/view/renderingContext',
  'jquery',
], (renderingContext, jquery) => {
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
    const $label = jquery('<span class="rdformsLabel">').text(label).appendTo($labelDiv);
    const card = item.getCardinality();
    if (card.min > 0 && item.getProperty() != null) {
      jquery('<span class="rdformsMandatoryMark">').text('*').appendTo($labelDiv);
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

  jquery('body').on('click', (e) => {
    jquery('[data-toggle="popover"]').each(() => {
            // the 'is' for buttons that trigger popups
            // the 'has' for icons within a button that triggers a popup
      if (!jquery(this).is(e.target)
                && jquery(this).has(e.target).length === 0
                && jquery('.popover').has(e.target).length === 0) {
        jquery(this).popover('hide');
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
      container: 'body',
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
});
