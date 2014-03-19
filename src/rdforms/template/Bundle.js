/*global define*/
define(["dojo/_base/declare"], function(declare) {

    /**
     * A Bundle corresponds to a set of items typically managed in a single file.
     */
    return declare(null, {
        //===================================================
        // Private attributes
        //===================================================
        _itemStore: null,
        _source: null,
        _path: null,
        _items: null,
        _root: null,

        //===================================================
        // Public API
        //===================================================
        getSource: function() {
            return this._source;
        },
        setRoot: function(itemId) {
            return this._source.root = itemId;
        },
        getRoot: function() {
            if (this._source.root) {
                return this._itemStore.getItem(this._source.root);
            }
        },
        getItemStore: function() {
            return this._itemStore;
        },
        getPath: function() {
            return this._path;
        },

        addItem: function(item) {
            this._items.push(item);
        },

        removeItem: function(item) {
            this._items.splice(this._items.indexOf(item), 1);
        },

        //===================================================
        // Inherited methods
        //===================================================
        constructor: function(params) {
            this._itemStore = params.itemStore;
            this._source = params.source;
            this._path = params.path;
            this._items = [];
        }
    });
});