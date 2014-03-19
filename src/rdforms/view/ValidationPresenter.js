/*global define*/
define([
    "dojo/_base/declare",
    "dojo/dom-class",
    "dojo/dom-construct",
    "../template/Group",
    "../template/PropertyGroup",
    "../model/Engine",
    "./Presenter"
], function(declare, domClass, construct, Group, PropertyGroup, Engine, Presenter) {

    var ValidationPresenter = declare(Presenter, {
	//===================================================
	// Public attributes
	//===================================================
	showLanguage: true,
	filterTranslations: false,
	styleCls: "rformsPresenter",
	
	//===================================================
	// Public API
	//===================================================
	showNow: function(item, bindings) {
		if (item.hasStyle("invisible")) {
			return false;
		}
		if (bindings.length > 0) {
			return true;
		}
		var card = item.getCardinality();
		switch(this.includeLevel) {
			case "mandatory":
				return card && card.min>=1;
			case "recommended":
				return card && (card.min>=1 || card.pref>=1);
			default:
				return true;
		}
	},
	
	showAsTable: function() {
		return false;
	},
	
	/**
	 * Has no effect on items that with node type different than LANGUAGE_LITERAL or if filterTranslations is set to false. 
	 * Otherwise a single binding is returned with the best language match according to the locale.
	 * 
	 * @param {Object} item
	 * @param {Object} bindings
	 * @param {Array} with a single value if the filtering has taken place, otherwise same as input bindings.
	 */
	prepareBindings: function(item, bindings) {
		var card = item.getCardinality();
		var target, min = card.min != null ? card.min : 0, pref = card.pref != null ? card.pref : 0;
		if (card.pref > 0) {
			target = card.pref;
		} else if (card.min > 0) {
			target = card.min;
		} else if (item instanceof PropertyGroup) {
			target = 0;
		} else if (item instanceof Group) {
			if (item.getProperty() == null) {
				target = 1;
			} else {
				target = 0;
			}
		} else {
			target = 1;
		}
		if (target > bindings.length) {
			bindings = bindings.concat([]);
			while(target > bindings.length) {
				var binding = Engine.create(this.binding, item);
				if (bindings.length < min) {
					binding.error = true;
				} else if (bindings.length < pref){
					binding.warning = true;
				}
				bindings.push(binding);
			}
		}
		return bindings;
	},
	
	skipBinding: function(binding) {
		return false;
	},
	
	addValidationMarker: function(fieldDiv, binding) {
		var card = binding.getItem().getCardinality();
		var min = card.min != null ? card.min : 0, pref = card.pref != null ? card.pref : 0;
		if (binding.error) {
			domClass.add(fieldDiv, "error");
			construct.create("div", {"innerHTML": ""+min+" value"+(min === 1? "": "s")+" is required"}, fieldDiv);
			return true;
		} else if (binding.warning){
			domClass.add(fieldDiv, "warning");
			construct.create("div", {"innerHTML": ""+pref+" value"+(pref === 1? "": "s")+" is recommended."}, fieldDiv);
			return true;
		} else {
			return false;
		}
	},
	
	addGroup: function(fieldDiv, binding) {
		if (!this.addValidationMarker(fieldDiv, binding)) {
			new ValidationPresenter({binding: binding, topLevel: false}, fieldDiv);
		}
	},

	addText: function(fieldDiv, binding) {
		if (!this.addValidationMarker(fieldDiv, binding)) {
			this.inherited("addText", arguments);
		}
	},
	addChoice: function(fieldDiv, binding) {
		if (!this.addValidationMarker(fieldDiv, binding)) {
			this.inherited("addChoice", arguments);
		}
	}
    });
    return ValidationPresenter;
});