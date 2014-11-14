/*global define*/
define(["dojo/_base/declare", 
	"dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-attr",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "rdforms/view/Editor", //in template
	"dojo/text!./IncludeLevelEditorTemplate.html"
], function(declare, domClass, domStyle, domAttr, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Editor, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        //===================================================
        // Public methods or attributes
        //===================================================
        template: null,
        resource: null,
        graph: null,
        compact: true,
        includeLevel: "mandatory",
        includeLevelControllsVisible: true,
        messages: null,

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
        localize: function(messages) {
            this.messages = messages;
            domAttr.set(this._mandatoryLabelNode, "innerHTML", this.messages.mandatoryLabel);
            domAttr.set(this._recommendedLabelNode, "innerHTML", this.messages.recommendedLabel);
            domAttr.set(this._optionalLabelNode, "innerHTML", this.messages.optionalLabel);
        },

        //===================================================
        // Inherited or private methods or attributes
        //===================================================
        templateString: template,

        postCreate: function () {
            this.inherited("postCreate", arguments);
            if (this.includeLevelControllsVisible) {
                domStyle.set(this._cardinalityNode, "display", "");
            }
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