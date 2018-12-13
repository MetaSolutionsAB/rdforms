export default class CardinalityTracker {
  /**
   * A counter paired with a item with cardinality restrictions.
   * To update the counter use the increment and decrement methods.
   * If the counter passes a cardinality restriction the
   * corresponding hook is called, that is, maxReached, minReached,
   * and justFine when the counter moved within the acceptable
   * cardinality restrictions.
   */
  constructor(item) {
    this._listener = [];
    this._limits = item.getCardinality() || {};
    this._counter = 0;
    this._depsOk = true;
  }

  // ===================================================
  // Public hooks
  // ===================================================
  maxReached() {
  }

  minReached() {
  }

  cardinalityChanged() {
  }

  // ===================================================
  // Public API
  // ===================================================
  getCardinality() {
    return this._counter;
  }

  isMax() {
    return this._limits.max != null && this._counter >= this._limits.max;
  }

  isMin() {
    return this._limits.min != null && this._counter <= this._limits.min;
  }

  isFine() {
    return this._fine;
  }

  isDepsOk() {
    return this._depsOk;
  }

  setDepsOk(ok) {
    if (this._depsOk !== ok) {
      this._depsOk = ok;
      this.cardinalityChanged();
    }
  }

  increment() {
    this._counter += 1;
    this._checkCounter();
  }

  decrement() {
    this._counter -= 1;
    this._checkCounter();
  }

  getCounter() {
    return this._counter;
  }

  checkCardinality() {
    this._checkCounter();
  }

  // ===================================================
  // Private methods
  // ===================================================
  _checkCounter() {
    if (this._limits.max != null && this._counter === this._limits.max) {
      this._fine = true;
      this.maxReached();
    } else if (this._limits.max != null && this._counter > this._limits.max) {
      this._fine = false;
      this.maxReached();
    } else if (this._limits.min != null && this._counter === this._limits.min) {
      this._fine = true;
      this.minReached();
    } else if (this._limits.min != null && this._counter < this._limits.min) {
      this._fine = false;
      this.minReached();
    }
    this.cardinalityChanged();
  }
};