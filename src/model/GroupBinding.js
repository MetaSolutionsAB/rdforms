import Binding from './Binding';
import CardinalityTracker from './CardinalityTracker';

export default class GroupBinding extends Binding {
  /**
   * Corresponds to a binding for a Group item type.
   * Handles sub-bindings grouped by item.
   * Validity of a group is determined by at least one of the sub-bindings being valid.
   * All sub-bindings must notify when their validity changed so that the validity of
   * the parent group can be checked and possibly updated.
   * Potential statement and constraints are asserted when both parents are valid and this GroupBinding is valid.
   *
   * @see rforms.template.Group
   */
  constructor(params) {
    super(params);

    const {constraints = [], childrenRootUri = null} = params;
    this._constraints = constraints;
    //Generates an array of arrays, one array for each child item.

    this._childBindings = this._item.getChildren().map(child => ([]));
    this._rootUri = childrenRootUri;
    this._validPredicate = true;
    if (this._statement) {
      this._validPredicate = this._isValidPredicateValue(this._statement.getPredicate());
    }
    this._cachedChildBindings = null;
  }

  //===================================================
  // Public API
  //===================================================

  getValue() {
    return this.getChildrenRootUri();
  }

  oneChildValidityChanged(valid) {
    if (valid === this._oneValidChild) {
      return;
    }
    if (!valid) {
      //Since we do not keep track of which children have valid values,
      //we need to iterate through all children to check if some other child has a valid value
      //(and check if valid predicate) if so, abort change.
      delete this._oneValidChild;
      if (this.isValid()) {
        return false; //No change
      }
    }

    //Below we change the valid state of this group.
    this._oneValidChild = valid;
    //If there is no parent or it's valid state did not change,
    //then the groups assertions has not been changed and the children
    //have not been notified of this group change in validity.
    this._notifyValidityChange(valid && this._validPredicate);
    return this._validPredicate; //Validity of group changed only if valid predicate.
  }

  getChildrenRootUri() {
    if (this._statement) { //Either the object of the statement.
      return this._statement.getValue();
    } else if (this._rootUri != null) {
      return this._rootUri;
    } else if (this._parent != null) {
      return this._parent.getChildrenRootUri();
    }
  }

  addChildBinding(binding) {
    this.addChildBindings([binding]);
  }

  addChildBindings(bindings) {
    this._cachedChildBindings = null;
    if (!Array.isArray(bindings) || bindings.length === 0) {
      return;
    }
    const item = bindings[0].getItem();
    const children = this._item.getChildren();
    for (var i = children.length; i >= 0; i--) {
      if (item === children[i]) {
        var cardTracker = this._childBindings[i].length > 0 ?
          this._childBindings[i][0].getCardinalityTracker() :
          new CardinalityTracker(item);
        this._childBindings[i] = this._childBindings[i].concat(bindings);
        bindings.forEach((binding) => {
          binding.setParent(this);
          binding.setCardinalityTracker(cardTracker);
          cardTracker.increment();
        }, this);
        break;
      }
    }
  }

  removeChildBinding(binding) {
    this._cachedChildBindings = null;
    var children = this._item.getChildren();
    for (var i = children.length; i >= 0; i--) {
      if (binding.getItem() === children[i]) {
        this._childBindings[i].splice(this._childBindings[i].indexOf(binding), 1);
        delete binding._parent;
        binding.getCardinalityTracker().decrement();
        break;
      }
    }
    this.oneChildValidityChanged();
  }

  getChildBindingsFor(item) {
    var children = this._item.getChildren();
    for (var i = children.length; i >= 0; i--) {
      if (item === children[i]) {
        return this._childBindings[i];
      }
    }
  }

  getItemGroupedChildBindings() {
    return this._childBindings;
  }

  getChildBindings() {
    if (this._cachedChildBindings == null) {
      if (this._childBindings && this._childBindings.length > 0) {
        var arr = [];
        this._cachedChildBindings = arr.concat.apply(arr, this._childBindings);
      } else {
        this._cachedChildBindings = [];
      }
    }
    return this._cachedChildBindings;
  }

  setPredicate(predicate) {
    var oValidPredicate = this._validPredicate;
    if (this._isValidPredicateValue(predicate)) {
      this._statement.setPredicate(predicate);
      this._validPredicate = true;
      if (oValidPredicate !== true && this._oneValidChild === true) {
        this._notifyValidityChange(true);
      }
    } else {
      //Note that we actually do not set the invalid value, just unassert the statement.
      this._validPredicate = false;
      if (oValidPredicate !== false && this._oneValidChild === true) {
        this._notifyValidityChange(false);
      }
    }
    this.updateAssertions();
  }

  getPredicate() {
    return this._statement.getPredicate();
  }

  remove() {
    this._oneValidChild = false;
    this.setAncestorValid(false);
    if (this._parent != null) {
      this._parent.removeChildBinding(this);
    }
    super.remove(arguments);
  }

  isValid() {
    if (this._oneValidChild == null) {
      this._oneValidChild = this._forceOneValidChildCheck();
    }
    return this._oneValidChild && this._validPredicate;
  }

  setAncestorValid(valid) {
    this._ancestorValid = valid;
    this.updateAssertions();
    this._childBindings.forEach(
      bindingArr => bindingArr.forEach(
        binding => binding.setAncestorValid(valid && this._oneValidChild && this._validPredicate),
        this),
      this);
  }

  updateAssertions() {
    if (this._oneValidChild == null) {
      this.isValid();
    }
    var assert = this._ancestorValid && this._oneValidChild && this._validPredicate;
    if (this._statement != null) {
      this._statement.setAsserted(assert);
    }
    this._constraints.forEach(constraintStmt => constraintStmt.setAsserted(assert));
    this.getChildBindings().forEach(binding => binding.updateAssertions());
  }

  //===================================================
  // Private methods
  //===================================================
  _forceOneValidChildCheck() {
    return this._childBindings.some(arr => arr.some(binding => binding.isValid()));
  }

  _notifyValidityChange(newValidity) {
    if (!this._parent || !this._parent.oneChildValidityChanged(newValidity)) {
      //We can reuse the setAncestorValid method by setting the current value.
      this.updateAssertions();
      this._childBindings.forEach(bindingArr => bindingArr.forEach(binding => binding.setAncestorValid(newValidity)));
    }
  }
};
