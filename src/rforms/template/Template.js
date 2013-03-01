/*global define*/
define(["dojo/_base/declare", "rforms/template/_BaseItem"], function(declare, _BaseItem) {

    /**
     * A template contains a root (a groupItem) and a list of ontologies.  
     */
    return declare(_BaseItem, {
	//===================================================
	// Private attributes
	//===================================================
	_itemStore: null,
	_root: null,

	//===================================================
	// Public API
	//===================================================
	getRoot: function() {
		return this._root;
	},
	getItemStore: function() {
		return this._itemStore;
	},
	getOntologies: function() {
		return this._ontologies;
	},

	//===================================================
	// Inherited methods
	//===================================================	
	constructor: function(source, root, itemStore) {
		this._itemStore = itemStore;
		this._ontologies = source.ontologies;
		this._root = root;
	}
    });
});