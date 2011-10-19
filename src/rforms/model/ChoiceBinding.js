/*global dojo, rforms*/
dojo.provide("rforms.model.ChoiceBinding");
dojo.require("rforms.model.ValueBinding");

/**
 * A ValueBinding that only accepts uris from a controlled vocabulary encoded as choices.
 * @see rforms.template.Choice#getChoices
 */	
dojo.declare("rforms.model.ChoiceBinding", rforms.model.ValueBinding, {
	//===================================================
	// Private attributes
	//===================================================
	_choice: null,

	//===================================================
	// Public API
	//===================================================
	setChoice: function(choice) {
		this._choice = choice;
		if (choice == null) {
			this.setValue(null);
		} else if (this.getValue() != choice.value) {
			this.setValue(choice.value);
		}
	},
	getChoice: function() {
		return this._choice;
	},
	
	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(args) {
		this._choice = args.choice;
	},
	remove: function() {
		this.setValue(null);
		//Removed line below as it is also done in superclass
		//and therefore causes an error
		//this._parent.removeChildBinding(this);
		this.inherited("remove", arguments);
	}
});