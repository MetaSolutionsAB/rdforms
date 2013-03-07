/*global define*/
define(["dojo/_base/declare", "../utils"], function(declare, utils) {
    var itemCount = 0;

    /**
     * Common functionality of subclasses Item and Template.
     * (If it where not for the Template class, this functionality would be merged with Item.)
     */
    return declare(null, {
	//===================================================
	// Private attributes
	//===================================================
	_source: {},
	
	//===================================================
	// Public API
	//===================================================
	getId: function() {
		return this._source.id || this._source["@id"];
	},
	setId: function(id) {
		this._source.id = id;
		delete this._source["@id"];
	},
	getType: function() {
	    return this._source.type || this._source["@type"];
	},
	getExtends: function() {
	    return this._source["extends"] || "";
	},
	getLabelMap: function() {
		return this._source.label;
	},
	setLabel: function(value, lang) {
		this._source.label = this.setLangHash(this._source.label, value, lang);
	},
	setDescription: function(value, lang) {
		this._source.label = this.setLangHash(this._source.label, value, lang);
	},
	_setLangHash: function(hash, value, lang) {
		hash = hash || {};
		if (dojo.isString(value)) {
			if (dojo.isString(lang)) {
				hash[lang] = value;
			} else {
				hash[""] = value;
			}
		} else if (dojo.isObject(value)){
			return value;
		}
		return hash;
	},
	getLabel: function(returnDetails) {
		return returnDetails ? this._getLocalizedValue(this._source.label) : this._getLocalizedValue(this._source.label).value;
	},
	getDescription: function(returnDetails) {
		return returnDetails ? this._getLocalizedValue(this._source.description) : this._getLocalizedValue(this._source.description).value;
	},
	getClasses: function() {
		return this._source.cls || [];
	},
	hasClass: function(cls) {
		if (this._source.cls === undefined) {
			return false;
		}
		return dojo.some(this._source.cls, function(c) {
			return c.toLowerCase() === cls.toLowerCase();
		});
	},
	/**
	 * @return {Array} that contains strings with the style, if no style is defined an empty array is returned
	 */
	getStyles: function() {
		return this._source.styles || [];
	},
	hasStyle: function(sty) {
		if (this._source.styles === undefined) {
			return false;
		}
		return dojo.some(this._source.styles, function(s) {
			return s.toLowerCase() === sty.toLowerCase();
		});
	},
	//===================================================
	// Inherited methods
	//===================================================	
	constructor: function(source) {
		this._source = source;
		this._internalId = itemCount++;
	},
	
	//===================================================
	// Private methods
	//===================================================	
	_getLocalizedValue: utils.getLocalizedValue
    });
});
