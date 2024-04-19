import renderingContext from '../renderingContext';
import * as engine from '../../model/engine';
import utils from '../../utils';
import jquery from 'jquery';
import Editor from '../Editor';


const createChildBindingsForFirstFixedColumn = (bindings/* , context*/) => {
  // Find choice column
  // flesh out bindings from choices
  // mark each fleshed out binding via .setExcludeFromTreeValidityCheck(true);
  const nb = [];
  const item = bindings[0].getItem();
  const firstColumnItem = item.getChildren()[0]; // Must be a choice.
  let choices = firstColumnItem.getChoices();
  // Sort the choices goddamit!
  choices = utils.cloneArrayWithLabels(choices);
  choices.sort((a, b) => {
    // This assumes that there is always an "n" to be found (which is correct)
    if (a.label > b.label) {
      return 1;
    } else if (a.label < b.label) {
      return -1;
    }
    return 0;
  });


  // index the existing bindings
  const ebi = {};
  (bindings || []).forEach((binding) => {
    const igcb = binding.getItemGroupedChildBindings();
    if (igcb.length > 0 && igcb[0].length > 0) {
      const rowXcol1 = igcb[0][0];
      ebi[rowXcol1.getValue()] = binding;
    }
  });

  // Create one row for each choice
  const parentBinding = bindings[0].getParent();
  (choices || []).forEach((choice) => {
    if (ebi[choice.value] != null) {
      nb.push(ebi[choice.value]);
    } else {
      const newRowBinding = engine.create(parentBinding, item);
      const firstColumnBinding = engine.create(newRowBinding, firstColumnItem);
      firstColumnBinding.setExcludeFromTreeValidityCheck(true);
      firstColumnBinding.setAncestorValid(false);
      firstColumnBinding.setChoice(choice);
      nb.push(newRowBinding);
    }
  });

  return nb;
};

const addTableRow = (table, binding, context) => {
  const childItems = binding.getItem().getChildren();
  const groupedBindings = binding.getItemGroupedChildBindings();
  const $trEl = jquery('<tr>').appendTo(table);

  groupedBindings.forEach((bindings, index) => {
    // Create those columns that are missing:
    if (bindings.length === 0 && !childItems[index].hasStyle('nonEditable')) {
      engine.create(binding, childItems[index]);
    }
  });
  groupedBindings.forEach((bindings) => {
    if (bindings.length > 0) {
      renderingContext.renderEditor(jquery('<td>').appendTo($trEl)[0], bindings[0],
        { view: context.view, noCardinalityButtons: true });
    }
  });

  if (!binding.getItem().hasStyle('firstcolumnfixedtable')) {
    const $lastTd = jquery('<td>').addClass('rdformsTableControl').appendTo($trEl);
    const $remove = jquery('<span>').addClass('action editDelete')
      .attr('title', context.view.messages.edit_remove).appendTo($lastTd);
    const cardTr = binding.getCardinalityTracker();
    const cardConnect1 = cardTr.addListener(() => {
      $remove.toggleClass('disabled', cardTr.isMin());
    });
    $remove.click(() => {
      if (!cardTr.isMin()) {
        if (cardTr.getCardinality() === 1) {
          const parentBinding = binding.getParent();
          const item = binding.getItem();
          const nBinding = engine.create(parentBinding, item);
          addTableRow(table, nBinding, context);
        }
        cardTr.removeListener(cardConnect1);
        removeConnect.remove();
        binding.remove();
        $trEl.remove();
      }
    });
  }
};

renderingContext.addEditorTable = (newRow, firstBinding, context) => {
  const item = firstBinding.getItem();
  const childItems = item.getChildren();
  const $table = jquery('<table>').appendTo(newRow);
  jquery($table).addClass('rdformsGroup');

  const $tHead = jquery('<thead>').appendTo($table);
  const $tBody = jquery('<tbody>').appendTo($table);
  const $tHeadRow = jquery('<tr>').appendTo($tHead);
  for (let colInd = 0; colInd < childItems.length; colInd++) {
    const $th = jquery('<th>').appendTo($tHeadRow);
    jquery($th).addClass(`rdformsColumnHeader${colInd}`);
    const childItem = childItems[colInd];
    const labelMap = context.view instanceof Editor ?
      childItem.getEditLabelMap() || childItem.getLabelMap() : childItem.getLabelMap();
    const label = utils.getLocalizedValue(labelMap, context.view.getLocale()).value
    renderingContext.attachItemInfo(item,
      jquery('<span>').text(label).appendTo($th)[0], context);
  }
  if (!firstBinding.getItem().hasStyle('firstcolumnfixedtable')) {
    const $addTh = jquery('<th>').addClass('rdformsTableControl').appendTo($tHeadRow);
    const parentBinding = firstBinding.getParent();
    const cardTr = firstBinding.getCardinalityTracker();
    const $add = jquery('<span>').addClass('action editAdd')
      .attr('title', context.view.messages.edit_add)
      .appendTo($addTh)
      .click(() => {
        if (!cardTr.isMax()) {
          const nBinding = engine.create(parentBinding, item);
          addTableRow($tBody[0], nBinding, context);
        }
      });
    cardTr.addListener(() => {
      $add.toggleClass('disabled', cardTr.isMax());
    });
  }
  return $tBody;
};
renderingContext.fillEditorTable = (table, bindings, context) => {
  let _bindings = bindings;
  if (_bindings.length === 0) {
    return undefined;
  }
  const item = _bindings[0].getItem();
  if (item.hasStyle('nonEditable')) {
    return renderingContext.renderEditor(table, _bindings, context);
  }

  if (item.hasStyle('firstcolumnfixedtable')) {
    _bindings = createChildBindingsForFirstFixedColumn(_bindings, context);
  }

  _bindings.forEach((binding) => {
    addTableRow(table, binding, context);
  });
  return undefined;
};
