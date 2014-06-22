/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang", 
	"dojo/dom-class", 
	"dojo/dom-construct", 
	"dojo/dom-attr", 
	"dojo/query", 
	"dijit/_Widget", 
	"dijit/focus", 
	"dijit/TooltipDialog", 
	"dijit/popup",
    "../model/Engine",
	"../model/ValueBinding",
	"../model/GroupBinding",
	"../model/ChoiceBinding",
	"../model/PropertyChoiceBinding",
	"../template/Group"
], function(declare, lang, domClass, construct, attr, query, _Widget, focus, TooltipDialog, popup,
            Engine, ValueBinding, GroupBinding, ChoiceBinding, PropertyChoiceBinding, Group) {
    
    var __currentDomNode;

    return declare(_Widget, {
	//===================================================
	// Public attributes
	//===================================================
	binding: null,
    template: null,
    graph: null,
    resource: "",
	topLevel: true,
	compact: false,
	styleCls: "",

	//===================================================
	// Public API
	//===================================================
	
	/**
	 * Tells wether something should be shown for the provided bindings and belonging item.
	 * @param {Object} item
	 * @param {Object} bindings
	 * @return {Boolean} true if something should be shown.
	 */
	showNow: function(item, bindings) {
	},
	
	/**
	 * This function may change the array of bindings, for instance remove all but the best language or complement the existing bindings 
	 * until the min cardinality is reached.
	 *  
	 * @param {Object} item
	 * @param {Array} bindings
	 * @return {Array} of bindings
	 */
	prepareBindings: function(item, bindings) {
	},
	
	/**
	 * Adds a table with headers for the given firstBinding.
	 * @param {Node} lastRow if provided it is the last row as a DOM element.
	 * @param {Object} firstBinding the first binding to show in this table.
	 */
	addTable: function(lastRow, firstBinding) {
	},
	
	/**
	 * Fills the table with one row for each binding in bindings.
	 * 
	 * @param {Object} table a table DOM element 
	 * @param {Array} bindings an array of bindings 
	 */
	fillTable: function(table, bindings) {
	},
	
	addLabel: function(rowDiv, labelDiv, binding) {
	},
	addGroup: function(fieldDiv, binding) {
	},
	addText: function(fieldDiv, binding) {
	},
	addChoice: function(fieldDiv, binding) {
	},
	showInfo: function(item, aroundNode) {
		if (item == null || (item.getProperty() == null &&item.getDescription() == null)) {
				return;
		}
		this.connect(aroundNode, "onclick", lang.hitch(this, this._showInfo, item, aroundNode));
		domClass.add(aroundNode, "rformsHasInfo");		
	},
	
	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(params) {
        this._handleParams(params);
    },

    _handleParams: function(params) {
        if (params.binding) {
            this.binding = params.binding;
        } else {
            this.template = params.template || this.template;
            this.graph = params.graph || this.graph;
            this.resource = params.resource || this.resource;
            if (this.graph == null || this.resource == null || this.template == null) {
                return;
            }
            this.binding = Engine.match(this.graph, this.resource, this.template);
        }
    },

    /**
	 * Builds the user interface by iterating over the child bindings of the current binding and recursively
	 * creates new views for all groupbindings.
	 */
	buildRendering: function() {
        this.domNode = this.srcNodeRef;
        domClass.add(this.domNode, "rforms");
        domClass.add(this.domNode, this.styleCls);
        this.render();
    },

    show: function(params) {
        this._handleParams(params);
        this.render();
    },

    render: function() {
        attr.set(this.domNode, "innerHTML", "");
        if (this.binding == null) {
            return;
        }
		var groupIndex, table, lastRow, table,
			groupedItemsArr = this.binding.getItem().getChildren(), 
			groupedBindingsArr = this.binding.getItemGroupedChildBindings(), 
			bindings, item;
		this._binding2node = {};

        if ((this.compact || this.binding.getItem().hasStyle("compact")) && !this.binding.getItem().hasStyle("nonCompact")) {
			domClass.add(this.domNode, "compact");			
		} else {
            domClass.remove(this.domNode, "compact");
        }

		for (groupIndex = 0; groupIndex < groupedBindingsArr.length; groupIndex++) {
			bindings = groupedBindingsArr[groupIndex];
			item = groupedItemsArr[groupIndex];

			if (!this.showNow(item, bindings)) {
				continue;
			}

			bindings = this.prepareBindings(item, bindings);
			
			//Table case
			if (this.showAsTable(item)) {
				lastRow = this.addLabelClean(lastRow, bindings[0], item);
				if (bindings.length > 0) {
					table = this.addTable(lastRow, bindings[0], item);
					this.fillTable(table, bindings);			
				}
			
			//Non table case
			} else {
			    if (bindings.length > 0) {
				for (var i=0;i<bindings.length;i++) {
                    //Add row with label if first row of same item or the binding is a group.
				    lastRow = this.addRow(lastRow, bindings[i], i === 0 || bindings[i] instanceof GroupBinding);
				}
			    } else {
				lastRow = this.addLabelClean(lastRow, null, item);
			    }
			}
									
			//Activates/deactivates buttons at startup if needed
			if (bindings.length > 0){
				bindings[0].getCardinalityTracker().checkCardinality();				
			}
		}
	},

	/**
	 * Adds a single row corresponding to a binding.
	 * 
	 * @param {Object} lastRow last row that was added
	 * @param {Object} binding the binding to add a row for
	 * @param {Boolean} includeLabel, tells if a label should be added, if undefined a label is added only when the binding is a GroupBinding.
	 */
	addRow: function(lastRow, binding, includeLabel) {
		var fieldDiv, newRow, item = binding.getItem();
		
		if (this.skipBinding(binding)) {
			return;
		}

		if (includeLabel == null) {
            includeLabel = binding instanceof GroupBinding;
        }

		//Taking care of dom node structure plus label.
		if (includeLabel === true) {
			newRow = this.addLabelClean(lastRow, binding, item);
			fieldDiv = construct.create("div", null, construct.create("div", {"class": "rformsFields"}, newRow));
		} else {
			//No new rowDiv since we have a repeated value under the same label.
			var rformsFields = query(".rformsFields", lastRow)[0];
			if (rformsFields != null) {
				fieldDiv = construct.create("div", {"class": "rformsRepeatedValue"}, rformsFields);				
			} else { //Unless we have an non-expanded row.
				fieldDiv = construct.create("div", null, construct.create("div", {"class": "rformsFields"}, lastRow));				
			}
		}
		this._binding2node[binding.getHash()] = fieldDiv;
		this.addComponent(fieldDiv, binding);
		return newRow || lastRow;
	},
	skipBinding: function(binding) {
		return false;
	},
	addLabelClean: function(lastRow, binding, item) {
		var newRow;

		//New rowDiv since we have a label
		if (lastRow === undefined) {
			newRow = construct.create("div", null, this.domNode);
		} else {
			newRow = construct.create("div", null, lastRow, "after");
		}
		if (this.topLevel) {
			domClass.add(newRow, "rformsTopLevel");
		}

        domClass.add(newRow, "rformsRow");
        if (item.hasStyle("invisibleGroup")) {
            domClass.add(newRow, "rformsInvisibleGroup")
        }
	    var clss = item.getClasses();
	    for (var e=0;e<clss.length;e++) {
		if (clss[e].indexOf("rforms") == -1) {
		    domClass.add(newRow, clss[e]);
		}
	    }
	    if (item instanceof Group) {
		domClass.add(newRow, "notCompact");			
	    }

	    this.addLabel(newRow, construct.create("div", null, newRow), binding, item);
	    return newRow;
	},
	addComponent: function(fieldDiv, binding, noCardinalityButtons) {
		//Taking care of the field, either group, choice or text.
		if (binding instanceof GroupBinding) {
			domClass.add(fieldDiv, "rformsGroup");
			this.addGroup(fieldDiv, binding, noCardinalityButtons);
		} else if (binding instanceof ChoiceBinding ||
					binding instanceof PropertyChoiceBinding) {
			domClass.add(fieldDiv, "rformsField");
			this.addChoice(fieldDiv, binding, noCardinalityButtons);
		} else if (binding instanceof ValueBinding) {
			domClass.add(fieldDiv, "rformsField");
			this.addText(fieldDiv, binding, noCardinalityButtons);
		}
	},
	showAsTable: function(item) {
		return item instanceof Group && (item.hasStyle("table") || item.hasClass("rformsTable"));
	},

	//===================================================
	// Private methods
	//===================================================	
	_showInfo:function(item, aroundNode) {
	    if (__currentDomNode === aroundNode) {
		return;
	    }
	    __currentDomNode = aroundNode;
	    
	    //Prepare the TooltipDialog.
	    var tooltipDialog = new TooltipDialog({});
	    
	    tooltipDialog.onBlur = function() {
            popup.close(tooltipDialog);
	    };
	    
	    tooltipDialog.openPopup = function() {
		popup.open({
		    popup: tooltipDialog,
		    around: aroundNode,
		    onClose: lang.hitch(null, function() {
			tooltipDialog.destroy();
			setTimeout(function() {
			    if (aroundNode === __currentDomNode) {__currentDomNode = null;}}, 500);
		    })
		});
	    };

	    //Now init the content of the dialog
	    var property = item.getProperty();
	    var description = item.getDescription();
	    var message = "<div class='rforms itemInfo'><div class='itemInfoTable'>";
	    var label = item.getLabel() || "";
	    if (label !== "") {
		message += "<div><label class='propertyLabel'>Label:&nbsp;</label><span class='propertyValue'>"+label+"</span></div>";
	    }
	    if (property != null) {
            var ptemp = item.getProperty();
            message += "<div><label class='propertyLabel'>Property:&nbsp;</label><a class='propertyValue' target='_blank' href='"+ptemp+"'>"+ptemp+"</a></div>";
	    }
	    if (description != null) {
		message += "<div><label class='descriptionLabel'>Description:&nbsp;</label><span class='descriptionValue'>"+description.replace(/(\r\n|\r|\n)/g, "<br/>")+"</span></div>";
	    }
	    message +="</div></div>";
	    tooltipDialog.setContent(message);
	    setTimeout(function() {
		focus.focus(tooltipDialog.domNode);
	    }, 1);
	    
	    //Launch the dialog.
	    tooltipDialog.openPopup();
	}
    });
});