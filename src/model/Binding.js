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
  constructor({ item, statement, graph }) {
    this._item = item;
    this._statement = statement;
    this._graph = graph;
    this._ancestorValid = true;
    this._cardinalityTracker = null;
    this._hash = "b_" + counter;
    counter++;
  }

  //===================================================
  // Public API
  //===================================================
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

  remove() {
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
  isValid() {
    //Override
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
  updateAssertions() {
    //Override
  }

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
      var idx = this._listeners.indexOf(listener);
      if (idx !== -1) {
        this._listeners.splice(idx, 1);
      }
    }
  }

  bindingChange(binding) {
    if (this._listeners) {
      for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i](binding);
      }
    }
    if (this._parent) {
      this._parent.bindingChange(binding);
    }
  }

  //===================================================
  // Private methods
  //===================================================
  _isValidObjectValue(value) {
    if (typeof value !== "string" && value !== null) {
      throw "In a binding every object value need to be a string!";
    }
    var pattern = this._item.getPattern();
    if (pattern) {
      value = utils.extractGist(value, this.getItem().getValueTemplate());
      return value !== undefined && value !== null && value !== "" &&
        (new RegExp("^" + pattern + "$")).test(value);
    } else {
      return value !== undefined && value !== null && value !== "";
    }
  }

  _isValidPredicateValue(value) {
    if (typeof value !== "string" && value !== null) {
      throw "In a binding every predicate need to be a string!";
    }
    return value !== undefined && value !== null && value !== "";
  }
};
