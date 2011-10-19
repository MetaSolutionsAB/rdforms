/*global dojo, rforms*/
dojo.provide("rforms.template.Template");
dojo.require("rforms.template.Group");

/**
 * A template contains a root (a groupItem) and a list of ontologies.  
 */
dojo.declare("rforms.template.Template", rforms.template._BaseItem, {
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