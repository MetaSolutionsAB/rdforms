/*global define*/
define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/_base/array",
    "../view/ChoicesTreeModel"
], function (lang, declare, array, ChoicesTreeModel) {

    return declare(ChoicesTreeModel, {
        postscript: function () {
            this._detectTops();
        },
        _detectTops: function () {
            array.forEach(this.choices, function(child) {
                delete child.top;
            })
            var rootChildren = this._getChildren(this.root);
            if (rootChildren.length < this.choices.length) {
                array.forEach(rootChildren, function(child) {
                    child.top = true;
                });
            }
        },
        getIdentity: function (/* item */ item) {
            if (item === this.root) {
                return this.root.value;
            }
            var obj = this.choiceIdx[item.value];
            if (obj) {
                return this.choiceIdx[item.value].id;
            } else {
                return (this._temporaryIdx || {})[item.value];
            }
        },

        // =======================================================================
        // Write interface
        // summary
        // Creates a new item.   See dojo.data.api.Write for details on args.
        newItem: function (/* Object? */ args, /*Item?*/ parent, insertIndex) {
            this.choices.push(args);
            this.choiceIdx[args.value] = {choice: args, id: this._newId()};
            if (parent !== this.root) {
                this.choiceIdx[args.value].parent = parent;
                parent.children = parent.children || [];
                parent.children.push({_reference: args.value});
            }
            this._detectTops();
            this.onChildrenChange(parent, this._getChildren(parent));
        },
        isNameFree: function (name) {
            return this.choiceIdx[name] == null;
        },
        renameItem: function (item, to) {
            var from = item.value;
            if (from === to || this.choiceIdx[to]) {
                return false;
            }
            var obj = this.choiceIdx[from];
            delete this.choiceIdx[from];
            this.choiceIdx[to] = obj;
            item.value = to;
            array.forEach(this.choices, function (choice) {
                if (choice.children) {
                    array.forEach(choice.children, function (child) {
                        if (child._reference === from) {
                            child._reference = to;
                        }
                    });
                }
            });
            this.onChange(item);
        },

        removeItem: function (item, parent) {
            this._removeItem(item, parent);
            this._detectTops();
            this.onChildrenChange(parent, this._getChildren(parent));
            //Temporary index to allow tree to find the right ids and remove the subtree.
            setTimeout(lang.hitch(this, function() {
                delete this._temporaryIdx;
            },100));
        },
        _removeItem: function (item, parent) {
            var oldIndex = this.choices.indexOf(item);
            this.choices.splice(oldIndex, 1);
            this._temporaryIdx = this._temporaryIdx || [];
            this._temporaryIdx[item.value] = this.choiceIdx[item.value].id;
            delete this.choiceIdx[item.value];
            parent.children = array.filter(parent.children, function (child) {
                return child._reference !== item.value;
            });
            if (parent.children.length === 0) {
                delete parent.children;
            }
            if (item.children) {
                array.forEach(item.children, function(child) {
                    this._removeItem(this.choiceIdx[child._reference].choice, item);
                }, this);
            }
        },
        isItem: function (item) {
            return this.choices.indexOf(item) != -1;
        },
        pasteItem: function (/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy, insertIndex) {
            if (oldParentItem === newParentItem) {
                return;
            }
            //Remove from old parent.
            if (oldParentItem !== this.root) {
                oldParentItem.children = array.filter(oldParentItem.children, function (child) {
                    return child._reference !== childItem.value;
                });
                if (oldParentItem.children.length === 0) {
                    delete oldParentItem.children;
                }
            }
            //Add to new parent
            if (newParentItem !== this.root) {
                newParentItem.children = newParentItem.children || [];
                newParentItem.children.push({_reference: childItem.value});
                this.choiceIdx[childItem.value].parent = newParentItem;
            } else {
                delete this.choiceIdx[childItem.value].parent;
            }
            this._detectTops();
            this.onChildrenChange(oldParentItem, this._getChildren(oldParentItem));
            this.onChildrenChange(newParentItem, this._getChildren(newParentItem));
        },
        // =======================================================================

        // Callbacks
        // summary
        //            Callback whenever an item has changed, so that Tree
        //            can update the label, icon, etc.   Note that changes
        //            to an item's children or parent(s) will trigger an
        //            onChildrenChange() so you can ignore those changes here.
        onChange: function (/*dojo.data.Item*/ item) {
        },
        // summary
        //            Callback to do notifications about new, updated, or deleted items.
        onChildrenChange: function (/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList) {
        }
    });
});