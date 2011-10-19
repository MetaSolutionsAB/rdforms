/*global dojo, rforms*/
dojo.provide("rforms.template.PropertyGroup");
dojo.require("rforms.template.Group");

/**
 * A PropertyGroup captures the special case when both the predicate and object of a
 * tripple should be changable. This is achieved by having a PropertyGroup where the
 * first child is a Choice item corresponding to the predicate and the second being
 * an item corresponding to the object in the triple. The second item can be either a 
 * Text, Choice or Group item depending on the kind of object envisioned in the triple.  
 */
dojo.declare("rforms.template.PropertyGroup", rforms.template.Group, {
	
	//===================================================
	// Inherited attributes
	//===================================================
	_forceChildrenClones: true,

	//===================================================
	// Public API
	//===================================================
	getPropertyItem: function() {
		return this.getChildren()[0];
	},
	getObjectItem: function() {
		return this.getChildren()[1];
	},
	
	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(source, children, itemStore) {
		this.getPropertyItem()._source.cardinality = {"min": 1, "max": 1, "pref": 1};
		this.getObjectItem()._source.cardinality = {"min": 1, "max": 1, "pref": 1};
	}
});