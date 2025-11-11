/* eslint-disable class-methods-use-this */
import renderingContext from './renderingContext';
import View from './View';

const showNow = (editor, item, bindings) => {
  if (
    bindings.length === 0 ||
    //    item.hasStyle('deprecated') ||
    item.hasStyle('invisible')
  ) {
    return false;
  }
  const prop = item.getProperty();
  if (prop) {
    return !editor.filterItem(item);
  }

  // Take care of layout grouping by checking recursively.
  if (item.getType() === 'group') {
    const groupedItemsArr = item.getChildren();
    if (groupedItemsArr.length === 0) {
      return true; // Corresponds to an extention or pure heading, since no children.
    }
    if (
      bindings[0]
        .getItemGroupedChildBindings()
        .find((childBindings, idx) =>
          showNow(editor, groupedItemsArr[idx], childBindings)
        )
    ) {
      return true;
    }
    return false;
  }
  return true;
};

export default class Presenter extends View {
  _handleParams(params) {
    this.showLanguage = params.showLanguage !== false;
    this.filterTranslations = params.filterTranslations !== false;
    this.defaultLanguage = params.defaultLanguage;
    this.styleCls = params.styleCls || 'rdformsPresenter';
    super._handleParams(params);
  }

  /**
   * Show only if any bindings exists for the given item.
   * @param {Object} item
   * @param {Object} bindings
   */
  showNow(item, bindings) {
    return showNow(this, item, bindings);
    /*    if (item.hasStyle('deprecated') && bindings.length === 0) {
      return false;
    }
    return bindings.length > 0 && !item.hasStyle('invisible');*/
  }

  skipBinding(binding) {
    const item = binding.getItem();
    const isGroup = item.getType() === 'group';
    if (!item.getProperty() && isGroup && item.getChildren().length === 0) {
      return false; // Corresponds to an extention or pure heading, since no children.
    }
    return isGroup && binding.getChildBindings().length === 0;
  }

  /**
   * Has no effect on items that with node type different than LANGUAGE_LITERAL
   * or if filterTranslations is set to false. Otherwise a single binding is
   * returned with the best language match according to the locale.
   *
   * @param {Object} item
   * @param {Object} bindings
   * @param {Array} with a single value if the filtering has taken place,
   * otherwise same as input bindings.
   */
  prepareBindings(item, bindings) {
    if (
      !item.hasStyle('filterTranslations') &&
      (!this.filterTranslations ||
        item.getNodetype() !== 'LANGUAGE_LITERAL' ||
        item.hasStyle('viewAllTranslations'))
    ) {
      return bindings;
    }

    return renderingContext.filterTranslations(
      bindings,
      this.getLocale(),
      this.defaultLanguage
    );
  }

  addLabel(rowDiv, binding, item) {
    if (item.hasStyle('noLabelInPresent')) {
      renderingContext.domClassToggle(rowDiv, 'rdformsInvisibleGroup', true);
    } else {
      renderingContext.renderPresenterLabel(
        rowDiv,
        binding,
        item,
        this.context
      );
    }
  }

  addTable(newRow, firstBinding) {
    return renderingContext.addPresenterTable(newRow, firstBinding, {
      view: this,
    });
  }

  fillTable(table, bindings) {
    return renderingContext.fillPresenterTable(table, bindings, { view: this });
  }

  preRenderView() {
    renderingContext.prePresenterViewRenderer(this.domNode, this.binding, {
      view: this,
      topLevel: this.topLevel,
    });
  }

  addComponent(fieldDiv, binding) {
    renderingContext.renderPresenter(fieldDiv, binding, this.context);
  }

  /**
   * Truncate for presentations when:
   * - not a group (repeated labels does not look nice being truncated)
   * - if truncate setting is enabled on the presenter or the individual item ('truncate' and not 'noTruncate' is set)
   * - if the truncate limit is exceeded
   *
   * @param item
   * @param bindings
   * @return {number}
   */
  truncateAt(item, bindings) {
    return item.getType() !== 'group' &&
      bindings &&
      bindings.length > this.truncateLimit &&
      (this.truncate || item.hasStyle('truncate')) &&
      !item.hasStyle('noTruncate')
      ? this.truncateLimit
      : -1;
  }
}
