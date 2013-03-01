/*global define*/
define(["dojo/_base/declare"], function(declare) {

    /**
     * A counter paired with a item with cardinality restrictions.
     * To update the counter use the increment and decrement methods.
     * If the counter passes a cardinality restriction the 
     * corresponding hook is called, that is, maxReached, minReached,
     * and justFine when the counter moved within the acceptable
     * cardinality restrictions.
     */
    return declare(null, {
	//===================================================
	// Private attributes
	//===================================================
	_listeners: null,
	_counter: 0,
	_limits: null,
	
	//===================================================
	// Public hooks
	//===================================================	
	maxReached: function() {
	},
	minReached: function() {
	},
	cardinalityChanged: function() {
	},
	
	//===================================================
	// Public API
	//===================================================
	getCardinality: function() {
		return this._counter;
	},
	isMax: function() {
		return this._limits.max != null && this._counter >= this._limits.max;
	},
	isMin: function() {
		return this._limits.min != null && this._counter <= this._limits.min;
	},
	isFine: function() {
		return this._fine;
	},
	increment: function() {
		this._counter++;
		this._checkCounter();
	},
	decrement: function() {
		this._counter--;
		this._checkCounter();		
	},
	checkCardinality: function() {
		this._checkCounter();
	},
	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(item) {
		this._listener = [];
		this._limits = item.getCardinality() || {};
	},

	//===================================================
	// Private methods
	//===================================================
	_checkCounter: function() {
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
    });
});