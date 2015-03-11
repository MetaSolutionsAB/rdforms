/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang", 
	"dojo/_base/array",
    "dojo/on",
    "dojo/dom-class",
	"dojo/dom-construct", 
	"dojo/dom-attr",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "rdforms/apps/components/About", //In template
    "rdforms/apps/validator/validate",
    "rdforms/apps/components/RDFEdit"/*NMD:Ignore*/, //In template
    "rdforms/apps/validator/InstanceReport",
    "rdforms/apps/components/Config",
	"dojo/text!./ValidatorTemplate.html"
], function(declare, lang, array, on, domClass, domConstruct, domAttr, _WidgetBase, _TemplatedMixin,
            _WidgetsInTemplateMixin, About, validate, RDFEdit, InstanceReport, Config, template) {

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

            for (var cls in this.config.type2template) if (this.config.type2template.hasOwnProperty(cls)) {
                this.config.type2template[cls] = this.config.itemStore.getTemplate(this.config.type2template[cls]);
            }
            this._requireLocale(lang.hitch(this, function() {
                this._RDFValidation(this._rdfDijit.setRDF(this.config.rdf));
                this._templateBasedValidation();
                this._rdfDijit.startup();
                this._rdfDijit.resize();
            }));
        },
        //===================================================
        // Private methods
        //===================================================
        _update: function () {
            this._RDFValidation(this._rdfDijit.getRDF());
            this._templateBasedValidation();
        },
        _requireLocale: function(callback) {
            require(["dojo/i18n!rdforms/apps/nls/validator"], lang.hitch(this, function(validator) {
                this.messages = validator;
                this._about.localize(lang.mixin({}, validator, this.config));
                domAttr.set(this._headerNode, "innerHTML", this.config.header || validator.header);
                domAttr.set(this._validateNode, "innerHTML", validator.validate);
                callback();
            }));
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
                domAttr.set(this._rdfValidationMessage, "innerHTML", this.messages.validRDF + report.format);
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
                domAttr.set(this._mandatoryErrorMessage, "innerHTML", this.messages.mandatoryMissing + report.mandatoryError.join(", "));
            } else {
                domClass.toggle(this._mandatoryErrorMessage, "alert-success", true);
                domClass.toggle(this._mandatoryErrorMessage, "alert-danger", false);
                domAttr.set(this._mandatoryErrorMessage, "innerHTML", this.messages.mandatoryOk);
            }
            for (var key in type2resourceReports) if (type2resourceReports.hasOwnProperty(key)) {
                domConstruct.create("h3", {"class": "instanceType", innerHTML: this.messages.instancesHeader + key}, this._rformsNode);
                array.forEach(type2resourceReports[key], function (resourceReport) {
                    new InstanceReport({messages: this.messages, report: resourceReport, graph: this._graph, template: this.config.type2template[key]},
                        domConstruct.create("div", {"class": "instance"}, this._rformsNode));
                }, this);
            }
        }
    });
});