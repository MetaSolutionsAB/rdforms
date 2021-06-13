import moment, {locale} from 'moment';
import renderingContext from './renderingContext';
import View from './View';

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
    if (item.hasStyle('deprecated') && bindings.length === 0) {
      return false;
    }
    return bindings.length > 0 && !item.hasStyle('invisible');
  }

  skipBinding(binding) {
    const item = binding.getItem();
    if (!item.getProperty() && item.getChildren().length === 0) {
      return false; // Corresponds to an extention or pure heading, since no children.
    }
    return item.getType() === 'group' && binding.getChildBindings().length === 0;
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
    const alts = {};
    let index;
    if (!this.filterTranslations || item.getNodetype() !== 'LANGUAGE_LITERAL' || item.hasStyle('viewAllTranslations')) {
      return bindings;
    }
    // Detect the various available languages
    // noLanguage - a binding exists with no lanugage set
    // best - a binding exists with the current locale
    // close - a binding exists with a language close to the current locale,
    //        e.g. en_US when the locale is en or the opposite
    // defaultLanguage - a binding exists with a language corresponding to the defaultLanguage
    const loc = moment.locale();
    for (index = 0; index < bindings.length; index++) {
      const lang = bindings[index].getLanguage();
      if (lang === '' || lang == null) {
        alts.noLanguage = true;
      } else if (lang === loc) {
        alts.best = true;
      } else if (lang.indexOf(loc) !== -1 || loc.indexOf(lang) !== -1) {
        alts.close = true;
      } else if (lang.indexOf(this.defaultLanguage) === 0) {
        alts.defaultLanguage = true;
      }
    }
    // Filter to bindings that are best, close and defaultLanguage in that order
    if (alts.best) {
      return bindings.filter(b => b.getLanguage() === loc);
    } else if (alts.close) {
      return bindings.filter((b) => {
        const lang = b.getLanguage();
        return lang && (lang.indexOf(loc) !== -1 || loc.indexOf(lang) !== -1);
      });
    } else if (alts.defaultLanguage) {
      return bindings.filter((b) => {
        const lang = b.getLanguage();
        return lang && lang.indexOf(this.defaultLanguage) === 0;
      });
    }

    // If there are no best, close or defaultLanguage bindings, don't do any filtering
    return bindings;
  }

  addLabel(rowDiv, binding, item) {
    if (item.hasStyle('noLabelInPresent')) {
      renderingContext.domClassToggle(rowDiv, 'rdformsInvisibleGroup', true);
    } else {
      renderingContext.renderPresenterLabel(rowDiv, binding, item, this.context);
    }
  }

  addTable(newRow, firstBinding) {
    return renderingContext.addPresenterTable(newRow, firstBinding, { view: this });
  }

  fillTable(table, bindings) {
    return renderingContext.fillPresenterTable(table, bindings, { view: this });
  }

  preRenderView() {
    renderingContext.prePresenterViewRenderer(this.domNode, this.binding, { view: this, topLevel: this.topLevel });
  }

  addComponent(fieldDiv, binding) {
    renderingContext.renderPresenter(fieldDiv, binding, this.context);
  }
}
