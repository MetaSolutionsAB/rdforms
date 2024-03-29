import CODES from './CODES';

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
    this._listeners = [];
    this._code = 0;
  }

  addListener(listener) {
    this._listeners.push(listener);
    return listener;
  }

  removeListener(listener) {
    this._listeners.splice(this._listeners.indexOf(listener), 1);
  }

  cardinalityChanged() {
    this._listeners.forEach(listener => listener());
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

  getCode() {
    return this._code;
  }

  setCode(code) {
    if (this._code !== code) {
      this._code = code;
      this.cardinalityChanged();
    }
  }

  setDepsOk(ok) {
    if (this._depsOk !== ok) {
      this._code = CODES.UNKNOWN;
      this._depsOk = ok;
      this.cardinalityChanged();
    }
  }

  increment() {
    this._counter += 1;
    this._code = CODES.UNKNOWN;
    this._checkCounter();
  }

  decrement() {
    this._counter -= 1;
    this._code = CODES.UNKNOWN;
    this._checkCounter();
  }

  getCounter() {
    return this._counter;
  }

  checkCardinality() {
    this._checkCounter();
  }

  touch() {
    this._code = CODES.UNKNOWN;
    this.cardinalityChanged();
  }

  // ===================================================
  // Private methods
  // ===================================================
  _checkCounter() {
    if (this._limits.max != null && this._counter === this._limits.max) {
      this._fine = true;
    } else if (this._limits.max != null && this._counter > this._limits.max) {
      this._fine = false;
    } else if (this._limits.min != null && this._counter === this._limits.min) {
      this._fine = true;
    } else if (this._limits.min != null && this._counter < this._limits.min) {
      this._fine = false;
    }
    this.cardinalityChanged();
  }
}
