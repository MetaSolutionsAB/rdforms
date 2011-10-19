/*global dojo, rforms*/
dojo.provide("rforms.template._BaseItem");

rforms.template.getLocalizedValue = function(hash) {
	if (hash == null) {
		return {precision: "none"};
	} else if (dojo.isString(hash)) {
		return {value: hash, precision: "nolang", lang: ""};
	} else if (hash.hasOwnProperty(dojo.locale)) {
		return {value: hash[dojo.locale], precision: "exact", lang: dojo.locale};
	} else {
		var pos = dojo.locale.indexOf("_");
		if (pos > -1 && hash.hasOwnProperty(dojo.locale.substr(0,2))) {
			return {value: hash[dojo.locale.substr(0,2)], precision: "coarsen", lang: dojo.locale.substr(0,2)};
		} else if (hash.hasOwnProperty("en")) {
			return {value: hash["en"], precision: "default", lang: "en"};
		} else if (hash.hasOwnProperty("")) {
			return {value: hash[""], precision: "nolang", lang: ""};
		} else {
			for (var prop in hash) {
				return {value: hash[prop], precision: "any", lang: prop};
			}
			return {precision: "none"};
		}
	}
};
/**
 * Common functionality of subclasses Item and Template.
 * (If it where not for the Template class, this functionality would be merged with Item.)
 */
dojo.declare("rforms.template._BaseItem", null, {
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
	},
	
	//===================================================
	// Private methods
	//===================================================	
	_getLocalizedValue: rforms.template.getLocalizedValue
});
