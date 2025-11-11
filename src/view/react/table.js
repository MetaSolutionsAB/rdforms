import renderingContext from '../renderingContext';
import utils from '../../utils';
import jquery from 'jquery';

renderingContext.addPresenterTable = (newRow, firstBinding, context) => {
  const item = firstBinding.getItem();
  const childItems = item.getChildren();
  const $table = jquery('<table>').addClass('rdformsGroup').appendTo(newRow);
  jquery('<thead>').appendTo($table);
  const $tHeadRow = jquery('<tr>').appendTo($table);
  for (let colInd = 0; colInd < childItems.length; colInd++) {
    const $th = jquery('<th>').appendTo($tHeadRow);
    let label = utils.getLocalizedValue(
      childItems[colInd].getLabelMap(),
      context.view.getLocale()
    ).value;
    renderingContext.attachItemInfo(
      item,
      jquery('<span>').text(label).appendTo($th),
      context
    );
  }
  return $table[0];
};

renderingContext.fillPresenterTable = (table, bindings, context) => {
  if (bindings.length === 0) {
    return;
  }
  let rowInd;
  let colInd;
  let childBindingsGroups;
  let $trEl;

  const tl = context.view.topLevel;
  context.view.topLevel = false; // Table-cells are never toplevel, hence intermediate override.
  for (rowInd = 0; rowInd < bindings.length; rowInd++) {
    childBindingsGroups = bindings[rowInd].getItemGroupedChildBindings();
    $trEl = jquery('<tr>').appendTo(table);

    for (colInd = 0; colInd < childBindingsGroups.length; colInd++) {
      if (childBindingsGroups[colInd].length > 0) {
        renderingContext.renderPresenter(
          jquery('<td>').appendTo($trEl),
          childBindingsGroups[colInd][0],
          {
            view: context.view,
            noCardinalityButtons: true,
          }
        );
      } else {
        jquery('<td>').appendTo($trEl);
      }
    }
  }
  context.view.topLevel = tl;
};
