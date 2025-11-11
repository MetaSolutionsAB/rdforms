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
   * @see template/Group
   */
  constructor(params) {
    super(params);

    const { constraints = [], childrenRootUri = null } = params;
    this._constraints = constraints;
    // Generates an array of arrays, one array for each child item.

    this._childBindings = this._item.getChildren().map(() => []);
    this._rootUri = childrenRootUri;
    this._validPredicate = true;
    this._validObject = true;
    if (this._statement) {
      this._validPredicate = this._isValidPredicateValue(
        this._statement.getPredicate()
      );
      this._validObject = this._isValidObjectValue(
        this._statement.getValue(),
        this._statement.getType()
      );
    }
    this._cachedChildBindings = null;
  }

  // ===================================================
  // Public API
  // ===================================================

  getValue() {
    return this.getChildrenRootUri();
  }

  oneChildValidityChanged(valid) {
    if (valid === this._oneValidChild) {
      return false; // No change
    }
    if (!valid) {
      // Since we do not keep track of which children have valid values,
      // we need to iterate through all children to check if some other child has a valid value
      // (and check if valid predicate) if so, abort change.
      delete this._oneValidChild;
      if (this.isValid()) {
        return false; // No change
      }
    }

    // Below we change the valid state of this group.
    this._oneValidChild = valid;
    // If there is no parent or it's valid state did not change,
    // then the groups assertions has not been changed and the children
    // have not been notified of this group change in validity.
    this._notifyValidityChange(
      valid && this._validPredicate && this._validObject
    );
    return this._validPredicate && this._validObject; // Validity of group changed only if valid predicate and object.
  }

  setSubject(uri) {
    if (this._statement) {
      this._statement.setSubject(uri);
    } else {
      this.getChildBindings().forEach((cb) => cb.setSubject(uri));
    }
  }

  getChildrenRootUri() {
    if (this._statement) {
      // Either the object of the statement.
      return this._statement.getValue();
    } else if (this._rootUri != null) {
      return this._rootUri;
    } else if (this._parent != null) {
      return this._parent.getChildrenRootUri();
    }
    return undefined;
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
    for (let i = children.length; i >= 0; i--) {
      if (item === children[i]) {
        const cardTracker =
          this._childBindings[i].length > 0
            ? this._childBindings[i][0].getCardinalityTracker()
            : new CardinalityTracker(item);
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
    const children = this._item.getChildren();
    for (let i = children.length; i >= 0; i--) {
      if (binding.getItem() === children[i]) {
        this._childBindings[i].splice(
          this._childBindings[i].indexOf(binding),
          1
        );
        delete binding._parent;
        binding.getCardinalityTracker().decrement();
        break;
      }
    }
    this.oneChildValidityChanged();
    this.bindingChange(binding);
  }

  getChildBindingsFor(item) {
    const children = this._item.getChildren();
    for (let i = children.length; i >= 0; i--) {
      if (item === children[i]) {
        return this._childBindings[i];
      }
    }
    return undefined;
  }

  getItemGroupedChildBindings() {
    return this._childBindings;
  }

  getChildBindings() {
    if (this._cachedChildBindings == null) {
      if (this._childBindings && this._childBindings.length > 0) {
        this._cachedChildBindings = [].concat(...this._childBindings);
      } else {
        this._cachedChildBindings = [];
      }
    }
    return this._cachedChildBindings;
  }

  setPredicate(predicate) {
    const oValidPredicate = this._validPredicate;
    if (this._isValidPredicateValue(predicate)) {
      this._statement.setPredicate(predicate);
      this._validPredicate = true;
      if (
        oValidPredicate !== true &&
        this._validObject &&
        (this.getItem().getNodetype() === 'URI' ? true : this._oneValidChild)
      ) {
        this._notifyValidityChange(true);
      }
    } else {
      // Note that we actually do not set the invalid value, just unassert the statement.
      this._validPredicate = false;
      if (
        oValidPredicate !== false &&
        this._validObject &&
        (this.getItem().getNodetype() === 'URI' ? true : this._oneValidChild)
      ) {
        this._notifyValidityChange(false);
      }
    }
    this.updateAssertions();
  }

  // eslint-disable-next-line no-dupe-class-members
  getValue() {
    if (this._statement && this._statement.isObjectBlank()) {
      return '';
    }

    return this._statement && this._statement.getValue();
  }

  setValue(value) {
    if (this.getItem().getNodetype() !== 'URI' || !this._statement) {
      throw new Error(
        'Cannot change the value of a group unless its nodetype is URI and' +
          ' also that it corresponds to a statement'
      );
    }
    const oldIsValidObject = this._validObject;
    const isValidObject = this._isValidObjectValue(value, 'uri');
    if (isValidObject) {
      this._validObject = true;
      this._statement._o.type = 'uri';
      this._statement.setValue(value);
      this._constraints.forEach((stmt) => stmt.setSubject(value));
      this.getChildBindings().forEach((cb) => cb.setSubject(value));
      if (!oldIsValidObject && this._validPredicate) {
        this._notifyValidityChange(true);
      }
    } else {
      this._validObject = false;
      if (oldIsValidObject && this._validPredicate) {
        this._notifyValidityChange(false);
      }
    }
  }

  getPredicate() {
    return this._statement ? this._statement.getPredicate() : undefined;
  }

  remove() {
    this._oneValidChild = false;
    this.setAncestorValid(false);
    if (this._parent != null) {
      this._parent.removeChildBinding(this);
    }
    super.remove(arguments);
  }

  _isValid() {
    if (this.getItem().getNodetype() === 'URI') {
      return this._validObject && this._validPredicate;
    }

    return this._oneValidChild && this._validPredicate && this._validObject;
  }

  isValid() {
    if (this._oneValidChild == null) {
      this._oneValidChild = this._forceOneValidChildCheck();
    }

    return this._isValid();
  }

  setAncestorValid(valid) {
    this._ancestorValid = valid;
    this.updateAssertions();
    this._childBindings.forEach(
      (bindingArr) =>
        bindingArr.forEach(
          (binding) => binding.setAncestorValid(valid && this._isValid()),
          this
        ),
      this
    );
  }

  updateAssertions() {
    if (this._oneValidChild == null) {
      this.isValid();
    }
    const assert = this._ancestorValid && this._isValid();
    if (this._statement != null) {
      this._statement.setAsserted(assert);
    }
    this._constraints.forEach((constraintStmt) =>
      constraintStmt.setAsserted(assert)
    );
    this.getChildBindings().forEach((binding) => binding.updateAssertions());
  }

  // ===================================================
  // Private methods
  // ===================================================
  _forceOneValidChildCheck() {
    return this._childBindings.some((arr) =>
      arr.some((binding) => binding.isValid())
    );
  }

  _notifyValidityChange(newValidity) {
    if (!this._parent || !this._parent.oneChildValidityChanged(newValidity)) {
      // We can reuse the setAncestorValid method by setting the current value.
      this.updateAssertions();
      this._childBindings.forEach((bindingArr) =>
        bindingArr.forEach((binding) => binding.setAncestorValid(newValidity))
      );
    }
  }

  _isValidObjectValue(value, type) {
    if (this.getItem().getNodetype() === 'URI' && type !== 'uri') {
      return false;
    }
    return super._isValidObjectValue(value);
  }
}
