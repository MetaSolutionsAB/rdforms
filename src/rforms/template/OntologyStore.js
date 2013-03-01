/*global define*/
define(["dojo/_base/declare"], function(declare) {

    /**
     * Simple store of ontologies to allow reuse across templates and items. 
     */
    return declare(null, {
	//===================================================
	// Private attributes
	//===================================================
	_registry: null,
	
	//===================================================
	// Public API
	//===================================================	
	importRegistry: function(registry) {
		dojo.mixin(this._registry, registry);
	},
	getChoices: function(choiceItem, callback) {
		var choices = this._findChoices(choiceItem);
		if (choices == null) {
			//TODO load via xhr and deferred.
		} else {
			if (callback == null) {
				return choices;
			} else {
				callback(choices);				
			}
		}
	},

	//===================================================
	// Inherited methods
	//===================================================
	constructor: function() {
		this._registry = {};
	},
	//===================================================
	// Private methods
	//===================================================
	_findChoices: function(item) {
		var ontologyChoiceArr = this._registry[item.getOntologyUrl()];
		if (ontologyChoiceArr != null) {
			for (var ind = 0; ind < ontologyChoiceArr.length;ind++) {
				var obj = ontologyChoiceArr[ind];
				if (this._objEqual(obj.constraints, item.getConstraints()) &&
					item.getParentProperty() == obj.parentProperty &&
					item.getHierarchyProperty() == obj.hierarchyProperty &&
					item.isParentPropertyInverted() == (obj.isParentPropertyInverted || false) &&
					item.isHierarchyPropertyInverted() == (obj.isHierarchyPropertyInverted || false)) {
					return obj.choices;
				}
			}
		} 
	},
	_objEqual: function(obj1, obj2) {
		var keys = {};
		for (var key in obj1) {
			if (obj1.hasOwnProperty(key)) {
				var val1 = obj1[key], val2 = obj2[key];
				if (dojo.isObject(val1) && dojo.isObject(val2)) {
					if (!this._objEqual(val1, val2)) {
						return false;
					}
				} else if (obj1[key] !== obj2[key]) {
					return false;
				}				
			}
			keys[key] = true;
		}
		for (var key in obj2) {
			if (keys[key] !== true && obj2.hasOwnProperty(key)) {
				var val1 = obj1[key], val2 = obj2[key];
				if (dojo.isObject(val1) && dojo.isObject(val2)) {
					if (!this._objEqual(val1, val2)) {
						return false;
					}
				} else if (obj2[key] !== obj1[key]) {
					return false;
				}
			}
		}
		return true;
	},
	_constructLoadUrl: function(choiceItem) {
		var params = [];
		params.push("constr="+encodeURIComponent(dojo.toJson(choiceItem.getConstraints())));
		if (choiceItem.getParentProperty() != null) {
			var pp = choiceItem.isParentPropertyInverted() === true ? "ipp=" : "pp=";
			params.push(pp+encodeURIComponent(choiceItem.getParentProperty()));
		}
		if (choiceItem.getHierarchyProperty() != null) {
			var hp = choiceItem.isHierarchyPropertyInverted() === true ? "ihp=" : "hp=";
			params.push(hp+encodeURIComponent(choiceItem.getHierarchyProperty()));
		}
		return choiceItem.getOntologyUrl()+"?"+params.join("&");
	}
    });
});