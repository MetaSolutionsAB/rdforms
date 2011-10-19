/*global dojo, rforms*/
dojo.provide("rforms.template.Item");
dojo.require("rforms.template._BaseItem");

/**
 * Base functionality of Text, Group and Choice item classes.
 */
dojo.declare("rforms.template.Item", rforms.template._BaseItem, {
	//===================================================
	// Public API
	//===================================================
	/**
	 * @return {String} as a URI, may be undefined for Groups, never undefined for Text or choice item types. 
	 */
	getProperty: function() {
		return this._source.property;
	},
	/**
	 * @return {Object} never available for Text item type. 
	 * The property value pairs corresponds to predicate and objects in required tripples. 
	 */
	getConstraints: function() {
		return this._source.constraints;
	},
	/**
	 * @return {String} a URI indicating the datatype, for example: "http://www.w3.org/2001/XMLSchema.xsd#date".
	 */
	getDatatype: function() {
		return this._source.datatype;
	},
	/**
	 * @return {String} a two character language code, only relevant if the item type is Text and the nodetype is 
	 * a LANGUAGE_LITERAL, indicating that all matching bindings should be set with this language. 
	 */
	getLanguage: function() {
		return this._source.language;
	},
	getMember: function() {
		return this._source.member;
	},
	/**
	 * Allowed values are:
	 * LITERAL, RESOURCE, URI, BLANK, PLAIN_LITERAL, ONLY_LITERAL, LANGUAGE_LITERAL, DATATYPE_LITERAL
	 */
	getNodetype: function() {
		return this._source.nodetype || this._source.nodeType; //Ugly fix because it is often wrong written in SIRFF.
	},
	getValue: function() {
		return this._source.value;
	},
	/**
	 * @return {Object} containing max, min, and preferred properties.
	 */
	getCardinality: function() {
		return this._source.cardinality || {};
	},
	isEnabled: function() {
		return this._source.enabled === undefined ? true : this._source.enabled;
	}
});