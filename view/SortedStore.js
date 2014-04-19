/*global define*/
define([
    "dojo/_base/declare",
    "dojo/data/ItemFileWriteStore"
], function(declare, ItemFileWriteStore) {

    return declare(ItemFileWriteStore, {
	sortBy: "label",
	constructor: function(params) {
		if (params.sortBy != null) {
			this.sortBy = params.sortBy;
		}
	},
	fetch: function() {
		//Wrong order because of bad behaviour of FilteringSelect
		arguments[0].sort = [{attribute: this.sortBy, descending: false}];
		this.inherited("fetch", arguments);
	},
	getValues: function(item, attribute){
		var valueArray = this.inherited("getValues", arguments);
		if (valueArray != null && attribute === "children") {
			var sortBy = this.sortBy;
			valueArray.sort(function(a,b){
				//This assumes that there is always an "n" to be found (which is correct)
				if (a[sortBy] > b[sortBy]) {
					return 1;
				} else if (a[sortBy] < b[sortBy]) {
					return -1;
				} else {
					return 0;
				}
			});
			return valueArray;
		}
		return valueArray;
	}
    });
});