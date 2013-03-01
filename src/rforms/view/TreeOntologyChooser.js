define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "./Chooser", "./SortedStore", "rforms/utils", "dijit/Tree"], function(declare, lang, array, Chooser, SortedStore, utils, Tree) {

    return declare(Chooser, {
	//===================================================
	// Inherited methods
	//===================================================
	postCreate: function() {
	    this.inherited("postCreate", arguments);
	    
	    //Get the choices and prepare a store for the tree.
	    var choices = this.binding.getItem().getChoices();
	    //Prepare the value2choice index.
	    this._value2choice = {};
	    array.forEach(choices, function(choice) {
		this._value2choice[choice.value] = choice;
	    }, this);

	    var itemsArray = array.map(choices, function(choice) {
		//Only copy over label, description, top, children and selectable to be on the safe side.
		var obj = {value: choice.value};
		if (choice.label) {
		    obj.label = utils.getLocalizedValue(choice.label).value;				
		}
		if (choice.description) {
		    obj.description = utils.getLocalizedValue(choice.description).value;				
		}
		if (choice.top === true) {
		    obj.top = true;
		}
		if (choice.children != null) {
		    obj.children = lang.clone(choice.children);
		}
		if (choice.selectable === false) {
		    obj.selectable = false;				
		}
		return obj;
	    });

	    this._store = new SortedStore({
		sortBy: "label",
		data: {
		    identifier: "value",
		    label: "label",
		    items: itemsArray
		}
	    });
	    
	    //Init the tree
	    var tree = new Tree({store: this._store,
				       childrenAttr: ["children"], 
				       query: {top: true}, 
				       onClick: lang.hitch(this, function(item) {
					   var v = this._store.getValue(item,"value")
					   var c = this._value2choice[v];
					   this._selectChoice(c);
				       }),
				       getLabelClass: lang.hitch(this, function(item) {
					   if(item == null) {
					       return "";
					   }
					   var choice = this.binding.getChoice();
					   if(this._store.getValue(item, "selectable") === false) {
					       return "notselectable";
					   } if (choice != null && choice.value === this._store.getValue(item, "value")) {
					       return "currentselection";
					   }
					   return "default";
				       })}, this.selectionNode);
	    tree.startup();
	    this.bc.startup();
	}
    });
});