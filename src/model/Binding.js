/* eslint-disable class-methods-use-this */
import utils from '../utils';

let counter = 0;

/**
 * A binding is a pairing between an item and various RDF statement
 * (a single statement unless the binding is a group with constraints).
 * It keeps track of cardinality and validity.
 * If a binding is valid and all parent bindings are valid,
 * the statement is asserted, that is, inserted into the RDF graph.
 */
export default class Binding {
  /**
   * @exports {Binding}
   * @class
   */
  constructor({ item, statement, graph, matchingCode }) {
    this._item = item;
    this._statement = statement;
    this._graph = graph;
    this._ancestorValid = true;
    this._cardinalityTracker = null;
    this._hash = `b_${counter}`;
    this._matchingCode = matchingCode || 'correct';
    counter += 1;
  }

  // ===================================================
  // Public API
  // ===================================================
  getGraph() {
    if (!this._graph) {
      if (this._statement) {
        this._graph = this._statement.getGraph();
      } else if (this._parent) {
        this._graph = this._parent.getGraph();
      }
    }
    return this._graph;
  }

  isReadOnly() {
    if (!('_readOnly' in this)) {
      const parent = this.getParent();
      if (parent && parent._readOnly) {
        this._readyOnly = true;
      } else {
        this._readOnly = !!(this._statement && this._statement.getNamedGraph());
      }
    }

    return this._readOnly;
  }

  remove() {}

  setSubject(uri) {}

  getValue() {}

  setValue(value, silent) {}

  getGist() {
    return utils.extractGist(
      this.getValue(),
      this.getItem().getValueTemplate()
    );
  }

  setGist(value, silent) {
    let _value = value;
    let vt = this.getItem().getValueTemplate();
    if (vt && _value.length > 0) {
      if (vt.indexOf('$1') === -1) {
        vt += '$1';
      }
      _value = vt.replace('$1', _value);
    }
    this.setValue(_value, silent);
  }

  getCardinalityTracker() {
    return this._cardinalityTracker;
  }

  setCardinalityTracker(cardTracker) {
    this._cardinalityTracker = cardTracker;
  }

  getItem() {
    return this._item;
  }

  getStatement() {
    return this._statement;
  }

  getParent() {
    return this._parent;
  }

  setParent(parent) {
    this._parent = parent;
  }

  /**
   * A binding is valid if:
   * <ol><li> it is a leaf and the corresponding statement is valid, </li>
   * <li>if it is a group and at least one of its children is valid, or</li>
   * <li>if it is a predicategroup and both the predicate and the object binding are valid.</ol>
   */
  isValid() {}

  getMatchingCode() {
    return this._matchingCode;
  }

  setMatchingCode(matchingCode) {
    this._matchingCode = matchingCode;
  }

  /**
   * stores the validity of ancestors.
   */
  setAncestorValid(valid) {
    this._ancestorValid = valid;
    this.updateAssertions();
  }

  /**
   *
   */
  updateAssertions() {}

  getHash() {
    return this._hash;
  }

  addListener(listener) {
    if (!this._listeners) {
      this._listeners = [];
    }
    this._listeners.push(listener);
  }

  removeListener(listener) {
    if (this._listeners) {
      const idx = this._listeners.indexOf(listener);
      if (idx !== -1) {
        this._listeners.splice(idx, 1);
      }
    }
  }

  bindingChange(binding) {
    if (this._listeners) {
      for (let i = 0; i < this._listeners.length; i++) {
        this._listeners[i](binding);
      }
    }
    if (this._parent) {
      this._parent.bindingChange(binding);
    }
    if (this._cardinalityTracker) {
      this._cardinalityTracker.touch();
    }
  }

  // ===================================================
  // Private methods
  // ===================================================
  _isValidObjectValue(value) {
    let _value = value;
    if (typeof _value !== 'string' && _value !== null) {
      throw new Error('In a binding every object value need to be a string!');
    }
    const pattern = this._item.getPattern();
    if (pattern) {
      _value = utils.extractGist(_value, this.getItem().getValueTemplate());
      return (
        _value !== undefined &&
        _value !== null &&
        _value !== '' &&
        new RegExp(`^${pattern}$`).test(_value)
      );
    }
    return _value !== undefined && _value !== null && _value !== '';
  }

  _isValidPredicateValue(value) {
    if (typeof value !== 'string' && value !== null) {
      throw new Error('In a binding every predicate need to be a string!');
    }
    return value !== undefined && value !== null && value !== '';
  }
}
