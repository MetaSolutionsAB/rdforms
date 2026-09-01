import renderingContext from '../renderingContext';
import utils from '../../utils';

const columnLabel = (childItem, locale) => {
  const label = utils.getLocalizedValue(childItem.getLabelMap(), locale).value;
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : '';
};

// Builds a semantic <table> for a table-styled group and returns its <tbody>
// (the handle fillPresenterTable appends rows to). Columns come from the
// group's child items; the group label becomes the <caption>.
renderingContext.addPresenterTable = (parent, firstBinding, context) => {
  const item = firstBinding.getItem();
  const locale = context.view.getLocale();
  const childItems = item.getChildren();

  const table = renderingContext.domCreate('table', parent);
  renderingContext.domClassToggle(table, 'rdforms-table', true);

  const caption = columnLabel(item, locale);
  if (caption) {
    renderingContext.domText(
      renderingContext.domCreate('caption', table),
      caption
    );
  }

  const headRow = renderingContext.domCreate(
    'tr',
    renderingContext.domCreate('thead', table)
  );
  childItems.forEach((childItem) => {
    const header = renderingContext.domCreate('th', headRow);
    renderingContext.domSetAttr(header, 'scope', 'col');
    renderingContext.domText(header, columnLabel(childItem, locale));
  });

  return renderingContext.domCreate('tbody', table);
};

// Fills the <tbody> with one <tr> per binding, one <td> per child column.
renderingContext.fillPresenterTable = (tbody, bindings, context) => {
  if (bindings.length === 0) {
    return;
  }
  const { view } = context;
  const wasTopLevel = view.topLevel;
  view.topLevel = false; // Table cells are never top level.
  bindings.forEach((binding) => {
    const row = renderingContext.domCreate('tr', tbody);
    binding.getItemGroupedChildBindings().forEach((childBindings) => {
      const cell = renderingContext.domCreate('td', row);
      if (childBindings.length > 0) {
        renderingContext.renderPresenter(cell, childBindings[0], {
          view,
          noCardinalityButtons: true,
        });
      }
    });
  });
  view.topLevel = wasTopLevel;
};
