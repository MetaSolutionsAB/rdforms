/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang", 
	"dojo/_base/array",
	"dojo/window",
	"dojo/json",
	"dojo/dom-class", 
	"dojo/dom-construct", 
	"dojo/dom-attr",
	"dojo/dom-style",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "dijit/TitlePane",
    "dijit/form/SimpleTextarea",
    "dijit/form/Button",
	"dijit/Dialog",
	"rdfjson/Graph",
	"../model/Engine",
	"../template/ItemStore",
	"../view/ValidationPresenter",
	"dojo/text!./ValidatorTemplate.html"
], function(declare, lang, array, window, json, domClass, construct, attr, style, _WidgetBase,
            _TemplatedMixin, _WidgetsInTemplateMixin, TitlePane, SimpleTextarea, Button, Dialog, Graph,
            Engine, ItemStore, ValidationPresenter, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
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
	templateString: template,
	
	//===================================================
	// Inherited methods
	//===================================================
	postCreate: function() {
	    this.inherited("postCreate", arguments);
	    this.itemStore = this.itemStore || new ItemStore();
	    if (typeof this.rdfjson === "string") {
		this._rdfjsonDijit.set("value", this.rdfjson);			
	    } else {
		this._rdfjsonDijit.set("value", json.stringify(this.rdfjson, true, "  "));			
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
		this._rdfjsonObj = json.parse(this._rdfjsonDijit.get("value"));
		domClass.toggle(this._jsonNode, "error", false);
		attr.set(this._jsonNode, "innerHTML", "RDF input: Valid JSON");
	    } catch (e) {
		domClass.toggle(this._jsonNode, "error", true);
		attr.set(this._jsonNode, "innerHTML", "RDF input: Invalid JSON: "+e);
	    }
	},
	_validateRDFJSON: function() {
	    delete this._graph;
	    attr.set(this._rdfjsonNode, "innerHTML", "");
	    domClass.toggle(this._rdfjsonNode, "error", false);
	    if (this._rdfjsonObj == null) {
		return;
	    }
	    try {
		this._graph = new Graph(this._rdfjsonObj, false);
		this._graph.validate();
		construct.create("div", {"innerHTML": "RDF input: Valid RDF/JSON, "+this._graph.report.nr+" statements found."}, this._rdfjsonNode);
		//checkInstances(graph, "http://xmlns.com/foaf/0.1/Document", ttemplate);
	    } catch (e) {
		domClass.toggle(this._rdfjsonNode, "error", true);
		construct.create("div", {"innerHTML": "RDF input: Invalid RDF/JSON, although "+e.nr+" valid statements found."}, this._rdfjsonNode);
		this._explainInvalidRDFJSON(e);
	    }
	},
	_explainInvalidRDFJSON: function(report) {
	    var table = construct.create("table", {"class": "report"}, this._rdfjsonNode);
	    var head = construct.create("tr", null, table);
	    construct.create("th", {innerHTML: "Subject"}, head);
	    construct.create("th", {innerHTML: "Predicate"}, head);
	    construct.create("th", {innerHTML: "ObjectNr"}, head);
	    construct.create("th", {innerHTML: "Error"}, head);
	    array.forEach(report.errors, function(err) {
		var row = construct.create("tr", null, table);
		construct.create("td", {innerHTML: err.s}, row);
		construct.create("td", {innerHTML: err.p || ""}, row);
		construct.create("td", {innerHTML: ""+ (err.oindex || "")}, row);
		construct.create("td", {innerHTML: err.message}, row);
	    });		
	},
	_validateRForms: function() {
	    attr.set(this._rformsNode, "innerHTML", "");
	    domClass.toggle(this._rformsNode, "error", false);
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
		construct.create("div", {"class": "instanceType", innerHTML: type}, this._rformsNode);			
	    }
	    array.forEach(instances, function(instance) {
		var iNode = construct.create("div", {"class": "instance"}, this._rformsNode);
		var binding = Engine.match(this._graph, instance.getSubject(), template);
		var report = binding.report();
		if (report.errors.length > 0 || report.warnings.length > 0) {
		    if (report.errors.length > 0) {
			domClass.add(iNode, "error");
		    } else {
			domClass.add(iNode, "warning");
		    }
		    construct.create("div", {"class": "instanceHeading", "innerHTML": "<span class='action info'></span>&nbsp;<b>"+instance.getSubject()+"</b> is not ok:",
					     onclick: lang.hitch(this, this._openView, binding, template)}, iNode);
		    var table = construct.create("table", {"class": "report"}, iNode);
		    var head = construct.create("tr", null, table);
		    construct.create("th", {innerHTML: "Severity"}, head);
		    construct.create("th", {innerHTML: "Subject"}, head);
		    construct.create("th", {innerHTML: "Predicate"}, head);
		    construct.create("th", {innerHTML: "Problem"}, head);
		    array.forEach(report.errors, function(err) {
			var row = construct.create("tr", {"class": "error"}, table);
			construct.create("td", {innerHTML: "Error"}, row);
			construct.create("td", {innerHTML: err.parentBinding.getChildrenRootUri()}, row);
			construct.create("td", {innerHTML: err.item.getProperty()}, row);
			construct.create("td", {innerHTML: err.message}, row);
		    });
		    array.forEach(report.warnings, function(warn) {
			var row = construct.create("tr", {"class": "warning"}, table);
			construct.create("td", {innerHTML: "Warning"}, row);
			construct.create("td", {innerHTML: warn.parentBinding.getChildrenRootUri()}, row);
			construct.create("td", {innerHTML: warn.item.getProperty()}, row);
			construct.create("td", {innerHTML: warn.message}, row);
		    });							
		} else {
		    construct.create("div", {"class": "instanceHeading", "innerHTML": "<span class='action info'></span>&nbsp;<b>"+instance.getSubject()+"</b> is ok ", 
					     onclick: lang.hitch(this, this._openView, binding, template)}, iNode);
		}
	    }, this);
	},
	_openView: function(binding, template) {
	    var node = construct.create("div");
	    var dialog = new Dialog({"content": node});
	    var presenter = new ValidationPresenter({template: template, binding: binding, includeLevel: "recommended", compact: true}, node);
	    var viewport = window.getBox();
	    style.set(presenter.domNode, {
		width: Math.floor(viewport.w * 0.70)+"px",
                height: Math.floor(viewport.h * 0.70)+"px",
                overflow: "auto",
                position: "relative"    // workaround IE bug moving scrollbar or dragging dialog
	    });
	    dialog.show();
	}
    });
});