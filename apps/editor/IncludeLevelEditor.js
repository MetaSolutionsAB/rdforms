/*global define*/
define(["dojo/_base/declare", 
	"dojo/dom-class",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "rdforms/view/Editor", //in template
	"dojo/text!./IncludeLevelEditorTemplate.html"
], function(declare, domClass, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Editor, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        //===================================================
        // Public methods or attributes
        //===================================================
        template: null,
        resource: null,
        graph: null,
        compact: true,
        includeLevel: "mandatory",

        show: function(resource, graph, template) {
            this.resource = resource || this.resource;
            this.graph = graph || this.graph;
            this.template = template || this.template;
            this._rdformsDijit.show({resource: this.resource, graph: this.graph, template: this.template, includeLevel: this.includeLevel});
        },
        setIncludeLevel: function(includeLevel) {
            if (this._rdformsDijit.getIncludeLevel() === includeLevel) {
                return;
            }
            this.includeLevel = includeLevel;
            switch (includeLevel) {
                case "mandatory":
                    this._mandatoryClick();
                    break;
                case "recommended":
                    this._recommendedClick();
                    break;
                case "optional":
                    this._optionalClick();
            }
        },

        //===================================================
        // Inherited or private methods or attributes
        //===================================================
        templateString: template,

        postCreate: function () {
            this.inherited("postCreate", arguments);
            this.show();
        },

        _mandatoryClick: function() {
            domClass.add(this._mandatoryLabel, "active");
            domClass.remove(this._recommendedLabel, "active");
            domClass.add(this._recommendedLabel, "btn-default");
            domClass.remove(this._recommendedLabel, "btn-success");
            domClass.remove(this._optionalLabel, "active");
            domClass.add(this._optionalLabel, "btn-default");
            domClass.remove(this._optionalLabel, "btn-success");
            this._updateEditor("mandatory");
        },
        _recommendedClick: function() {
            domClass.add(this._mandatoryLabel, "active");
            domClass.add(this._recommendedLabel, "active");
            domClass.add(this._recommendedLabel, "btn-success");
            domClass.remove(this._recommendedLabel, "btn-default");
            domClass.remove(this._optionalLabel, "active");
            domClass.add(this._optionalLabel, "btn-default");
            domClass.remove(this._optionalLabel, "btn-success");
            this._updateEditor("recommended");
        },
        _optionalClick: function() {
            domClass.add(this._mandatoryLabel, "active");
            domClass.add(this._recommendedLabel, "active");
            domClass.add(this._recommendedLabel, "btn-success");
            domClass.remove(this._recommendedLabel, "btn-default");
            domClass.add(this._optionalLabel, "active");
            domClass.add(this._optionalLabel, "btn-success");
            domClass.remove(this._optionalLabel, "btn-default");
            this._updateEditor("optional");
        },
        _updateEditor: function(includeLevel) {
            this._rdformsDijit.setIncludeLevel(includeLevel);
        }
    });
});