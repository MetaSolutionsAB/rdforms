dojo.provide("rforms.formulator.TreeModel");
dojo.require("rforms.template.Item");

dojo.declare("rforms.formulator.TreeModel", null, {
	constructor: function(item) {
		this.item = item;
	},
	getRoot: function(onItem){
		onItem(this.item);
	},
	mayHaveChildren: function(/*dojo.data.Item*/ item){
		return item instanceof rforms.template.Group;
	},
	getChildren: function(/*dojo.data.Item*/ parentItem, /*function(items)*/ onComplete){
		onComplete(parentItem.getChildren());
	},
	showError: function(entry, message) {
	},
	getIdentity: function(/* item */ item){
		return item._internalId;
	},
	getLabel: function(/*dojo.data.Item*/ item){
		return item.getLabel() || item.getProperty() || item._internalId;
	},
	
	
	// =======================================================================
	// Write interface
	newItem: function(/* Object? */ args, /*Item?*/ parent){
        // summary
        //            Creates a new item.   See dojo.data.api.Write for details on args.
	},
	pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy){
        // summary
        //            Move or copy an item from one parent item to another.
        //            Used in drag & drop.
        //            If oldParentItem is specified and bCopy is false, childItem is removed from oldParentItem.
        //            If newParentItem is specified, childItem is attached to newParentItem.
	},
	// =======================================================================
	// Callbacks
	onChange: function(/*dojo.data.Item*/ item){
        // summary
        //            Callback whenever an item has changed, so that Tree
        //            can update the label, icon, etc.   Note that changes
        //            to an item's children or parent(s) will trigger an
        //            onChildrenChange() so you can ignore those changes here.
	},
	onChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
        // summary
        //            Callback to do notifications about new, updated, or deleted items.
	}
});