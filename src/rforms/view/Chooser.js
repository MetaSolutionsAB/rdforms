/*global define*/
define(["dojo/_base/declare", 
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/window",
	"dijit/layout/_LayoutWidget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/Dialog", //Used in template
	"dijit/form/Button", //Used in template
	"dijit/layout/ContentPane", //Used in template
	"dijit/layout/BorderContainer", //Used in template
	"./SortedStore",
	"dojo/text!./ChooserTemplate.html"
], function(declare, attr, style, window, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, Dialog, Button, ContentPane, BorderContainer, SortedStore, template) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
	templateString: template,
	binding: null,

	//===================================================
	// Public API
	//===================================================
	show: function() {
	    this._selectChoice(this.binding.getChoice());
	    var viewport = window.getBox();
	    style.set(this.bc.domNode, {
                width: Math.floor(viewport.w * 0.70)+"px",
                height: Math.floor(viewport.h * 0.70)+"px",
                overflow: "auto",
                position: "relative"    // workaround IE bug moving scrollbar or dragging dialog
            });
	    this.bc.resize();
	    this.dialog.show();
	},

	//===================================================
	// Public hooks
	//===================================================
	done: function() {
	},	
	
	//===================================================
	// Private methods
	//===================================================
	_cancelClicked: function() {
	    this.dialog.hide();
	},
	_doneClicked: function() {
	    this.binding.setChoice(this.selected);
	    this.dialog.hide();
	    this.done(this.selected);
	},

	_selectChoice: function(choice) {
	    if (choice == null) {
		delete this.selected;
		attr.set(this.uriNode, "innerHTML", "");
		attr.set(this.labelNode, "innerHTML", "");
		attr.set(this.descriptionNode, "innerHTML", "");			
	    } else {
		this.selected = choice;
		attr.set(this.uriNode, "innerHTML", this.selected.value);
		attr.set(this.labelNode, "innerHTML", rforms.template.getLocalizedValue(choice.label).value || "(No label given.)");
		attr.set(this.descriptionNode, "innerHTML", rforms.template.getLocalizedValue(choice.description).value || "");
		if (choice.selectable !== false && (this.binding.getChoice() == null || this.binding.getChoice().value !== this.selected.value)) {
		    this.doneButton.set("disabled", false);
		} else {
		    this.doneButton.set("disabled", true);
		}
	    }
	}
    });
});