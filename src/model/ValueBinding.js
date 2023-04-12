import { namespaces } from '@entryscape/rdfjson';
import Binding from './Binding';
import utils from '../utils';


export default class ValueBinding extends Binding {
  /**
   * Corresponds to a binding for a Text item type, captures literals, literals with
   * language, datatyped literals, or non blank resources, that is, URI's.
   * Validity is determined by a valid predicate and object.
   * The statement is asserted when the parents are valid and this ValueBinding is valid.
   * @exports {rdforms/model/ValueBinding}
   * @class
   * @see rforms/template/Text
   */
  constructor(params) {
    super(params);

    this._validObject = true;
    this._validPredicate = true;
    this._excludeFromTreeValidityCheck = false;
    if (this._statement) {
      this._validPredicate = this._isValidPredicateValue(this._statement.getPredicate(), true);
      this._validObject = this._isValidObjectValue(this._statement.getValue());
    }
  }

  /**
   * @return {String} corresponding to the value, even if the nodetype is URI
   * or datatype says for example date.
   */
  getValue() {
    return this._statement.getValue();
  }

  /**
   * @param {String} value the value to set, the value will be trimmed and if the value is empty
   * (like the empty string or null) the statement will be unasserted.
   * @param {Boolean} silent if true the graph will not be marked as changed,
   * useful when initializing with default empty values.
   */
  setValue(value, silent) {
    const _value = typeof value === 'string' ? value.trim() : value;
    const oValidObject = this._validObject;
    if (this._isValidObjectValue(_value)) {
      this._statement.setValue(_value, silent);
      this._validObject = true;
      if (oValidObject !== true && this._validPredicate === true && !this._excludeFromTreeValidityCheck) {
        this._parent.oneChildValidityChanged(true);
      }
    } else {
      // If it is a null value, change the statement.
      if (_value === '' || _value === null) {
        this._statement.setValue('', silent);
      }
      // And unassert the statement.
      this._validObject = false;
      if (oValidObject !== false && this._validPredicate === true) {
        this._parent.oneChildValidityChanged(false);
      }
    }
    this.updateAssertions();
  }

  setSubject(uri) {
    this._statement.setSubject(uri);
  }

  /**
   * @return {String} corresponding to a uri.
   */
  getPredicate() {
    return this._statement.getPredicate();
  }

  /**
   * @param {String} predicate corresponding to a uri.
   */
  setPredicate(predicate) {
    const oValidPredicate = this._validPredicate;
    if (this._isValidPredicateValue(predicate)) {
      this._statement.setPredicate(predicate);
      this._validPredicate = true;
      if (oValidPredicate !== true && this._validObject === true) {
        this._parent.oneChildValidityChanged(true);
      }
    } else {
      // Note that we actually do not set the invalid value, just unassert the statement.
      this._validPredicate = false;
      if (oValidPredicate !== false && this._validObject === true) {
        this._parent.oneChildValidityChanged(false);
      }
    }
    this.updateAssertions();
  }

  /**
   * @return {String} a two or three character language code.
   */
  getLanguage() {
    return this._statement.getLanguage();
  }

  /**
   * @param {Object} lang a two or three character language code.
   */
  setLanguage(lang, silent) {
    this._statement.setLanguage(lang, silent);
    if (!silent) {
      this.bindingChange(this);
    }
  }

  /**
   * @return {String} corresponding to a uri.
   */
  getDatatype() {
    return this._statement.getDatatype();
  }

  /**
   * @param {String} dt corresponding to a uri.
   */
  setDatatype(dt) {
    this._statement.setDatatype(namespaces.expand(dt));
    this.updateAssertions();
  }

  setExcludeFromTreeValidityCheck(value) {
    this._excludeFromTreeValidityCheck = value;
  }

  remove() {
    this.setValue(null);
    this._parent.removeChildBinding(this);
    super.remove(arguments);
  }

  updateAssertions() {
    const assert = this._ancestorValid && this._validObject && this._validPredicate;
    this._statement.setAsserted(assert, true);
    this.bindingChange(this);
  }

  isValid() {
    return this._validObject && this._validPredicate && !this._excludeFromTreeValidityCheck;
  }
}
