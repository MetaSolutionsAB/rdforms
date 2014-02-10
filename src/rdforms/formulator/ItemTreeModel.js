/*global define*/
define(["dojo/_base/declare", "../template/Group"], function(declare, Group) {

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
            onComplete(parentItem.getChildren(true));
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
	    return item.getId(true) || item.getLabel(false, true) || item.getId() || item.getLabel() || item.getProperty(true) || item.getProperty() || "??? (missing label and/or property).";
	},
	
	
	// =======================================================================
	// Write interface

        // summary
        // Creates a new item.   See dojo.data.api.Write for details on args.
	newItem: function(/* Object? */ args, /*Item?*/ parent, insertIndex){
        var source, children = parent.getChildren(true);
        if (args.id) {
            //Do a reference
            source = {id: args.id};
        } else {
            //Insert inline
            source = args.getSource(true);
        }
        if (parent === this.item) {
            var bundle = this.itemStore.getBundles()[0];
            var templates = bundle.source.templates || bundle.source.auxilliary;
            templates.push(source);
            children.push(args);
        } else {
            var psource = parent.getSource(true);
            if (psource.content == null) {
                psource.content = [];
            }
            if (isNaN(insertIndex)) {
                psource.content.push(source);
                children.push(args);
            } else {
                psource.content.splice(insertIndex, 0, source);
                children.splice(insertIndex, 0, args);
            }
        }
        this.onChildrenChange(parent, children);
	},
    removeItem: function(item, parent) {
        var oldItems = parent.getChildren(true);
        var oldSource = parent.getSource(true).content;
        var oldIndex = oldItems.indexOf(item);
        oldItems.splice(oldIndex, 1);
        oldSource.splice(oldIndex, 1);
        this.onChildrenChange(parent, oldItems);
    },
    isItem: function(item) {
        var children = this.item.getChildren(true);
        return children.indexOf(item) != -1;
    },
        // summary
        //      Move or copy an item from one parent item to another.
        //      Used in drag & drop.
        //      If oldParentItem is specified and bCopy is false, childItem is removed from oldParentItem.
        //      If newParentItem is specified, childItem is attached to newParentItem.
	pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy, insertIndex) {
        var ref;
        var oldItems = oldParentItem.getChildren(true);
        var oldSource = oldParentItem.getSource(true).content;
        if (oldSource) {  //If oldsource exists, then we are not in fake root.
            var oldIndex = oldItems.indexOf(childItem);
            if (childItem.getId() == null) {
                ref = oldSource[oldIndex];
            } else {
                ref = {id: childItem.getId()};
            }
            oldItems.splice(oldIndex, 1);
            oldSource.splice(oldIndex, 1);
        } else {
            ref = {id: childItem.getId()};
        }

        if (oldParentItem === newParentItem) {
            if (isNaN(insertIndex)) {
                oldItems.push(childItem);
                oldSource.push(ref);
            } else {
                oldItems.splice(insertIndex, 0, childItem);
                oldSource.splice(insertIndex, 0, ref);
            }
            this.onChildrenChange(oldParentItem, oldItems);
        } else {
            if (newParentItem.getSource(true).content == null) {
                newParentItem.getSource(true).content = [];
            }
            var newItems = newParentItem.getChildren(true);
            if (isNaN(insertIndex)) {
                newItems.push(childItem);
                newParentItem.getSource(true).content.push(ref);
            } else {
                newItems.splice(insertIndex, 0, childItem);
                newParentItem.getSource(true).content.splice(insertIndex, 0, ref);
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
        parent.originalChildrenChanged();
    }
    });
});