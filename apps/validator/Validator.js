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
	"rdforms/model/Engine",
	"rdforms/template/ItemStore",
	"rdforms/view/ValidationPresenter",
	"dojo/text!./ValidatorTemplate.html"
], function(declare, lang, array, window, json, domClass, domConstruct, domAttr, domStyle, _WidgetBase,
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
		domAttr.set(this._jsonNode, "innerHTML", "RDF input: Valid JSON");
	    } catch (e) {
		domClass.toggle(this._jsonNode, "error", true);
		domAttr.set(this._jsonNode, "innerHTML", "RDF input: Invalid JSON: "+e);
	    }
	},
	_validateRDFJSON: function() {
	    delete this._graph;
	    domAttr.set(this._rdfjsonNode, "innerHTML", "");
	    domClass.toggle(this._rdfjsonNode, "error", false);
	    if (this._rdfjsonObj == null) {
		return;
	    }
	    try {
		this._graph = new Graph(this._rdfjsonObj, false);
		this._graph.validate();
		domConstruct.create("div", {"innerHTML": "RDF input: Valid RDF/JSON, "+this._graph.report.nr+" statements found."}, this._rdfjsonNode);
		//checkInstances(graph, "http://xmlns.com/foaf/0.1/Document", ttemplate);
	    } catch (e) {
		domClass.toggle(this._rdfjsonNode, "error", true);
		domConstruct.create("div", {"innerHTML": "RDF input: Invalid RDF/JSON, although "+e.nr+" valid statements found."}, this._rdfjsonNode);
		this._explainInvalidRDFJSON(e);
	    }
	},
	_explainInvalidRDFJSON: function(report) {
	    var table = domConstruct.create("table", {"class": "report"}, this._rdfjsonNode);
	    var head = domConstruct.create("tr", null, table);
	    domConstruct.create("th", {innerHTML: "Subject"}, head);
	    domConstruct.create("th", {innerHTML: "Predicate"}, head);
	    domConstruct.create("th", {innerHTML: "ObjectNr"}, head);
	    domConstruct.create("th", {innerHTML: "Error"}, head);
	    array.forEach(report.errors, function(err) {
		var row = domConstruct.create("tr", null, table);
		domConstruct.create("td", {innerHTML: err.s}, row);
		domConstruct.create("td", {innerHTML: err.p || ""}, row);
		domConstruct.create("td", {innerHTML: ""+ (err.oindex || "")}, row);
		domConstruct.create("td", {innerHTML: err.message}, row);
	    });		
	},
	_validateRForms: function() {
	    domAttr.set(this._rformsNode, "innerHTML", "");
	    domClass.toggle(this._rformsNode, "error", false);
	    if (this._graph == null) {
            return;
	    }
        this._checkInstances();
	},
    _checkInstances: function() {
        var instances = {}, type2instances = {}, stmts, arr, key;
        for (key in this.type2template) if (this.type2template.hasOwnProperty(key)) {
            stmts = this._graph.find(null, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", key);
            arr = type2instances[key] = [];
            array.forEach(stmts, function(stmt) {
                instances[stmt.getSubject()] = true;
                arr.push(stmt.getSubject());
            });
        }
        for (key in this.type2template) if (this.type2template.hasOwnProperty(key)) {
            if (type2instances[key].length > 0) {
                domConstruct.create("div", {"class": "instanceType", innerHTML: this.type2template[key]}, this._rformsNode);
                var template = this.itemStore.getTemplate(this.type2template[key]);
                array.forEach(type2instances[key], lang.hitch(this, this._renderInstance, instances, template));
            }
        }
    },
	_renderInstance: function(instances, template, instance) {
        var iNode = domConstruct.create("div", {"class": "instance"}, this._rformsNode);
		var binding = Engine.match(this._graph, instance, template);
		var report = binding.report();
        var include = function(issue) {
            var pb = issue.parentBinding;
            while(true) {
                var uri = pb.getChildrenRootUri();
                if (uri == instance) {
                    return true;
                } else if (instances[uri]) {
                    return false;
                }
                pb = pb.getParent();
            }
        };
		if (report.errors.length > 0 || report.warnings.length > 0) {
		    if (report.errors.length > 0) {
                domClass.add(iNode, "error");
		    } else {
                domClass.add(iNode, "warning");
		    }
		    domConstruct.create("div", {"class": "instanceHeading", "innerHTML": "<span class='action info'></span>&nbsp;<b>"+instance+"</b> is not ok:",
					     onclick: lang.hitch(this, this._openView, binding, template)}, iNode);
		    var table = domConstruct.create("table", {"class": "report"}, iNode);
		    var head = domConstruct.create("tr", null, table);
		    domConstruct.create("th", {innerHTML: "Severity"}, head);
		    domConstruct.create("th", {innerHTML: "Subject"}, head);
		    domConstruct.create("th", {innerHTML: "Predicate"}, head);
		    domConstruct.create("th", {innerHTML: "Problem"}, head);
		    array.forEach(report.errors, function(err) {
                if (include(err)) {
                    var row = domConstruct.create("tr", {"class": "error"}, table);
                    domConstruct.create("td", {innerHTML: "Error"}, row);
                    domConstruct.create("td", {innerHTML: err.parentBinding.getChildrenRootUri()}, row);
                    domConstruct.create("td", {innerHTML: err.item.getProperty()}, row);
                    domConstruct.create("td", {innerHTML: err.message}, row);
                }
            });
		    array.forEach(report.warnings, function(warn) {
                if (include(warn)) {
                    var row = domConstruct.create("tr", {"class": "warning"}, table);
                    domConstruct.create("td", {innerHTML: "Warning"}, row);
                    domConstruct.create("td", {innerHTML: warn.parentBinding.getChildrenRootUri()}, row);
                    domConstruct.create("td", {innerHTML: warn.item.getProperty()}, row);
                    domConstruct.create("td", {innerHTML: warn.message}, row);
                }
		    });							
		} else {
		    domConstruct.create("div", {"class": "instanceHeading", "innerHTML": "<span class='action info'></span>&nbsp;<b>"+instance+"</b> is ok ",
					     onclick: lang.hitch(this, this._openView, binding, template)}, iNode);
		}
	},
	_openView: function(binding, template) {
	    var node = domConstruct.create("div");
	    var dialog = new Dialog({"content": node});
	    var presenter = new ValidationPresenter({template: template, binding: binding, includeLevel: "recommended", compact: true}, node);
	    var viewport = window.getBox();
	    domStyle.set(presenter.domNode, {
		width: Math.floor(viewport.w * 0.70)+"px",
                height: Math.floor(viewport.h * 0.70)+"px",
                overflow: "auto",
                position: "relative"    // workaround IE bug moving scrollbar or dragging dialog
	    });
	    dialog.show();
	}
    });
});