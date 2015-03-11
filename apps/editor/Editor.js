/*global define*/
define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/layout/_LayoutWidget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "dijit/Dialog", //in template
    "rdforms/apps/components/About", //In template
    "rdforms/apps/components/Config",
    "rdforms/apps/editor/IncludeLevelEditor", //in template
    "rdforms/view/Presenter", //in template
    "rdforms/apps/components/RDFEdit", //in template
    "rdforms/template/ItemStore",
    "rdfjson/Graph",
	"dojo/text!./EditorTemplate.html"
], function(declare, lang, topic, domAttr, domClass, domStyle, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin,
            Dialog, About, Config, IncludeLevelEditor, Presenter, RDFEdit, ItemStore, Graph, template) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, Config.Cls], {

        //===================================================
        // Public methods or attributes
        //===================================================
        template: null,
        resource: null,
        graph: null,
        itemStore: null,
        includeLevel: "mandatory",
        includeLevelControllsVisible: true,
        aboutButtonVisible: true,

        show: function (resource, rdf, template) {
            this.resource = resource || this.resource;
            this.rdf = rdf || this.rdf;
            this.template = template || this.template;
            this._editor.show(this.resource, this.rdf, this.template);
        },

        //===================================================
        // Inherited or private methods or attributes
        //===================================================
        templateString: template,

        resize: function () {
            this.inherited("resize", arguments);
            if (this._tabContainer) {
                this._tabContainer.resize();
            }
        },

        postConfig: function () {
            this.inherited("postConfig", arguments);
            this.rdf = this.config.rdf;
            this.itemStore = this.config.itemStore;
            this.type2template = this.config.type2template;
            this.mainType = this.config.mainType;
            this.resource = this.resource || this.config.resource;
            if (this.config.includeLevel) {
                this._editor.setIncludeLevel(this.config.includeLevel);
            }
            this.aboutButtonVisible = this.config.aboutButtonVisible || this.aboutButtonVisible;
            if (this.aboutButtonVisible === true) {
                domStyle.set(this._about.domNode, "display", "block");
            }
            this._requireLocale(lang.hitch(this, function() {
                this.template = this.itemStore.getItem(this.type2template[this.mainType]);
                if (this.rdf && this.resource) {
                    this._initEditor();
                } else {
                    this._dialog.show();
                    this._rdfInit.setRDF({"http://example.com/about": {
                        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [
                            {type: "uri", value: this.mainType}
                        ]}});
                    this._rdfInit.startup();
                }
                this.startup();
            }));
        },

        _requireLocale: function(callback) {
            require(["dojo/i18n!rdforms/apps/nls/editor"], lang.hitch(this, function(editor) {
                this.messages = editor;
                this._about.localize(lang.mixin({}, editor, this.config));
                if (this.config.header) {
                    domClass.add(this.domNode, "withHeader");
                    domAttr.set(this._headerNode, "innerHTML", this.config.header || editor.header);
                }
                this._editorTab.set("title", this.messages.editorTab);
                this._presenterTab.set("title", this.messages.presenterTab);
                this._rdfTab.set("title", this.messages.rdfTab);
                this._dialog.set("title", this.messages.initDialogHeader);
                domAttr.set(this._resourceURIHeader, "innerHTML", this.messages.resourceURIHeader);
                this._resourceURI.set("placeholder", this.messages.resourceURIPlaceholder);
                domAttr.set(this._rdfInitHeader, "innerHTML", this.messages.rdfInitHeader);
                domAttr.set(this._startButton, "innerHTML", this.messages.startButton);
                this._editor.localize(editor);
                this.resize();
                callback();
            }));
        },


        startup: function () {
            this.inherited("startup", arguments);
            topic.subscribe(this._tabContainer.id + "-selectChild", lang.hitch(this, this._selectChild));
            this._graphInvalid = false;
        },
        _selectChild: function (child) {
            this._updateGraph();
            if (child === this._rdfTab) {
                this._rdfTab.setGraph(this.rdf);
                this._graphInvalid = true;
            } else if (child === this._editorTab) {
                this._initEditor();
            } else if (child === this._presenterTab) {
                this._initPresenter();
            }
        },
        _updateGraph: function () {
            if (this._graphInvalid) {
                try {
                    this.rdf = this._rdfTab.getGraph();
                    this._graphInvalid = false;
                } catch (e) {
                    alert("Error in rdf.");
                }
            }
        },

        _initEditor: function () {
            this._editor.show(this.resource, this.rdf, this.template);
        },

        _initPresenter: function () {
            this._presenter.show({template: this.template, graph: this.rdf, resource: this.resource});
        },
        _startEditing: function() {
            var failure = lang.hitch(this, function(message) {
                domStyle.set(this._errorMessage, "display", "");
                domAttr.set(this._errorMessage, "innerHTML", message);
            });

            var resourceUri = this._resourceURI.get("value");
            if (resourceUri != null && resourceUri != "") {
                this.resource = resourceUri;
                this.rdf = new Graph();
                this.rdf.create(resourceUri, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", this.mainType);
                this._dialog.hide();
                this._initEditor();
            } else {
                var report = this._rdfInit.getRDF();
                if (report.error) {
                    failure(report.error);
                } else {
                    var stmts = report.graph.find(null, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", {type: "uri", value: this.mainType});
                    if (stmts.length === 0) {
                        failure(this.messages.no_instances);
                    } else if (stmts.length > 1) {
                        failure(this.messages.too_many_instances);
                    } else {
                        this._dialog.hide();
                        this.resource = stmts[0].getSubject();
                        this.rdf = report.graph;
                        this._dialog.hide();
                        this._initEditor();
                    }
                }
            }

        }
    });
});