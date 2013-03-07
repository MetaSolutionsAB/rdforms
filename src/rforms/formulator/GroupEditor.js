/*global define*/
define(["dojo/_base/declare",
	"dojo/json",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/TextBox", //For template
	"dijit/form/NumberTextBox", //For template
	"dijit/form/Textarea", //For template
	"dojo/text!./GroupEditorTemplate.html"
], function(declare, json, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, TextBox, NumberTextBox, Textarea, template) {


    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
	//===================================================
	// Public attributes
	//===================================================
	itemStore: null,
	
	//===================================================
	// Inherited attributes
	//===================================================
	templateString: template,
	
	//===================================================
	// Inherited methods
	//===================================================
	postCreate: function() {
	    this.inherited("postCreate", arguments);
	    this._idDijit.set("value", this.item.getId() || "");
	    this._typeDijit.set("value", this.item.getType() || "");
	    this._extendsDijit.set("value", this.item.getExtends() || "");
	    this._propDijit.set("value", this.item.getProperty() || "");
	    this._ntDijit.set("value", this.item.getNodetype() || "");
	    this._dtDijit.set("value", this.item.getDatatype() || "");
	    this._labelDijit.set("value", this.item.getLabel() || "");
	    this._descDijit.set("value", this.item.getDescription() || "");
	    var card = this.item.getCardinality();
	    this._minDijit.set("value", card.min || "");
	    this._prefDijit.set("value", card.pref || "");
	    this._maxDijit.set("value", card.max || "");
	    this._constrDijit.set("value", json.stringify(this.item.getConstraints() || {}));
	    this._clsDijit.set("value", json.stringify(this.item.getClasses() || {}));
	    this._styDijit.set("value", json.stringify(this.item.getStyles() || {}));
	}
	//===================================================
	// Private methods
	//===================================================
	
    });
});