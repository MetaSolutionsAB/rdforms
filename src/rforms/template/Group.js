/*global define*/
define(["dojo/_base/declare", "./Item"], function(declare, Item) {

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
	getChildren: function() {
		if (this._children == null) {
			this._children = this._itemStore.getChildren(this);//this._itemStore._createItems(this._source.content || this._source.items || [], this._forceChildrenClones);
			if (this._source.automatic) {
				this.sortChildren();
			}
		}
		return this._children;
	},
	sortChildren: function() {
		dojo.forEach(this._children, function(item) {
			item.__label = item.getLabel().toLowerCase();
		});
		this._children.sort(function(o1, o2) {
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
	},

	//===================================================
	// Inherited methods
	//===================================================	
	constructor: function(source, children, itemStore) {
		this._children = children;
		this._itemStore = itemStore;
	},
	getNodetype: function() {
		return this.inherited("getNodetype", arguments) || "RESOURCE"; //Ugly fix because it is often wrong written in SIRFF.
	}
    });
});