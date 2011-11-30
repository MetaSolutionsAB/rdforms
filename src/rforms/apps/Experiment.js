dojo.provide("rforms.apps.Experiment");
dojo.require("rforms.template.ItemStore");		
dojo.require("rdfjson.Graph");
dojo.require("rforms.model.Engine");
dojo.require("rforms.view.Editor");
dojo.require("rforms.view.Presenter");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.SimpleTextarea");
dojo.require("dijit._Templated");
dojo.require("dijit.layout._LayoutWidget");

dojo.declare("rforms.apps.Experiment", [dijit._Widget, dijit.layout._LayoutWidget, dijit._Templated], {
	//===================================================
	// Inherited attributes
	//===================================================
	templateObj: "",
	graphObj: "",
	itemStore: null,

	//===================================================
	// Inherited attributes
	//===================================================
	templateString: "<div><div dojoType='dijit.layout.TabContainer' dojoAttachPoint='_tabContainer' style='height: 100%'>"+
			"<div dojoType='dijit.layout.ContentPane' title='Editor' selected='true' dojoAttachPoint='_editorTab'></div>"+
			"<div dojoType='dijit.layout.ContentPane' title='Presenter' dojoAttachPoint='_presenterTab'></div>"+
			"<div dojoType='dijit.layout.ContentPane' title='Template' dojoAttachPoint='_templateTab'><div dojoType='dijit.form.SimpleTextarea' dojoAttachPoint='_templateView' style='padding: 0px; margin: 0px;height: 100%; width: 100%; overflow:auto;'></div></div>"+
			"<div dojoType='dijit.layout.ContentPane' title='RDF data' dojoAttachPoint='_rdfTab'><div dojoType='dijit.form.SimpleTextarea' dojoAttachPoint='_rdfView' style='padding: 0px; margin: 0px;height: 100%; width: 100%; overflow:auto;'></div></div>"+
		"</div></div>",
	widgetsInTemplate: true,

	
	//===================================================
	// Inherited methods
	//===================================================
	startup: function() {
		this.inherited("startup", arguments);
		this._itemStore = this.itemStore || new rforms.template.ItemStore();
		this._templateView.set("value", dojo.toJson(this.templateObj, 1));
		this._template = this._itemStore.createTemplate(this.templateObj);
		this._templateInvalid = false;
		if (this.hideTemplate) {
			this._tabContainer.removeChild(this._templateTab);
		}
		
		this._graph = new rdfjson.Graph(this.graphObj);
		this._graphInvalid = false;
		
		dojo.connect(this._tabContainer, "selectChild", this, this._selectChild);
		this._initEditor();
	},
	resize: function( ){
		this.inherited("resize", arguments);
		if (this._tabContainer) {
			this._tabContainer.resize();			
		}
	},
	//===================================================
	// Private methods
	//===================================================	
	_selectChild: function(child) {
		this._updateGraph();
		this._updateTemplate();
		if(child === this._rdfTab) {
			this._initRDF();
			this._graphInvalid = true;
		} else if(child === this._templateTab) {
			this._templateInvalid = true;
		} else if (child === this._editorTab) {
			this._initEditor();
		} else if (child === this._presenterTab) {
			this._initPresenter();
		}
	},
	_updateTemplate: function() {
		if (this._templateInvalid) {
			try {
				this._template = this._itemStore.createTemplate(dojo.fromJson(this._templateView.get("value")));
				this._templateInvalid = false;
			} catch (e) {
				alert("Error in template.");
			}
		}
	},
	_updateGraph: function() {
		if (this._graphInvalid) {
			try {
				this._graph = new rdfjson.Graph(dojo.fromJson(this._rdfView.get("value")));
				this._graphInvalid = false;
			} catch (e) {
				alert("Error in rdf.");
				return;
			}
		}
	},
	_initEditor: function() {
		this._binding = rforms.model.match(this._graph, "http://example.org/about", this._template);
		var node = dojo.create("div");
		this._editorTab.set("content", node);
		new rforms.view.Editor({template: this._template, binding: this._binding, includeLevel: "optional"}, node);
	},
		
	_initPresenter: function() {
		this._binding = rforms.model.match(this._graph, "http://example.org/about", this._template);
		var node = dojo.create("div");
		this._presenterTab.set("content", node);
		new rforms.view.Presenter({template: this._template, binding: this._binding}, node);
	},
		
	_initRDF: function() {
		this._rdfView.set("value", dojo.toJson(this._graph.exportRDFJSON(), 1));
	}
});