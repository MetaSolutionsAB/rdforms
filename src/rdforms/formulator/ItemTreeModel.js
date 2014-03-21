/*global define*/
define(["dojo/_base/declare", "../template/Group", "../template/Bundle", "../template/Item"], function(declare, Group, Bundle, Item) {

    var sortF = function (i1, i2) {
        var lab1 = i1.getId() || i1.getProperty();
        var lab2 = i2.getId() || i2.getProperty();
        if (lab1 > lab2) {
            return 1;
        } else if (lab1 < lab2) {
            return -1;
        } else {
            return 0;
        }
    };


    return declare(null, {
	constructor: function(itemStore) {
        this.itemStore = itemStore;
	},
	getRoot: function(onItem){
	    onItem(this.itemStore);
	},
	mayHaveChildren: function(/*dojo.data.Item*/ item){
	    return item instanceof Group || item instanceof Bundle || item === this.itemStore;
	},
	getChildren: function(/*dojo.data.Item*/ parentItem, /*function(items)*/ onComplete, onError){
	    if (parentItem instanceof Group) {
            onComplete(parentItem.getChildren(true));
        } else if (parentItem instanceof Bundle) {
            onComplete(parentItem.getItems().sort(sortF));
        } else if (parentItem === this.itemStore) {
            onComplete(parentItem.getBundles());
        } else {
            onComplete([]);
        }
	},
	showError: function(entry, message) {
	},
	getIdentity: function(/* item */ item){
        if (item instanceof Bundle) {
            return item.getInternalId();
        } else if (item === this.itemStore) {
            return "___root";
        } else {
            item._internalId;
        }
	},
	getLabel: function(/*dojo.data.Item*/ item){
        if (item instanceof Bundle) {
            return item.getPath() || item.getInternalId();
        } else if (item === this.itemStore) {
            return "Root node";
        } else {
            return item.getId(true) || item.getLabel(false, true) || item.getId() || item.getLabel() || item.getProperty(true) || item.getProperty() || "??? (missing label and/or property).";
        }
	},
	
	
	// =======================================================================
	// Write interface

        // summary
        // Creates a new item.   See dojo.data.api.Write for details on args.
	newItem: function(/* Object? */ args, /*Item?*/ parent, insertIndex){
        var source, children;
        if (args.id) {
            //Do a reference
            source = {id: args.id};
        } else {
            //Insert inline
            source = args.getSource(true);
        }
        var bundle;
        if (parent instanceof Bundle) {
            var src = parent.getSource();
            var templates = src.templates || src.auxilliary;
            templates.push(source);
            parent.addItem(args);
            children = parent.getItems();
        } else if (parent === this.itemStore) {
            var bundle = this.itemStore().getBundles()[0];
            var src = bundle.getSource();
            var templates = src.templates || src.auxilliary;
            templates.push(source);
            bundle.addItem(args);
            children = bundle.getItems();
        } else {
            children = parent.getChildren(true);
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
        if (parent === this.itemStore) {
            return;
        }
        var oldItems;
        var oldSource;

        if (parent instanceof Bundle) {
            var oldItems = parent.getItems();
            var oldSource = parent.getSource().content;
        } else {
            var oldItems = parent.getChildren(true);
            var oldSource = parent.getSource(true).content;
        }
        var oldIndex = oldItems.indexOf(item);
        oldItems.splice(oldIndex, 1);
        oldSource.splice(oldIndex, 1);
        this.onChildrenChange(parent, oldItems);
    },
    isItem: function(item) {
        return item === this.itemStore || item instanceof Bundle || item instanceof Item;
//        var children = this.item.getChildren(true);
//        return children.indexOf(item) != -1;
    },
        // summary
        //      Move or copy an item from one parent item to another.
        //      Used in drag & drop.
        //      If oldParentItem is specified and bCopy is false, childItem is removed from oldParentItem.
        //      If newParentItem is specified, childItem is attached to newParentItem.
	pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy, insertIndex) {
        if (oldParentItem === this.itemStore || newParentItem === this.itemStore) {
            return;
        }
        var ref;
        var oldItems, oldSource;
        if (oldParentItem instanceof Bundle) {
            oldItems = oldParentItem.getItems();
            oldSource = oldParentItem.getSource();
            oldSource = oldSource.templates || oldSource.auxilliary;
        } else {
            oldItems = oldParentItem.getChildren(true);
            oldSource = oldParentItem.getSource(true).content;
        }
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
            var newSource, newItems;
            if (newParentItem instanceof Bundle) {
                newSource = newParentItem.getSource();
                if (newSource.templates == null && newSource.auxilliary == null) {
                    newSource.templates = [];
                }
                newSource = newSource.templates || newSource.auxilliary;
                newItems = newParentItem.getItems();
            } else {
                newSource = newParentItem.getSource(true);
                if (newSource.content == null) {
                    newSource.content = [];
                }
                newSource = newSource.content;
                newItems = newParentItem.getChildren(true);
            }


            if (isNaN(insertIndex)) {
                newItems.push(childItem);
                newSource.push(ref);
            } else {
                newItems.splice(insertIndex, 0, childItem);
                newSource.splice(insertIndex, 0, ref);
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
        if (parent.originalChildrenChanged) {
            parent.originalChildrenChanged();
        }
    }
    });
});