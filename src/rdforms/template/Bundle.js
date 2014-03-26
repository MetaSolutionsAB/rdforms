/*global define*/
define(["dojo/_base/declare"], function(declare) {

    var counter = 0;
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
        _id: null,
        _modified: false,
        _readOnly: false,

        //===================================================
        // Public API
        //===================================================
        getInternalId: function() {
            return this._id;
        },

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

        getItems: function() {
            return this._items;
        },

        addItem: function(item) {
            this._items.push(item);
        },

        removeItem: function(item) {
            this._items.splice(this._items.indexOf(item), 1);
        },

        isModified: function() {
           return this._modified;
        },

        setModified: function(modified) {
            this._modified = modified;
        },

        isReadOnly: function() {
            return this._readOnly || this._path == null;
        },

        //===================================================
        // Inherited methods
        //===================================================
        constructor: function(params) {
            this._itemStore = params.itemStore;
            this._source = params.source;
            this._path = params.path;
            this._readOnly = params.readOnly;
            this._items = [];
            counter++;
            this._id = "_bundle_"+counter;
        }
    });
});