/*global dojo, rforms, dijit*/
dojo.provide("rforms.view.Presenter");
dojo.require("rforms.view.View");
dojo.require("dijit._Widget");


dojo.declare("rforms.view.Presenter", rforms.view.View, {
	//===================================================
	// Public attributes
	//===================================================
	showLanguage: true,
	filterTranslations: true,
	styleCls: "rformsPresenter",
	
	//===================================================
	// Public API
	//===================================================
	/**
	 * Show only if any bindings exists for the given item.
	 * @param {Object} item
	 * @param {Object} bindings
	 */
	showNow: function(item, bindings) {
		return bindings.length > 0;
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
		var alts = {}, index;
		if (!this.filterTranslations || item.getNodetype() !== "LANGUAGE_LITERAL") {
			return bindings;
		}
		for (index =0;index<bindings.length;index++) {
			var lang = bindings[index].getLanguage();
			if (lang === "" || lang === undefined) {
				alts.noLanguage = bindings[index];
			} else if (lang === dojo.locale) {
				alts.best = bindings[index];
			} else if (lang.indexOf(dojo.locale) !== -1 || dojo.locale.indexOf(lang) !== -1) {
				alts.close = bindings[index];				
			} else if (lang.indexOf(this.defaultLanguage) === 0) {
				alts.defaultLanguage = bindings[index];
			} 
		}
		var singleBinding = alts.best || alts.close || alts.defaultLanguage || alts.noLanguage;
		return  singleBinding !== undefined ? [singleBinding] : bindings;
	},
	
	addTable: function(newRow, firstBinding) {
		var item = firstBinding.getItem(), childItems = item.getChildren();
		var table = dojo.create("table", {"class": "rformsGroup"}, newRow);
		tHead = dojo.create("thead", null, table);
		tHeadRow = dojo.create("tr", null, table);
		for (colInd = 0;colInd < childItems.length;colInd++) {
			var th = dojo.create("th", null, tHeadRow);
			this.showInfo(item, dojo.create("span", {innerHTML: childItems[colInd].getLabel()}, th));
		}
		return table;
	},
	fillTable: function(table, bindings) {
		if (bindings.length === 0) {
			return;
		}
		var item = bindings[0].getItem();
		var rowInd, colInd, childBindingsGroups, trEl;
		
		for (rowInd = 0; rowInd < bindings.length;rowInd++) {
			childBindingsGroups = bindings[rowInd].getItemGroupedChildBindings();
			trEl = dojo.create("tr", null, table);
			
			for (colInd = 0; colInd< childBindingsGroups.length;colInd++) {
				dojo.create("td", {innerHTML: childBindingsGroups[colInd].length > 0 ? childBindingsGroups[colInd][0].getValue() : ""}, trEl);
			}
		}
	},
	skipBinding: function(binding) {
		return binding.getItem() instanceof rforms.template.Group && binding.getChildBindings().length === 0;
	},

	addLabel: function(rowDiv, labelDiv, binding) {
		var item = binding.getItem();
		var isGroup = item instanceof rforms.template.Group;
		dojo.attr(labelDiv, "innerHTML", item.getLabel() || "");
		dojo.addClass(labelDiv, "rformsLabel");
		this.showInfo(binding.getItem(), labelDiv);
	},
	addGroup: function(fieldDiv, binding) {
		var subView = new rforms.view.Presenter({binding: binding, template: this.template, topLevel: false}, fieldDiv);
	},
	addText: function(fieldDiv, binding) {
		if (this.showLanguage && binding.getLanguage()) {
			var lang = dojo.create("div", {"innerHTML": binding.getLanguage()}, fieldDiv);
			dojo.addClass(lang, "rformsLanguage");
		}
		dojo.create("div", {"innerHTML": binding.getValue().replace(/(\r\n|\r|\n)/g, "<br/>")}, fieldDiv);
	},
	addChoice: function(fieldDiv, binding) {
		var choice = binding.getChoice();
		var span = dojo.create("span", {"innerHTML": rforms.template.getLocalizedValue(choice.label).value}, fieldDiv);
		if (choice.load != null) {
			choice.load(function() {
				dojo.attr(span, "innerHTML", rforms.template.getLocalizedValue(choice.label).value);
			});
		}
	}
});