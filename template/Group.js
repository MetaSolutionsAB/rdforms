/*global define*/
define(["dojo/_base/declare", "./Item"], function(declare, Item) {

    var sortItems = function(items) {
        dojo.forEach(items, function(item) {
            item.__label = (item.getLabel() || "").toLowerCase();
        });
        items.sort(function(o1, o2) {
            if (o1._source.priority != null) {
                if (o2._source.priority != null) {
                    return o1._source.priority > o2._source.priority ? -1 : o1._source.priority < o2._source.priority ? 1 : 0;
                } else {
                    return o1._source.priority > 0 ? -1 : 1;
                }
            } else if (o2._source.priority != null) {
                return o2._source.priority > 0 ? 1 : -1;
            } else if (o1.__label > o2.__label) {
                return 1;
            } else if (o1.__label < o2.__label) {
                return -1;
            } else {
                return 0;
            }
        });
    };

    /**
     * Group extends an Item by having children.
     */
    return declare(Item, {
        //===================================================
        // Private attributes
        //===================================================
        _children: null,
        _forceChildrenClones: false,
        _parent: null,

        //===================================================
        // Public API
        //===================================================
        getChildren: function(original) {
            original = original && this.isExtention();
            var children = original ? this._ochildren : this._children;

            if (children == null) {
                children = this._itemStore.getChildren(this, original);
                if (this.getSource().automatic === true && this._itemStore.automaticSortAllowed) {
                    sortItems(children);
                }
                this["_"+(original ? "o" : "")+"children"] = children;
            }
            return children;
        },
        originalChildrenChanged: function() {
            if (this.isExtention()) {
                delete this._children;
            }
        },
        setExtends: function(extendsStr) {
            this.inherited("setExtends", arguments);
            delete this._children;
            delete this._ochildren;
        },
        //===================================================
        // Inherited methods
        //===================================================
        constructor: function(params) {
            this._children = params.children;
            if (this._source.content != null) {
                this._source.items = this._source.content;
                delete this._source.content;
            }
        },
        getNodetype: function() {
            return this.inherited("getNodetype", arguments) || "RESOURCE"; //Ugly fix because it is often wrong written in SIRFF.
        }
    });
});