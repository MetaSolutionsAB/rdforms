/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang",
    "dojo/topic",
	"dojo/json",
    "dojo/dom-attr",
	"dijit/layout/_LayoutWidget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "dijit/layout/TabContainer",
    "dijit/form/SimpleTextarea",
	"rdfjson/Graph",
    "rdfjson/formats/converters",
	"dojo/text!./RDFViewTemplate.html"
], function(declare, lang, topic, json, domAttr, _LayoutWidget,  _TemplatedMixin, _WidgetsInTemplateMixin,
            TabContainer, SimpleTextarea, Graph, converters, template) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        //===================================================
        // Public attributes
        //===================================================
        graph: "",
        subView: "rdf/xml",

        //===================================================
        // Public methods
        //===================================================
        getGraph: function() {
            switch(this.subView) {
                case "rdf/xml":
                    return this.getRDFXML() || this.origGraph;
                case "rdf/json":
                    return this.getRDFJSON() || this.origGraph;
            }
        },
        setGraph: function(graph) {
            this.origGraph = graph;
            switch(this.subView) {
                case "rdf/xml":
                    this.setRDFXML(graph);
                    break;
                case "rdf/json":
                    this.setRDFJSON(graph);
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
        getRDFXML: function() {
            if (this.rdfxmlValue.length <= 100000) {
                return converters.rdfxml2graph(this._rdfxml.value);
            }
        },
        setRDFXML: function(graph) {
            this.rdfxmlValue = converters.rdfjson2rdfxml(graph);
            if (this.rdfxmlValue.length > 100000) {
                this._rdfxml.value = this.rdfxmlValue.substring(0,100000)+ "\n    ----- \n RDF to large, truncating it. \n   ------";
            } else {
                this._rdfxml.value = this.rdfxmlValue;
            }
        },
        getRDFJSON: function() {
            if (this.rdfjsonValue.length <= 100000) {
                return new Graph(json.parse(this._rdfjson.value));
            }
        },
        setRDFJSON: function(graph) {
            this.rdfjsonValue = json.stringify(graph.exportRDFJSON(), 0, 2);
            if (this.rdfjsonValue.length > 100000) {
                this._rdfjson.value = this.rdfjsonValue.substring(0,100000)+ "\n    ----- \n RDF to large, truncating it. \n   ------";
            } else {
                this._rdfjson.value = this.rdfjsonValue;
            }
        },

        _selectChild: function(child) {
            var graph = this.getGraph();
            if(child === this._rdfxmlTab) {
                this.subView = "rdf/xml";
            } else if(child === this._rdfjsonTab) {
                this.subView = "rdf/json";
            }
            this.setGraph(graph);
        }
    });
});