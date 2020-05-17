import renderingContext from '../renderingContext';

renderingContext.addPresenterTable = (newRow, firstBinding, context) => {
  const item = firstBinding.getItem();
  const childItems = item.getChildren();
  const $table = jquery('<table>').addClass('rdformsGroup').appendTo(newRow);
  jquery('<thead>').appendTo($table);
  const $tHeadRow = jquery('<tr>').appendTo($table);
  for (let colInd = 0; colInd < childItems.length; colInd++) {
    const $th = jquery('<th>').appendTo($tHeadRow);
    renderingContext.attachItemInfo(item, jquery('<span>').text(childItems[colInd].getLabel()).appendTo($th), context);
  }
  return $table[0];
};