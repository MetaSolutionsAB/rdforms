/*global define*/
define([
    "dojo/_base/lang",
    "dojo/json",
    "rdfjson/Graph",
    "rdfjson/formats/converters"
], function(lang, json, Graph, converters) {

    return function(rdf) {
        var report = {};
        if (typeof rdf === "string") {
            if (rdf.substring(0,1) === "<") {
                report.format = "rdf/xml";
                try {
                    report.graph = converters.rdfxml2graph(rdf);
                } catch (e) {
                    report.error = "Invalid rdf/xml";
                }
            } else if (rdf.substring(0,2) === "{\"") {
                report.format = "rdf/json";
                try {
                    var jsonrdf = json.parse(this.rdfjson);
                    report.graph = new Graph(jsonrdf);
                } catch(e) {
                    report.error = "Invalid json.";
                }
            } else {
                report.error = "No RDF detected.";
            }
        } else if (rdf instanceof Graph) {
            report.format = "rdf/json";
            report.graph = rdf;
        } else if (lang.isObject(rdf)) {
            report.format = "rdf/json";
            report.graph = new Graph(rdf);
        } else {
            report.error = "unknown format";
        }
        if (!report.error) {
            var r = report.graph.validate();
            if (!r.valid) {
                report.error = "RDF/JSON is not valid.";
            }
        }
        return report;
    };
});