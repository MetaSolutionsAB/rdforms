import renderingContext from './renderingContext';
import View from './View';
import {i18n} from 'esi18n';
import declare from 'dojo/_base/declare';

export default declare(View, {
  // ===================================================
  // Public attributes
  // ===================================================
  showLanguage: true,
  filterTranslations: true,
  styleCls: 'rdformsPresenter',

  // ===================================================
  // Public API
  // ===================================================
  /**
   * Show only if any bindings exists for the given item.
   * @param {Object} item
   * @param {Object} bindings
   */
  showNow(item, bindings) {
    if (item.hasStyle('deprecated') && bindings.length === 0) {
      return false;
    }
    return bindings.length > 0 && !item.hasStyle('invisible');
  },

  skipBinding(binding) {
    const item = binding.getItem();
    if (!item.getProperty() && item.getChildren().length === 0) {
      return false; // Corresponds to an extention or pure heading, since no children.
    }
    return item.getType() === 'group' && binding.getChildBindings().length === 0;
  },

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
    const alts = {};
    let index;
    if (!this.filterTranslations || item.getNodetype() !== 'LANGUAGE_LITERAL' || item.hasStyle('viewAllTranslations')) {
      return bindings;
    }
    for (index = 0; index < bindings.length; index++) {
      const lang = bindings[index].getLanguage();
      if (lang === '' || lang == null) {
        alts.noLanguage = bindings[index];
      } else if (lang === i18n.getLocale()) {
        alts.best = bindings[index];
      } else if (lang.indexOf(i18n.getLocale()) !== -1 || i18n.getLocale().indexOf(lang) !== -1) {
        alts.close = bindings[index];
      } else if (lang.indexOf(this.defaultLanguage) === 0) {
        alts.defaultLanguage = bindings[index];
      }
    }
    const singleBinding = alts.best || alts.close || alts.defaultLanguage || alts.noLanguage;
    return singleBinding !== undefined ? [singleBinding] : bindings;
  },

  addLabel(rowDiv, binding, item) {
    if (item.hasStyle('noLabelInPresent')) {
      renderingContext.domClassToggle(rowDiv, 'rdformsInvisibleGroup', true);
    } else {
      renderingContext.renderPresenterLabel(rowDiv, binding, item, this.context);
    }
  },
  addTable(newRow, firstBinding) {
    return renderingContext.addPresenterTable(newRow, firstBinding, {view: this});
  },
  fillTable(table, bindings) {
    return renderingContext.fillPresenterTable(table, bindings, {view: this});
  },
  preRenderView() {
    renderingContext.prePresenterViewRenderer(this.domNode, this.binding, {view: this, topLevel: this.topLevel});
  },
  addComponent(fieldDiv, binding) {
    renderingContext.renderPresenter(fieldDiv, binding, this.context);
  },
});


