/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang", 
	"dojo/_base/array",
    "dojo/dom-class",
	"dojo/dom-construct", 
	"dojo/dom-attr",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "rdforms/apps/validator/validate",
    "rdforms/apps/components/RDFEdit"/*NMD:Ignore*/, //In template
    "rdforms/apps/validator/InstanceReport",
    "rdforms/apps/components/Config",
	"dojo/text!./ValidatorTemplate.html"
], function(declare, lang, array, domClass, domConstruct, domAttr, _WidgetBase, _TemplatedMixin,
            _WidgetsInTemplateMixin, validate, RDFEdit, InstanceReport, Config, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Config.Cls], {
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
        postConfig: function () {
            this.inherited("postConfig", arguments);
            domAttr.set(this._headerNode, "innerHTML", this.header || "RDForms Validator");
            for (var cls in this.config.type2template) if (this.config.type2template.hasOwnProperty(cls)) {
                this.config.type2template[cls] = this.config.itemStore.getTemplate(this.config.type2template[cls]);
            }
            this._RDFValidation(this._rdfDijit.setRDF(this.config.rdf));
            this._templateBasedValidation();
            this._rdfDijit.startup();
            this._rdfDijit.resize();
        },
        //===================================================
        // Private methods
        //===================================================
        _update: function () {
            this._RDFValidation(this._rdfDijit.getRDF());
            this._templateBasedValidation();
        },
        _RDFValidation: function (report) {
            this._rdfReport = report;
            this._graph = report.graph;
            if (report.error) {
                domClass.toggle(this._rdfValidationMessage, "alert-danger", true);
                domClass.toggle(this._rdfValidationMessage, "alert-success", false);
                domAttr.set(this._rdfValidationMessage, "innerHTML", report.error);
            } else {
                domClass.toggle(this._rdfValidationMessage, "alert-success", true);
                domClass.toggle(this._rdfValidationMessage, "alert-danger", false);
                domAttr.set(this._rdfValidationMessage, "innerHTML", "Valid RDF in format " + report.format);
            }
        },
        _templateBasedValidation: function () {
            domAttr.set(this._rformsNode, "innerHTML", "");
            if (this._rdfReport.error) {
                return;
            }
            var report = this._validateReport = validate.generateReport(this._graph, this.config.type2template, this.config.mandatoryTypes);
            var type2resourceReports = validate.sortResourceReportsByType(report.resources);
            if (report.mandatoryError) {
                domClass.toggle(this._mandatoryErrorMessage, "alert-danger", true);
                domClass.toggle(this._mandatoryErrorMessage, "alert-success", false);
                domAttr.set(this._mandatoryErrorMessage, "innerHTML", "Instances missing for the following top-level mandatory classes: " + report.mandatoryError.join(", "));
            } else {
                domClass.toggle(this._mandatoryErrorMessage, "alert-success", true);
                domClass.toggle(this._mandatoryErrorMessage, "alert-danger", false);
                domAttr.set(this._mandatoryErrorMessage, "innerHTML", "Instances found for all top-level mandatory classes");
            }
            for (var key in type2resourceReports) if (type2resourceReports.hasOwnProperty(key)) {
                domConstruct.create("h3", {"class": "instanceType", innerHTML: "Instances of class " + key}, this._rformsNode);
                array.forEach(type2resourceReports[key], function (resourceReport) {
                    new InstanceReport({report: resourceReport, graph: this._graph, template: this.config.type2template[key]},
                        domConstruct.create("div", {"class": "instance"}, this._rformsNode));
                }, this);
            }
        }
    });
});