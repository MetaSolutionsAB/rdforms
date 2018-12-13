import renderingContext from './renderingContext';
import Presenter from './Presenter';
import engine from '../model/engine';
import {bindingReport} from '../model/validate';
import {i18n} from 'esi18n';
import declare from 'dojo/_base/declare';

export default declare(Presenter, {
  //= ==================================================
  // Public attributes
  //= ==================================================
  showLanguage: true,
  filterTranslations: false,
  styleCls: 'rdformsPresenter',

  //= ==================================================
  // Public API
  //= ==================================================
  showNow(item, bindings) {
    if (item.hasStyle('invisible')) {
      return false;
    }
    if (bindings.length > 0) {
      return true;
    }
    if (item.hasStyle('deprecated')) {
      return false;
    }
    const card = item.getCardinality();
    switch (this.includeLevel) {
      case 'mandatory':
        return card && card.min >= 1;
      case 'recommended':
        return card && (card.min >= 1 || card.pref >= 1);
      default:
        return true;
    }
  },

  showAsTable() {
    return false;
  },

  /**
   * Has no effect on items that with node type different than LANGUAGE_LITERAL or if
   * filterTranslations is set to false. Otherwise a single binding is returned with the best
   * language match according to the locale.
   *
   * @param {Object} item
   * @param {Object} bindings
   * @param {Array} with a single value if the filtering has taken place, otherwise same as
   * input bindings.
   */
  prepareBindings(item, bindings) {
    let _bindings = bindings;
    const card = item.getCardinality();
    let target;
    const min = card.min != null ? card.min : 0;
    const pref = card.pref != null ? card.pref : 0;
    if (card.pref > 0) {
      target = card.pref;
    } else if (card.min > 0) {
      target = card.min;
    } else if (item.getType() === 'propertygroup') {
      target = 0;
    } else if (item.getType() === 'group') {
      if (item.getProperty() == null) {
        target = 1;
      } else {
        target = 0;
      }
    } else {
      target = 0;
    }
    const noDisjointHinder = !this.binding.getItem().hasStyle('disjoint') ||
      this.binding.error === engine.CODES.TOO_FEW_VALUES ||
      this.binding.warning === engine.CODES.TOO_FEW_VALUES;
    if (target > _bindings.length && noDisjointHinder) {
      _bindings = _bindings.concat([]);
      while (target > _bindings.length) {
        const binding = engine.create(this.binding, item);
        if (_bindings.length < min) {
          binding.error = engine.CODES.TOO_FEW_VALUES;
        } else if (_bindings.length < pref) {
          binding.warning = engine.CODES.TOO_FEW_VALUES;
        }
        _bindings.push(binding);
      }
    }
    return _bindings;
  },

  skipBinding(/* binding */) {
    return false;
  },

  _handleParams(/* params */) {
    this.inherited('_handleParams', arguments);
    if (this.binding) {
      bindingReport(this.binding);
    }
  },

  addValidationMarker(fieldDiv, binding) {
    const item = binding.getItem();
    const card = item.getCardinality();
    const min = card.min != null ? card.min : 0;
    const pref = card.pref != null ? card.pref : 0;
    if (binding.error) {
      renderingContext.domClassToggle(fieldDiv, 'error', true);
      let tmpl;
      if (binding.error === engine.CODES.TOO_FEW_VALUES) {
        tmpl = i18n.renderNLSTemplate(this.messages.validation_min_required, min);
      } else if (binding.error === engine.CODES.TOO_MANY_VALUES) {
        tmpl = i18n.renderNLSTemplate(this.messages.validation_max, card.max || 1);
      } else if (binding.error === engine.CODES.TOO_MANY_VALUES_DISJOINT) {
        tmpl = this.messages.validation_disjoint;
      }
      const n = renderingContext.domCreate('div', fieldDiv);
      renderingContext.domText(n, `>> ${tmpl} <<`);
      return true;
    } else if (binding.warning) {
      renderingContext.domClassToggle(fieldDiv, 'warning', true);
      const tmpl = i18n.renderNLSTemplate(this.messages.validation_min_recommended, pref);
      const n = renderingContext.domCreate('div', fieldDiv);
      renderingContext.domText(n, `>> ${tmpl} <<`);
      return true;
    } else if (item.hasStyle('deprecated')) {
      renderingContext.domClassToggle(fieldDiv, 'deprecated', true);
      const n = renderingContext.domCreate('div', fieldDiv);
      renderingContext.domText(n, `>> ${this.messages.validation_deprecated} <<`);
      return true;
    }
    return false;
  },
  addComponent(fieldDiv, binding) {
    this.inherited('addComponent', arguments);
    this.addValidationMarker(fieldDiv, binding);
  },
});
