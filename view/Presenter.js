/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/kernel",
    "dojo/_base/event",
    "dojo/on",
	"dojo/dom-class", 
	"dojo/dom-construct", 
	"dojo/dom-attr", 
	"./View",
	"../template/Group",
	"../utils",
    "rdforms/model/system"
], function(declare, kernel, event, on, domClass, construct, attr, View, Group, utils, system) {

    var Presenter = declare(View, {
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
		return bindings.length > 0 && !item.hasStyle("invisible");
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
			} else if (lang === kernel.locale) {
				alts.best = bindings[index];
			} else if (lang.indexOf(kernel.locale) !== -1 || kernel.locale.indexOf(lang) !== -1) {
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
		var table = construct.create("table", {"class": "rformsGroup"}, newRow);
		var tHead = construct.create("thead", null, table);
		var tHeadRow = construct.create("tr", null, table);
		for (var colInd = 0;colInd < childItems.length;colInd++) {
			var th = construct.create("th", null, tHeadRow);
			this.showInfo(item, construct.create("span", {innerHTML: childItems[colInd].getLabel()}, th));
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
			trEl = construct.create("tr", null, table);
			
			for (colInd = 0; colInd< childBindingsGroups.length;colInd++) {
				if (childBindingsGroups[colInd].length > 0) {
					this.addComponent(construct.create("td", null, trEl), childBindingsGroups[colInd][0], true);
				} else {
					construct.create("td", null, trEl);					
				}
			}
		}
	},
	skipBinding: function(binding) {
		return binding.getItem() instanceof Group && binding.getChildBindings().length === 0;
	},

	addLabel: function(rowDiv, labelDiv, binding) {
		var item = binding.getItem();
		var isGroup = item instanceof Group;
        var label = item.getLabel();
        if (label != null && label != "") {
            label = label.charAt(0).toUpperCase() + label.slice(1);
        } else {
            label = "";
        }

		attr.set(labelDiv, "innerHTML", label);
		domClass.add(labelDiv, "rformsLabel");
		this.showInfo(binding.getItem(), labelDiv);
	},
	addGroup: function(fieldDiv, binding) {
		var subView = new Presenter({binding: binding, topLevel: false}, fieldDiv);
	},
	addText: function(fieldDiv, binding) {
        var item = binding.getItem();
        if (item.getNodetype() === "URI") {
            if (item.hasStyle("image")) {
                construct.create("img", {"class": "rformsImage", "src": binding.getValue()}, fieldDiv);
            } else {
                var a, vmap = utils.getLocalizedMap(binding);
                if (vmap) {
                    a = construct.create("a", {"class": "rformsUrl", title: binding.getValue(),
                        href: binding.getValue(), innerHTML: utils.getLocalizedValue(vmap).value}, fieldDiv);
                } else {
                    a = construct.create("a", {"class": "rformsUrl",
                        href: binding.getValue(), innerHTML: binding.getValue()}, fieldDiv);
                }
                if (item.hasStyle("externalLink")) {
                    system.attachExternalLinkBehaviour(a, binding);
                } else {
                    system.attachLinkBehaviour(a, binding);
                }
            }
        } else {
            if (this.showLanguage && binding.getLanguage()) {
                var lang = construct.create("div", {"innerHTML": binding.getLanguage()}, fieldDiv);
                domClass.add(lang, "rformsLanguage");
            }
            var text = binding.getValue().replace("<", "&lt;").replace(">", "&gt;").replace(/(\r\n|\r|\n)/g, "<br/>");
            construct.create("div", {"innerHTML": text}, fieldDiv);
        }
	},
	addChoice: function(fieldDiv, binding) {
		var choice = binding.getChoice(),
            item = binding.getItem(),
            desc;
        if (choice.description) {
            desc = utils.getLocalizedValue(choice.description).value;
        }
        if (item.hasStyle("image")) {
            construct.create("img", {"class": "rformsImage", "src": choice.value, title: desc || choice.value}, fieldDiv);
        } else if (item.hasStyle("stars") && parseInt(choice.value) != NaN) {
			for (var i=parseInt(choice.value);i>0;i--) {
				construct.create("span", {"class": "rformsStar"}, fieldDiv);
			}
		} else {
            var a = construct.create("a", {"class": "rformsUrl",
                href: choice.seeAlso || choice.value, title: desc || choice.seeAlso || choice.value, "innerHTML": utils.getLocalizedValue(choice.label).value}, fieldDiv);

            if (item.hasStyle("externalLink")) {
                system.attachExternalLinkBehaviour(a, binding);
            } else {
                system.attachLinkBehaviour(a, binding);
            }
            if (choice.load != null) {
                choice.load(function () {
                    attr.add(a, "innerHTML", utils.getLocalizedValue(choice.label).value);
                });
            }
		}
	}
    });
    return Presenter;
});