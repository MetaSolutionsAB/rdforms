import jquery from 'jquery';
import renderingContext from '../renderingContext';
import utils from '../../utils';

renderingContext.addPresenterTable = (newRow, firstBinding, context) => {
  const item = firstBinding.getItem();
  const childItems = item.getChildren();
  const $table = jquery('<table>').addClass('rdformsGroup').appendTo(newRow);
  jquery('<thead>').appendTo($table);
  const $tHeadRow = jquery('<tr>').appendTo($table);
  for (let colInd = 0; colInd < childItems.length; colInd++) {
    const $th = jquery('<th>').appendTo($tHeadRow);
    const pageLocale = context.view.getLocale();
    // Resolve from the label MAP (not getLabel(), which returns an
    // already-resolved string that getLocalizedValue can't language-tag).
    const labelResolved = utils.getLocalizedValue(
      childItems[colInd].getLabelMap(),
      pageLocale
    );
    const $thLabel = jquery('<span>').text(labelResolved.value).appendTo($th);
    // Tag the header language when it fell back to something other than the
    // page locale (WCAG 3.1.2) — only when there is a label to tag.
    const labelLang = utils.foreignLang(labelResolved.lang, pageLocale);
    if (labelLang && labelResolved.value) {
      $thLabel.attr('lang', labelLang);
    }
    // Describe the column, not the parent group: pass the column child item so
    // each header's info is about that column (also fixes RDFORMS-208 — pass the
    // DOM node [0], not the jQuery object, which attachItemInfo requires).
    renderingContext.attachItemInfo(childItems[colInd], $thLabel[0], context);
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
