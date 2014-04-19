/*global define*/
define([
    "dojo/_base/declare",
    "../utils"
], function (declare, utils) {

    var counter = 0;
    return declare(null, {
        constructor: function (choices) {
            this.root = {value: "__root__"};
            this.choices = choices;
            //Create index.
            this.choiceIdx = {};
            for (var i = 0; i < choices.length; i++) {
                var choice = choices[i];
                this.choiceIdx[choice.value] = {choice: choice, id: this._newId()};
            }
            //Mark all that belongs to a parent.
            for (var key in this.choiceIdx) {
                if (this.choiceIdx.hasOwnProperty(key)) {
                    var obj = this.choiceIdx[key];
                    if (obj.choice.children) {
                        for (var j = 0; j < obj.choice.children.length; j++) {
                            var childObj = this.choiceIdx[obj.choice.children[j]._reference];
                            childObj.parent = obj.choice;
                        }
                    }
                }
            }
        },
        _newId: function() {
            counter++;
            return "c_" + counter;
        },
        getRoot: function (onItem) {
            onItem(this.root);
        },
        mayHaveChildren: function (/*dojo.data.Item*/ item) {
            return item === this.root || item.children != null;
        },
        getChildren: function (/*dojo.data.Item*/ parentItem, /*function(items)*/ onComplete, onError) {
            onComplete(this._getChildren(parentItem));
        },
        _getChildren: function (/*dojo.data.Item*/ parentItem) {
            var arr = [];
            if (parentItem === this.root) {
                for (var key in this.choiceIdx) {
                    if (this.choiceIdx.hasOwnProperty(key)) {
                        if (!this.choiceIdx[key].parent) {
                            arr.push(this.choiceIdx[key].choice);
                        }
                    }
                }
            } else if (parentItem.children) {
                for (var i = 0; i < parentItem.children.length; i++) {
                    arr.push(this.choiceIdx[parentItem.children[i]._reference].choice);
                }
            }
            return arr;
        },
        showError: function (entry, message) {
        },
        getIdentity: function (/* item */ item) {
            if (item === this.root) {
                return this.root.value;
            }
            return this.choiceIdx[item.value].id;
        },
        getLabel: function (/*dojo.data.Item*/ item) {
            if (item === this.root) {
                return "Root";
            } else {
                return utils.getLocalizedValue(item.label).value || item.value || "??? (missing label and value).";
            }
        },


        // =======================================================================
        // Write interface
        // summary
        // Creates a new item.   See dojo.data.api.Write for details on args.
        newItem: function (/* Object? */ args, /*Item?*/ parent, insertIndex) {
        },

        removeItem: function (item, parent) {
        },

        isItem: function (item) {
            return this.choices.indexOf(item) != -1;
        },
        pasteItem: function (/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy, insertIndex) {
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