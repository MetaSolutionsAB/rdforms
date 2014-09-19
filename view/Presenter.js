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
], function(declare, kernel, event, on, domClass, domConstruct, domAttr, View, Group, utils, system) {

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
		var table = domConstruct.create("table", {"class": "rformsGroup"}, newRow);
		var tHead = domConstruct.create("thead", null, table);
		var tHeadRow = domConstruct.create("tr", null, table);
		for (var colInd = 0;colInd < childItems.length;colInd++) {
			var th = domConstruct.create("th", null, tHeadRow);
			this.showInfo(item, domConstruct.create("span", {innerHTML: childItems[colInd].getLabel()}, th));
		}
		return table;
	},
	fillTable: function(table, bindings) {
		if (bindings.length === 0) {
			return;
		}
		var item = bindings[0].getItem();
		var rowInd, colInd, childBindingsGroups, trEl;

        var tl = this.topLevel;
        this.topLevel = false; //Table-cells are never toplevel, hence intermediate override.
		for (rowInd = 0; rowInd < bindings.length;rowInd++) {
			childBindingsGroups = bindings[rowInd].getItemGroupedChildBindings();
			trEl = domConstruct.create("tr", null, table);
			
			for (colInd = 0; colInd< childBindingsGroups.length;colInd++) {
				if (childBindingsGroups[colInd].length > 0) {
					this.addComponent(domConstruct.create("td", null, trEl), childBindingsGroups[colInd][0], true);
				} else {
					domConstruct.create("td", null, trEl);
				}
			}
		}
        this.topLevel = tl;
	},
	skipBinding: function(binding) {
		return binding.getItem() instanceof Group && binding.getChildBindings().length === 0;
	},

	addLabel: function(rowDiv, labelDiv, binding, item /*provided if there is no binding*/) {
		var isGroup = item instanceof Group;
        var label = item.getLabel();
        if (label != null && label != "") {
            label = label.charAt(0).toUpperCase() + label.slice(1);
        } else {
            label = "";
        }

		domAttr.set(labelDiv, "innerHTML", label);
		domClass.add(labelDiv, "rformsLabel");
		this.showInfo(item, labelDiv);
	},
	addGroup: function(fieldDiv, binding) {
		var subView = new Presenter({binding: binding, topLevel: false}, fieldDiv);
	},
	addText: function(fieldDiv, binding) {
        var item = binding.getItem();
        if (item.getNodetype() === "URI") {
            if (item.hasStyle("image")) {
                domConstruct.create("img", {"class": "rformsImage", "src": binding.getGist()}, fieldDiv);
            } else {
                var a, vmap = utils.getLocalizedMap(binding);
                if (vmap) {
                    a = domConstruct.create("a", {"class": "rformsUrl", title: binding.getValue(),
                        href: binding.getValue(), innerHTML: utils.getLocalizedValue(vmap).value}, fieldDiv);
                } else {
                    a = domConstruct.create("a", {"class": "rformsUrl",
                        href: binding.getValue(), innerHTML: binding.getGist()}, fieldDiv);
                }
                if (item.hasStyle("externalLink")) {
                    system.attachExternalLinkBehaviour(a, binding);
                } else {
                    system.attachLinkBehaviour(a, binding);
                }
            }
        } else {
            if (this.showLanguage && binding.getLanguage()) {
                var lang = domConstruct.create("div", {"innerHTML": binding.getLanguage()}, fieldDiv);
                domClass.add(lang, "rformsLanguage");
            }
            var text = binding.getGist().replace("<", "&lt;").replace(">", "&gt;").replace(/(\r\n|\r|\n)/g, "<br/>");

            // The text is shown as a link to the parents bindings URI if:
            // 1) The current item is indicated to be a label.
            // 2) The presenter is not at topLevel.
            // 3) The current item is first in the parents list of children.
            // 4) The parent binding corresponds to a URI.
            var parentBinding = binding.getParent();
            if (item.hasStyle("label")
                && this.topLevel !== true
                && parentBinding != null && parentBinding.getItem().getChildren()[0] === item
                && parentBinding.getStatement() != null && parentBinding.getStatement().getType() === "uri") {
                a = domConstruct.create("a", {"class": "rformsUrl",
                    href: parentBinding.getStatement().getValue(), innerHTML: text}, fieldDiv);
                system.attachLinkBehaviour(a, parentBinding);
            } else {
                domConstruct.create("div", {"innerHTML": text}, fieldDiv);
            }
        }
	},
	addChoice: function(fieldDiv, binding) {
		var choice = binding.getChoice(),
            item = binding.getItem(),
            desc;
        if (!choice) {
            return;
        }
        if (choice.description) {
            desc = utils.getLocalizedValue(choice.description).value;
        }
        if (item.hasStyle("image")) {
            domConstruct.create("img", {"class": "rformsImage", "src": choice.value, title: desc || choice.value}, fieldDiv);
        } else if (item.hasStyle("stars") && parseInt(choice.value) != NaN) {
			for (var i=parseInt(choice.value);i>0;i--) {
				domConstruct.create("span", {"class": "rformsStar"}, fieldDiv);
			}
		} else if (item.hasStaticChoices() && !item.hasStyle("externalLink")) {
            domConstruct.create("div", {"innerHTML": utils.getLocalizedValue(choice.label).value}, fieldDiv);
        } else {
            var a = domConstruct.create("a", {"class": "rformsUrl",
                href: choice.seeAlso || choice.value, title: desc || choice.seeAlso || choice.value, "innerHTML": utils.getLocalizedValue(choice.label).value}, fieldDiv);
            if (item.hasStyle("externalLink")) {
                system.attachExternalLinkBehaviour(a, binding);
            } else {
                system.attachLinkBehaviour(a, binding);
            }
            if (choice.load != null) {
                choice.load(function () {
                    domAttr.add(a, "innerHTML", utils.getLocalizedValue(choice.label).value);
                });
            }
		}
	}
    });
    return Presenter;
});