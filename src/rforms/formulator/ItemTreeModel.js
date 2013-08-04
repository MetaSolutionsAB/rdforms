/*global define*/
define(["dojo/_base/declare", "rforms/template/Group"], function(declare, Group) {

    return declare(null, {
	constructor: function(item, itemStore) {
	    this.item = item;
        this.itemStore = itemStore;
	},
	getRoot: function(onItem){
	    onItem(this.item);
	},
	mayHaveChildren: function(/*dojo.data.Item*/ item){
	    return item instanceof Group;
	},
	getChildren: function(/*dojo.data.Item*/ parentItem, /*function(items)*/ onComplete, onError){
	    if (parentItem instanceof Group) {
            onComplete(parentItem.getChildren());
        } else {
            onComplete([]);
        }
	},
	showError: function(entry, message) {
	},
	getIdentity: function(/* item */ item){
	    return item._internalId;
	},
	getLabel: function(/*dojo.data.Item*/ item){
	    return item.getId() || item.getLabel() || item.getProperty() || "??? (missing label and/or property).";
	},
	
	
	// =======================================================================
	// Write interface

        // summary
        // Creates a new item.   See dojo.data.api.Write for details on args.
	newItem: function(/* Object? */ args, /*Item?*/ parent, insertIndex){
        var source, children = parent.getChildren();
        if (args.id) {
            //Do a reference
            source = {id: args.id};
        } else {
            //Insert inline
            source = args._source;
        }
        if (parent === this.item) {
            var bundle = this.itemStore.getBundles()[0];
            var templates = bundle.source.templates || bundle.source.auxilliary;
            templates.push(source);
            children.push(args);
        } else {
            if (parent._source.content == null) {
                parent._source.content = [];
            }
            if (isNaN(insertIndex)) {
                parent._source.content.push(source);
                children.push(args);
            } else {
                parent._source.content.splice(insertIndex, 0, source);
                children.splice(insertIndex, 0, args);
            }
        }
        this.onChildrenChange(parent, children);
	},
    removeItem: function(item, parent) {
        var oldItems = parent.getChildren();
        var oldSource = parent._source.content;
        var oldIndex = oldItems.indexOf(item);
        oldItems.splice(oldIndex, 1);
        oldSource.splice(oldIndex, 1);
        this.onChildrenChange(parent, oldItems);
    },
    isItem: function(item) {
        var children = this.item.getChildren();
        return children.indexOf(item) != -1;
    },
        // summary
        //      Move or copy an item from one parent item to another.
        //      Used in drag & drop.
        //      If oldParentItem is specified and bCopy is false, childItem is removed from oldParentItem.
        //      If newParentItem is specified, childItem is attached to newParentItem.
	pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy, insertIndex) {
        var ref = {id: childItem.getId()};
        var oldItems = oldParentItem.getChildren();
        var oldSource = oldParentItem._source.content;
        if (oldSource) {  //If oldsource exists, then we are not in fake root.
            var oldIndex = oldItems.indexOf(childItem);
            oldItems.splice(oldIndex, 1);
            oldSource.splice(oldIndex, 1);
        }

        if (oldParentItem === newParentItem) {
            if (isNaN(insertIndex)) {
                oldItems.push(childItem);
                oldSource.push(ref);
            } else {
                oldItems.splice(insertIndex, 0, childItem);
                oldSource.splice(insertIndex, 0, ref);
            }
            var ref = oldSource[oldIndex];
            this.onChildrenChange(oldParentItem, oldItems);
        } else {
            if (newParentItem._source.content == null) {
                newParentItem._source.content = [];
            }
            var newItems = newParentItem.getChildren();
            if (isNaN(insertIndex)) {
                newItems.push(childItem);
                newParentItem._source.content.push(ref);
            } else {
                newItems.splice(insertIndex, 0, childItem);
                newParentItem._source.content.splice(insertIndex, 0, ref);
            }
            if (oldSource) {
                this.onChildrenChange(oldParentItem, oldItems);
            }
            this.onChildrenChange(newParentItem, newItems);
        }
    },
	// =======================================================================

        // Callbacks
        // summary
        //            Callback whenever an item has changed, so that Tree
        //            can update the label, icon, etc.   Note that changes
        //            to an item's children or parent(s) will trigger an
        //            onChildrenChange() so you can ignore those changes here.
	onChange: function(/*dojo.data.Item*/ item){
	},
        // summary
        //            Callback to do notifications about new, updated, or deleted items.
	onChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
	}
    });
});