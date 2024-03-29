import renderingContext from './renderingContext';
import Presenter from './Presenter';
import CODES from '../model/CODES';
import { create } from '../model/engine';
import { bindingReport } from '../model/validate';

const localize = (bundle, key, val) => {
  if (val === 1) {
    return bundle[`${key}_one`];
  }
  return bundle[`${key}_more`].replace('$1', val);
};

export default class ValidationPresenter extends Presenter {

  _handleParams(params) {
    params.showLanguage = params.showLanguage !== false;
    params.filterTranslations = false;
    params.styleCls = params.styleCls || 'rdformsPresenter rdformsValidator';
    this.fuzzy = params.fuzzy !== false;
    super._handleParams(params);
    if (this.binding) {
      bindingReport(this.binding);
    }
  }

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
    if (item.hasStyle('atLeastOneChild') || item.hasStyle('exactlyOneChild')) {
      return true;
    }
    if (item.hasStyle('atLeastOneChild') || item.hasStyle('exactlyOneChild')) {
      return true;
    }
    const code = this.binding.getMatchingCode();
    if (code === CODES.MISSING_CONSTRAINTS || code === CODES.WRONG_NODETYPE) {
      return false;
    }

    const card = item.getCardinality();
    switch (this.includeLevel) {
      case 'mandatory':
        return card && card.min >= 1;
      case 'recommended':
      default:
        return card && (card.min >= 1 || card.pref >= 1);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  showAsTable() {
    return false;
  }

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
    const code = this.binding.getMatchingCode();
    const groupChildRequirementHinder = !(this.binding.getItem().hasStyle('atleastOneChild')
      || this.binding.getItem().hasStyle('atMostOneChild')
      || this.binding.getItem().hasStyle('disjoint')
      || this.binding.getItem().hasStyle('exactlyOneChild')) ||
      code === CODES.TOO_FEW_VALUES_MIN ||
      code === CODES.TOO_FEW_VALUES_PREF;
    const groupError = code === CODES.MISSING_CONSTRAINTS || code === CODES.WRONG_NODETYPE;
    if (target > _bindings.length && groupChildRequirementHinder && !groupError) {
      _bindings = _bindings.concat([]);
      while (target > _bindings.length) {
        const binding = create(this.binding, item);
        if (_bindings.length < min) {
          binding.setMatchingCode(CODES.TOO_FEW_VALUES_MIN);
          // binding.error = CODES.TOO_FEW_VALUES;
        } else if (_bindings.length < pref) {
          binding.setMatchingCode(CODES.TOO_FEW_VALUES_PREF);
          // binding.warning = CODES.TOO_FEW_VALUES;
        }
        _bindings.push(binding);
      }
    }
    return _bindings;
  }

  // eslint-disable-next-line class-methods-use-this
  skipBinding() {
    return false;
  }

  addValidationMarker(fieldDiv, binding) {
    const item = binding.getItem();
    const card = item.getCardinality();
    const min = card.min != null ? card.min : 0;
    const pref = card.pref != null ? card.pref : 0;
    const cardCode = item.getType() === 'group' ? binding.getCardinalityTracker()?.getCode() : undefined;
    const code = cardCode && cardCode !== CODES.OK && cardCode !== CODES.UNKNOWN ? cardCode : binding.getMatchingCode();
    const error = code !== CODES.TOO_FEW_VALUES_PREF && code !== CODES.OK;
    const warning = code === CODES.TOO_FEW_VALUES_PREF;
    if (error) {
      renderingContext.domClassToggle(fieldDiv, 'error', true);
      let tmpl;
      if (code === CODES.TOO_FEW_VALUES_MIN) {
        tmpl = localize(this.messages, 'validation_min_required', min);
      } else if (code === CODES.TOO_MANY_VALUES) {
        tmpl = localize(this.messages, 'validation_max', card.max || 1);
      } else if (code === CODES.AT_MOST_ONE_CHILD) {
        tmpl = this.messages.validation_at_most_one_child;
      } else if (code === CODES.AT_LEAST_ONE_CHILD) {
        tmpl = this.messages.validation_at_least_one_child;
      } else if (code === CODES.EXACTLY_ONE_CHILD) {
        tmpl = this.messages.validation_exactly_one_child;
      } else if (code === CODES.WRONG_NODETYPE) {
        tmpl = this.messages.validation_nodetype;
      } else if (code === CODES.WRONG_VALUE) {
        tmpl = this.messages.validation_value;
      } else if (code === CODES.WRONG_DATATYPE) {
        tmpl = this.messages.validation_datatype;
      } else if (code === CODES.MISSING_CONSTRAINTS) {
        tmpl = this.messages.validation_constraints;
      } else if (code === CODES.WRONG_PATTERN) {
        tmpl = this.messages.validation_pattern;
      } else if (code === CODES.MISSING_LANGUAGE) {
        tmpl = this.messages.validation_language;
      }

      renderingContext.renderValidationMessage(fieldDiv, 'error', tmpl);
      return true;
    } else if (warning) {
      renderingContext.domClassToggle(fieldDiv, 'warning', true);
      const tmpl = localize(this.messages, 'validation_min_recommended', pref);
      renderingContext.renderValidationMessage(fieldDiv, 'warning', tmpl);
      return true;
    } else if (item.hasStyle('deprecated')) {
      renderingContext.domClassToggle(fieldDiv, 'deprecated', true);
      renderingContext.renderValidationMessage(fieldDiv, 'deprecated', this.messages.validation_deprecated);
      return true;
    }
    return false;
  }

  addComponent(fieldDiv, binding) {
    super.addComponent(fieldDiv, binding);
    this.addValidationMarker(fieldDiv, binding);
  }
}
