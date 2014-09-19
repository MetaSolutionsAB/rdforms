/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang",
    "dojo/topic",
	"dojo/json",
    "dojo/dom-attr",
    "dojo/dom-class",
	"dijit/layout/_LayoutWidget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "dijit/layout/TabContainer",
	"rdfjson/Graph",
    "rdfjson/formats/converters",
	"dojo/text!./RDFViewTemplate.html"
], function(declare, lang, topic, json, domAttr, domClass, _LayoutWidget,  _TemplatedMixin, _WidgetsInTemplateMixin,
            TabContainer, Graph, converters, template) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        //===================================================
        // Public attributes
        //===================================================
        graph: null,
        subView: "rdf/xml",

        //===================================================
        // Public methods
        //===================================================
        setGraph: function(graph) {
            this.graph = graph;
            switch(this.subView) {
                case "rdf/xml":
                    this.showRDFXML();
                    break;
                case "rdf/json":
                    this.showRDFJSON();
                    break;
            }
        },

        //===================================================
        // Inherited attributes
        //===================================================
        templateString: template,

        //===================================================
        // Inherited methods
        //===================================================
        postCreate: function() {
            this.inherited("postCreate", arguments);
            this._tabContainer.set("doLayout", this.doLayout);
            if (this.doLayout) {
                domClass.add(this.domNode, "managedHeight");
            }
        },
        startup: function() {
            this.inherited("startup", arguments);
            topic.subscribe(this._tabContainer.id+"-selectChild", lang.hitch(this, this._selectChild));
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
        showRDFXML: function() {
            var rdfxmlValue = converters.rdfjson2rdfxml(this.graph);
            if (rdfxmlValue.length > 100000) {
                rdfxmlValue = rdfxmlValue.substring(0, 100000) + "\n    ----- \n RDF to large, truncating it. \n   ------";
            }
            rdfxmlValue = rdfxmlValue.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/[\r\n]/, "<br>");
            domAttr.set(this._rdfxml, "innerHTML", rdfxmlValue);
        },
        showRDFJSON: function() {
            var rdfjsonValue = json.stringify(this.graph.exportRDFJSON(), 0, 2);
            if (rdfjsonValue.length > 100000) {
                rdfjsonValue = rdfjsonValue.substring(0,100000)+ "\n    ----- \n RDF to large, truncating it. \n   ------";
            }
            rdfjsonValue = rdfjsonValue.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;')
            domAttr.set(this._rdfjson, "innerHTML", rdfjsonValue);
        },

        _selectChild: function(child) {
            if(child === this._rdfxmlTab) {
                this.subView = "rdf/xml";
                this.showRDFXML();
            } else if(child === this._rdfjsonTab) {
                this.subView = "rdf/json";
                this.showRDFJSON();
            }
        }
    });
});