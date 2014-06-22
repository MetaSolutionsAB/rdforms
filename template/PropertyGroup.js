/*global define*/
define(["dojo/_base/declare", "./Group"], function(declare, Group) {

    /**
     * A PropertyGroup captures the special case when both the predicate and object of a
     * tripple should be changable. This is achieved by having a PropertyGroup where the
     * first child is a Choice item corresponding to the predicate and the second being
     * an item corresponding to the object in the triple. The second item can be either a 
     * Text, Choice or Group item depending on the kind of object envisioned in the triple.  
     */
    return declare(Group, {
        //===================================================
        // Public API
        //===================================================
        getChildren: function() {
            if (this._delegatedChildren == null) {
                var override = {getCardinality: function() {
                    return {"min": 1, "max": 1, "pref": 1};
                }};
                this._delegatedChildren = dojo.map(this.inherited("getChildren", arguments), function(child) {
                    return dojo.delegate(child, override);
                });
            }
            return this._delegatedChildren;
        },
        getPropertyItem: function() {
            return this.getChildren()[0];
        },
        getObjectItem: function() {
            return this.getChildren()[1];
        }
    });
});