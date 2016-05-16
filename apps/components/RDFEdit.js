/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang",
    "dojo/on",
	"dojo/json",
    "rdfjson/Graph",
    "rdfjson/formats/converters",
    "rdforms/apps/components/RDFDetect"
], function(declare, lang, on, json, Graph, converters, RDFDetect) {

    //Assumes _rdfxml and _rdfjson to be textareas in the template.
    return declare([], {
        //===================================================
        // Public attributes
        //===================================================
        graph: "",
        subView: "rdf/xml",

        //===================================================
        // Public methods
        //===================================================

        /**
         * @param {rdfjson.Graph|String|Object} rdf supports rdf/xml as a string or
         * rdf/json as a Graph, a string or a Object.
         * @return {undefined|Object} if undefined everything went well,
         * if a object something went wrong and the report was returned.
         */
        setRDF: function(rdf) {
            var report = RDFDetect(rdf);
            if (!report.error) {
                this.subView = report.format;
                this.setGraph(report.graph);
            }
            return report;
        },

        /**
         * @return {Object} a report as an object with a graph and if something has gone wrong an error message.
         */
        getRDF: function() {
            try {
                var graph = this.getGraph();
                if (graph.validate().valid) {
                    return {graph: graph, format: this.subView};
                } else {
                    return {error: "RDF/JSON is not valid."};
                }
            } catch(e) {
                switch(this.subView) {
                    case "rdf/xml":
                        return {error: "RDF/XML is invalid"};
                    case "rdf/json":
                        return {error: "RDF/JSON is invalid"};
                }
            }
        },

        /**
         * @returns {rdfjson.Graph}
         */
        getGraph: function() {
            switch(this.subView) {
                case "rdf/xml":
                    return this.getRDFXML() || this.origGraph;
                case "rdf/json":
                    return this.getRDFJSON() || this.origGraph;
            }
        },
        getCurrentSubView : function() {
            return this.subView;
        },
        /**
         * @param {rdfjson.Graph} graph
         */
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

        /**
         * Called everytime the RDF is edited (after a delay of 400 milliseconds).
         */
        onRDFChange: function() {
        },

        //===================================================
        // Private methods
        //===================================================
        postCreate: function() {
            this.inherited(arguments);
            var timer,
                onRDFChange = lang.hitch(this, this.onRDFChange),
                onRDFChangeFunc = function() {
                    clearTimeout(timer);
                    timer = setTimeout(onRDFChange, 400);
                };
            on(this._rdfjson, "keyup", onRDFChangeFunc);
            on(this._rdfxml, "keyup", onRDFChangeFunc);
        },
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
                var rdfStr = this._rdfjson.value;
                return new Graph(json.parse(rdfStr == null || rdfStr === "" ? "{}" : rdfStr));
            }
        },
        setRDFJSON: function(graph) {
            this.rdfjsonValue = json.stringify(graph.exportRDFJSON(), 0, 2);
            if (this.rdfjsonValue.length > 100000) {
                this._rdfjson.value = this.rdfjsonValue.substring(0,100000)+ "\n    ----- \n RDF to large, truncating it. \n   ------";
            } else {
                this._rdfjson.value = this.rdfjsonValue;
            }
        }
    });
});