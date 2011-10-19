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

dojo.provide("rforms.view.Chooser");
dojo.require("dijit._Templated");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.form.Button");
dojo.require("dijit.Tree");
dojo.require("rforms.view.SortedStore");

dojo.declare("rforms.view.Chooser", [dijit.layout._LayoutWidget, dijit._Templated], {
	templatePath: dojo.moduleUrl("rforms.view", "ChooserTemplate.html"),
	widgetsInTemplate: true,
	binding: null,

	//===================================================
	// Public API
	//===================================================
	show: function() {
		this._selectChoice(this.binding.getChoice());
		var viewport = dijit.getViewport();
		dojo.style(this.bc.domNode, {
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
			dojo.attr(this.uriNode, "innerHTML", "");
			dojo.attr(this.labelNode, "innerHTML", "");
			dojo.attr(this.descriptionNode, "innerHTML", "");			
		} else {
			this.selected = choice;
			dojo.attr(this.uriNode, "innerHTML", this.selected.value);
			dojo.attr(this.labelNode, "innerHTML", rforms.template.getLocalizedValue(choice.label).value || "(No label given.)");
			dojo.attr(this.descriptionNode, "innerHTML", rforms.template.getLocalizedValue(choice.description).value || "");
			if (choice.selectable !== false && (this.binding.getChoice() == null || this.binding.getChoice().value !== this.selected.value)) {
				this.doneButton.set("disabled", false);
			} else {
				this.doneButton.set("disabled", true);
			}
		}
	}
});