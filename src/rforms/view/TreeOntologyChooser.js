/*
 * Copyright (c) 2007-2010
 *
 * This file is part of Confolio.
 *
 * Confolio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Confolio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Confolio. If not, see <http://www.gnu.org/licenses/>.
 */

dojo.provide("rforms.view.TreeOntologyChooser");
dojo.require("rforms.view.Chooser");
dojo.require("dijit.Tree");
dojo.require("rforms.view.SortedStore");

dojo.declare("rforms.view.TreeOntologyChooser", rforms.view.Chooser, {
	//===================================================
	// Inherited methods
	//===================================================
	postCreate: function() {
		this.inherited("postCreate", arguments);

		//Get the choices and prepare a store for the tree.
		var choices = this.binding.getItem().getChoices();
		//Prepare the value2choice index.
		this._value2choice = {};
		dojo.forEach(choices, function(choice) {
			this._value2choice[choice.value] = choice;
		}, this);

		var itemsArray = dojo.map(choices, function(choice) {
			//Only copy over label, description, top, children and selectable to be on the safe side.
			var obj = {value: choice.value};
			if (choice.label) {
				obj.label = rforms.template.getLocalizedValue(choice.label).value;				
			}
			if (choice.description) {
				obj.description = rforms.template.getLocalizedValue(choice.description).value;				
			}
			if (choice.top === true) {
				obj.top = true;
			}
			if (choice.children != null) {
				obj.children = dojo.clone(choice.children);
			}
			if (choice.selectable === false) {
				obj.selectable = false;				
			}
			return obj;
		});

		this._store = new rforms.view.SortedStore({
			sortBy: "label",
			data: {
				identifier: "value",
				label: "label",
				items: itemsArray
			}
		});
		
		//Init the tree
		var tree = new dijit.Tree({store: this._store,
						childrenAttr: ["children"], 
						query: {top: true}, 
						onClick: dojo.hitch(this, function(item) {
							var v = this._store.getValue(item,"value")
							var c = this._value2choice[v];
							this._selectChoice(c);
						}),
						getLabelClass: dojo.hitch(this, function(item) {
							if(item == null) {
								return "";
							}
							var choice = this.binding.getChoice();
							if(this._store.getValue(item, "selectable") === false) {
								return "notselectable";
							} if (choice != null && choice.value === this._store.getValue(item, "value")) {
								return "currentselection";
							}
							return "default";
						})}, this.selectionNode);
		tree.startup();
		this.bc.startup();
	}
});