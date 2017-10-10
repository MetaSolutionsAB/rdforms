/* global define*/
define(['dojo/_base/declare'], declare =>
    /**
     * A counter paired with a item with cardinality restrictions.
     * To update the counter use the increment and decrement methods.
     * If the counter passes a cardinality restriction the
     * corresponding hook is called, that is, maxReached, minReached,
     * and justFine when the counter moved within the acceptable
     * cardinality restrictions.
     */
   declare(null, {
     // ===================================================
     // Private attributes
     // ===================================================
     _listeners: null,
     _counter: 0,
     _depsOk: true,
     _limits: null,

     // ===================================================
     // Public hooks
     // ===================================================
     maxReached() {
     },
     minReached() {
     },
     cardinalityChanged() {
     },

     // ===================================================
     // Public API
     // ===================================================
     getCardinality() {
       return this._counter;
     },
     isMax() {
       return this._limits.max != null && this._counter >= this._limits.max;
     },
     isMin() {
       return this._limits.min != null && this._counter <= this._limits.min;
     },
     isFine() {
       return this._fine;
     },
     isDepsOk() {
       return this._depsOk;
     },
     setDepsOk(ok) {
       if (this._depsOk !== ok) {
         this._depsOk = ok;
         this.cardinalityChanged();
       }
     },
     increment() {
       this._counter += 1;
       this._checkCounter();
     },
     decrement() {
       this._counter -= 1;
       this._checkCounter();
     },
     checkCardinality() {
       this._checkCounter();
     },
     // ===================================================
     // Inherited methods
     // ===================================================
     constructor(item) {
       this._listener = [];
       this._limits = item.getCardinality() || {};
     },

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
     },
   }));
