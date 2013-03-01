/*global define*/
define(["dojo/_base/declare", 
	"./Binding"
], function(declare, Binding) {

    /**
     * Corresponds to a binding for a Text item type, captures literals, literals with 
     * language, datatyped literals, or non blank resources, that is, URI's.
     * Validity is determined by a valid predicate and object.
     * The statement is asserted when the parents are valid and this ValueBinding is valid.
     * 
     * @see rforms.template.Text
     */
    return declare(Binding, {
	//===================================================
	// Private attributes
	//===================================================
	_validObject: true,
	_validPredicate: true,
	_excludeFromTreeValidityCheck: false,

	//===================================================
	// Public API
	//===================================================
	/**
	 * @return {String} corresponding to the value, even if the nodetype is URI 
	 * or datatype says for example date.
	 */
	getValue: function() {
		return this._statement.getValue();
	},
	/**
	 * @param {String} value
	 */
	setValue: function(value) {
		var oValidObject = this._validObject;
		if (this._isValidValue(value)) {
			this._statement.setValue(value);
			this._validObject = true;
			if (oValidObject !== true && this._validPredicate === true && !this._excludeFromTreeValidityCheck) {
				this._parent.oneChildValidityChanged(true);
			}
		} else {
			//Note that we actually do not set the invalid value, just unassert the statement.
			this._validObject = false;
			if (oValidObject !== false && this._validPredicate === true) {
				this._parent.oneChildValidityChanged(false);
			}
		}
		this.updateAssertions();
	},
	/**
	 * @return {String} corresponding to a uri.
	 */
	getPredicate: function() {
		return this._statement.getPredicate();
	},
	/**
	 * @param {String} predicate corresponding to a uri.
	 */
	setPredicate: function(predicate) {
		var oValidPredicate = this._validPredicate;
		if (this._isValidValue(predicate)) {
			this._statement.setPredicate(predicate);
			this._validPredicate = true;
			if (oValidPredicate !== true && this._validObject === true) {
				this._parent.oneChildValidityChanged(true);
			}
		} else {
			//Note that we actually do not set the invalid value, just unassert the statement.
			this._validPredicate = false;
			if (oValidPredicate !== false && this._validObject === true) {
				this._parent.oneChildValidityChanged(false);
			}
		}
		this.updateAssertions();
	},
	/**
	 * @return {String} a two or three character language code.
	 */
	getLanguage: function() {
		return this._statement.getLanguage();
	},
	/**
	 * @param {Object} lang a two or three character language code.
	 */
	setLanguage: function(lang) {
		this._statement.setLanguage(lang);
	},
	/**
	 * @return {String} corresponding to a uri.
	 */
	getDatatype: function() {
		return this._statement.getDatatype();
	},
	/**
	 * @param {String} dt corresponding to a uri.
	 */
	setDatatype: function(dt) {
		this._statement.setDatatype(dt);
	},
	
	setExcludeFromTreeValidityCheck: function(value) {
		this._excludeFromTreeValidityCheck = value;
	},
	//===================================================
	// Inherited methods
	//===================================================
	constructor: function() {
		if (this._statement) {
			this._validPredicate = this._isValidValue(this._statement.getPredicate());
			this._validObject = this._isValidValue(this._statement.getValue());			
		}
	},
	remove: function() {
		this.setValue(null);
		this._parent.removeChildBinding(this);
		this.inherited("remove", arguments);
	},
	updateAssertions: function() {
		var assert = this._ancestorValid && this._validObject && this._validPredicate;
		this._statement.setAsserted(assert);
	},
	isValid: function() {
		return this._validObject && this._validPredicate && !this._excludeFromTreeValidityCheck;
	}
    });
});