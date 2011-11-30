dojo.provide("rforms.apps.Validator");
dojo.require("rforms.template.ItemStore");
dojo.require("rforms.view.ValidationPresenter");
dojo.require("rdfjson.Graph");
dojo.require("rforms.model.Engine");
dojo.require("rforms.view.Editor");
dojo.require("rforms.view.Presenter");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.SimpleTextarea");
dojo.require("dijit.TitlePane");
dojo.require("dijit._Templated");

dojo.declare("rforms.apps.Validator", [dijit._Widget, dijit._Templated], {
	//===================================================
	// Public attributes
	//===================================================
	itemStore: null,
	type2template: null,
	rdfjson: null,
	rdfjsonEditorOpen: false,
	
	//===================================================
	// Inherited attributes
	//===================================================
	templateString: "<div class='validator'>" +
			"<div dojoType='dijit.TitlePane' title='RDF/JSON source' open='${rdfjsonEditorOpen}'>" +
				"<div dojoType='dijit.form.SimpleTextarea' dojoAttachPoint='_rdfjsonDijit' style='width:100%;height:200px'></div>" +
				"<div dojoType='dijit.form.Button' label='Update' dojoAttachEvent='onClick:_update'></div>" +
			"</div>" +
			"<div class='json' dojoAttachPoint='_jsonNode'></div>" +
			"<div class='rdfjson' dojoAttachPoint='_rdfjsonNode'></div>" +
			"<div class='rforms' dojoAttachPoint='_rformsNode'></div>" +
			"</div>",
	widgetsInTemplate: true,

	
	//===================================================
	// Inherited methods
	//===================================================
	postCreate: function() {
		this.inherited("postCreate", arguments);
		this.itemStore = this.itemStore || new rforms.template.ItemStore();
		if (dojo.isString(this.rdfjson)) {
			this._rdfjsonDijit.set("value", this.rdfjson);			
		} else {
			this._rdfjsonDijit.set("value", dojo.toJson(this.rdfjson, 1));			
		}
		this._update();
	},
	//===================================================
	// Private methods
	//===================================================
	_update: function() {
		this._validateJSON();
		this._validateRDFJSON();
		this._validateRForms();		
	},
	_validateJSON: function() {
		delete this._rdfjsonObj;
		try {
			this._rdfjsonObj = dojo.fromJson(this._rdfjsonDijit.get("value"));
			dojo.toggleClass(this._jsonNode, "error", false);
			dojo.attr(this._jsonNode, "innerHTML", "Valid JSON");
		} catch (e) {
			dojo.toggleClass(this._jsonNode, "error", true);
			dojo.attr(this._jsonNode, "innerHTML", "Invalid JSON: "+e);
		}
	},
	_validateRDFJSON: function() {
		delete this._graph;
		dojo.attr(this._rdfjsonNode, "innerHTML", "");
		dojo.toggleClass(this._rdfjsonNode, "error", false);
		if (this._rdfjsonObj == null) {
			return;
		}
		try {
			this._graph = new rdfjson.Graph(this._rdfjsonObj, false);
			this._graph.validate();
			dojo.create("div", {"innerHTML": "Valid RDF/JSON, "+this._graph.report.nr+" statements found."}, this._rdfjsonNode);
			//checkInstances(graph, "http://xmlns.com/foaf/0.1/Document", ttemplate);
		} catch (e) {
			dojo.toggleClass(this._rdfjsonNode, "error", true);
			dojo.create("div", {"innerHTML": "Invalid RDF/JSON, although "+e.nr+" valid statements found."}, this._rdfjsonNode);
			this._explainInvalidRDFJSON(e);
		}
	},
	_explainInvalidRDFJSON: function(report) {
		var table = dojo.create("table", {"class": "report"}, this._rdfjsonNode);
		var head = dojo.create("tr", null, table);
		dojo.create("th", {innerHTML: "Subject"}, head);
		dojo.create("th", {innerHTML: "Predicate"}, head);
		dojo.create("th", {innerHTML: "ObjectNr"}, head);
		dojo.create("th", {innerHTML: "Error"}, head);
		dojo.forEach(report.errors, function(err) {
			var row = dojo.create("tr", null, table);
			dojo.create("td", {innerHTML: err.s}, row);
			dojo.create("td", {innerHTML: err.p || ""}, row);
			dojo.create("td", {innerHTML: ""+ (err.oindex || "")}, row);
			dojo.create("td", {innerHTML: err.message}, row);
		});		
	},
	_validateRForms: function() {
		dojo.attr(this._rformsNode, "innerHTML", "");
		dojo.toggleClass(this._rformsNode, "error", false);
		if (this._graph == null) {
			return;
		}
		for (var key in this.type2template) {
			if (this.type2template.hasOwnProperty(key)) {
				this._checkInstances(key, this.type2template[key]);
			}
		}
	},
	_checkInstances: function(type, templateId) {
		var template = this.itemStore.getTemplate(templateId);
		var instances = this._graph.find(null, "http://www.w3.org/TR/rdf-schema/type", type);
		if (instances.length > 0) {
			dojo.create("div", {"class": "instanceType", innerHTML: type}, this._rformsNode);			
		}
		dojo.forEach(instances, function(instance) {
			var iNode = dojo.create("div", {"class": "instance"}, this._rformsNode);
			var binding = rforms.model.match(this._graph, instance.getSubject(), template);
			var report = binding.report();
			if (report.errors.length > 0 || report.warnings.length > 0) {
				if (report.errors.length > 0) {
					dojo.addClass(iNode, "error");
				} else {
					dojo.addClass(iNode, "warning");
				}
				dojo.create("div", {"class": "instanceHeading", "innerHTML": "<span class='action info'></span>&nbsp;<b>"+instance.getSubject()+"</b> is not ok:",
					onclick: dojo.hitch(this, this._openView, binding, template)}, iNode);
				var table = dojo.create("table", {"class": "report"}, iNode);
				var head = dojo.create("tr", null, table);
				dojo.create("th", {innerHTML: "Severity"}, head);
				dojo.create("th", {innerHTML: "Subject"}, head);
				dojo.create("th", {innerHTML: "Predicate"}, head);
				dojo.create("th", {innerHTML: "Problem"}, head);
				dojo.forEach(report.errors, function(err) {
					var row = dojo.create("tr", {"class": "error"}, table);
					dojo.create("td", {innerHTML: "Error"}, row);
					dojo.create("td", {innerHTML: err.s}, row);
					dojo.create("td", {innerHTML: err.p}, row);
					dojo.create("td", {innerHTML: err.message}, row);
				});
				dojo.forEach(report.warnings, function(err) {
					var row = dojo.create("tr", {"class": "warning"}, table);
					dojo.create("td", {innerHTML: "Warning"}, row);
					dojo.create("td", {innerHTML: err.s}, row);
					dojo.create("td", {innerHTML: err.p}, row);
					dojo.create("td", {innerHTML: err.message}, row);
				});							
			} else {
				dojo.create("div", {"class": "instanceHeading", "innerHTML": "<span class='action info'></span>&nbsp;<b>"+instance.getSubject()+"</b> is ok ", 
					onclick: dojo.hitch(this, this._openView, binding, template)}, iNode);
			}
		}, this);
	},
	_openView: function(binding, template) {
		var node = dojo.create("div");
		var dialog = new dijit.Dialog({"content": node});
		var presenter = new rforms.view.ValidationPresenter({template: template, binding: binding, includeLevel: "recommended", compact: true}, node);
		var viewport = dijit.getViewport();
		dojo.style(presenter.domNode, {
			width: Math.floor(viewport.w * 0.70)+"px",
                                        height: Math.floor(viewport.h * 0.70)+"px",
                                        overflow: "auto",
                                        position: "relative"    // workaround IE bug moving scrollbar or dragging dialog
				});
		dialog.show();
	}
});