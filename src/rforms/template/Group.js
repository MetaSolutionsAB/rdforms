dojo.provide("rforms.template.Group");
dojo.require("rforms.template.Item");

/**
 * Group extends an Item by having children.
 */
dojo.declare("rforms.template.Group", rforms.template.Item, {
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
			this._children = this._itemStore._createItems(this._source.content || this._source.items || [], this._forceChildrenClones);
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
			if (o1.priority != null) {
				if (o2.priority != null) {
					return o1 > o2 ? 1 : o1 < o2 ? -1 : 0;
				} else {
					return o1.priority > 0 ? -1 : 1;
				}
			} else if (o2.priority != null) {
				return o2.priority > 0 ? 1 : -1;
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