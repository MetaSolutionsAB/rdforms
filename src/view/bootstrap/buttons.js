import renderingContext from '../renderingContext';
import * as engine from '../../model/engine';

define([
  'dojo/aspect',
], (aspect) => {
  renderingContext.addRemoveButton = (fieldDiv, binding, context) => {
    const $remove = jquery('<span class="fa fa-remove action">')
            .attr('title', context.view.messages.edit_remove)
            .appendTo(context.controlDiv);
    const cardTr = binding.getCardinalityTracker();
    const con = aspect.after(cardTr, 'cardinalityChanged', () => {
      $remove.toggleClass('disabled', cardTr.isMin() && cardTr.isDepsOk());
    });

    $remove.click(() => {
      if (!cardTr.isMin() || !cardTr.isDepsOk()) {
        if (cardTr.getCardinality() === 1) {
          if (binding.getItem().getType() === 'choice') {
            binding.setChoice(null);
          } else {
            binding.setValue('');
          }
          const nodeType = binding.getItem().getNodetype();
          if (nodeType === 'LANGUAGE_LITERAL' || nodeType === 'PLAIN_LITERAL') {
            binding.setLanguage('');
          }
          if (context.clear) {
            context.clear();
          } else {
            jquery(fieldDiv).find('input').val('');
          }
        } else {
          con.remove();
          $remove.unbind('click');
          binding.remove();
          jquery(fieldDiv).remove();
        }
      }
    });
  };

  renderingContext.addExpandButton = (rowDiv, labelDiv, item, context) => {
    const $expand = jquery('<span class="fa fa-plus action">')
      .attr('title', context.view.messages.edit_expand)
      .appendTo(labelDiv)
      .click(() => {
        const nBinding = engine.create(context.view.binding, item);
        if (context.view.showAsTable(item)) {
          const table = context.view.addTable(rowDiv, nBinding, item);
          context.view.fillTable(table, [nBinding]);
        } else {
          context.view.addRow(rowDiv, nBinding, false); // Label is already added.
          renderingContext.addGroupButtons(rowDiv, labelDiv, nBinding, context);
        }
        $expand.unbind('click').remove();
      });
  };

  renderingContext.addGroupButtons = (rowDiv, labelDiv, binding, context) => {
    const parentBinding = binding.getParent();
    const item = binding.getItem();
    const cardTr = binding.getCardinalityTracker();
    const card = item.getCardinality();
    let $add;
    if (card.max !== 1) {
      $add = jquery('<span class="action fa fa-plus ">')
                .attr('title', context.view.messages.edit_add)
                .appendTo(labelDiv);
      $add.click(() => {
        if (!cardTr.isMax()) {
          const nBinding = engine.create(parentBinding, item);
          context.view.addRow(rowDiv, nBinding); // not the first binding...
        }
      });
    }
    const $remove = jquery('<span class="action fa fa-remove">')
            .attr('title', context.view.messages.edit_remove)
            .appendTo(labelDiv);

    if (card.max === 1) {
      $remove.addClass('indentRemove');
    }

    const con = aspect.after(cardTr, 'cardinalityChanged', () => {
      if ($add) {
        $add.toggleClass('disabled', cardTr.isMax());
      }
      $remove.toggleClass('disabled', cardTr.isMin() && cardTr.isDepsOk());
    });


    $remove.click(() => {
      if (!cardTr.isMin() || !cardTr.isDepsOk()) {
        if (context.clear) {
          context.clear();
        }
        if (cardTr.getCardinality() === 1) {
          con.remove();
          if ($add) {
            $add.unbind('click');
          }
          $remove.unbind('click');
          binding.remove();
          if (context.view.showNow(item, [])) {
                        // If we are removing a single row, prepareBindings will only create a
                        // maximum of one row.
            const nBindings = context.view.prepareBindings(item, []);
                        // The bindings may be of length 0, e.g. if the view is currently showing
                        // only mandatory fields and the row is optional.
            if (nBindings.length > 0) {
              context.view.addRow(rowDiv, nBindings[0]);
            }
          }
          jquery(rowDiv).remove();
        } else {
          con.remove();
          if ($add) {
            $add.unbind('click');
          }
          $remove.unbind('click');
          binding.remove();
          jquery(rowDiv).remove();
        }
      }
    });
  };

  renderingContext.addCreateChildButton = (rowDiv, labelDiv, binding, context) => {
    const parentBinding = binding.getParent();
    const item = binding.getItem();
    const cardTr = binding.getCardinalityTracker();
    const $add = jquery('<span class="action fa fa-plus">')
            .attr('title', context.view.messages.edit_add)
            .appendTo(labelDiv)
            .click(() => {
              if (!cardTr.isMax()) {
                const nBinding = engine.create(parentBinding, item);
                context.view.addRow(rowDiv, nBinding); // not the first binding...
              }
            });
    aspect.after(cardTr, 'cardinalityChanged', () => {
      $add.toggleClass('disabled', cardTr.isMax());
    });
  };
});
