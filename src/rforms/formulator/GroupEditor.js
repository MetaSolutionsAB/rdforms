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
	}
	//===================================================
	// Private methods
	//===================================================
});