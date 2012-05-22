dojo.provide("rforms.formulator.GroupEditor");
dojo.require("dijit._Widget");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.layout.ContentPane");

dojo.declare("rforms.formulator.GroupEditor", [dijit._Widget, dijit._Templated], {
	//===================================================
	// Public attributes
	//===================================================
	itemStore: null,

	//===================================================
	// Inherited attributes
	//===================================================
	templatePath: dojo.moduleUrl("rforms.formulator", "GroupEditorTemplate.html"),
	widgetsInTemplate: true,
	
	//===================================================
	// Inherited methods
	//===================================================
	postCreate: function() {
		this.inherited("postCreate", arguments);
		this._idDijit.set("value", this.item.getId() || "");
		this._propDijit.set("value", this.item.getProperty() || "");
		this._labelDijit.set("value", this.item.getLabel() || "");
		this._descDijit.set("value", this.item.getDescription() || "");
		var card = this.item.getCardinality();
		this._minDijit.set("value", card.min || "");
		this._prefDijit.set("value", card.pref || "");
		this._maxDijit.set("value", card.max || "");
	}
	//===================================================
	// Private methods
	//===================================================
	
});