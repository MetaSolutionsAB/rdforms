//#!/usr/bin/env node

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require, baseUrl: '../../../'});

var conf = {
    source: "terms.rdf",
    destination: "terms.js",
    ns: "http://rdfs.org/ns/void#",
    abbrev: "void",
    root: "void:Dataset",
    literalNodeTypeDefault: "ONLY_LITERAL",
    nonGroupCardinalityDefault: {pref: 1},
    major: ["Dataset", "DatasetDescription", "Linkset"],
    ignore: [],
    specs: {
	"class": {type: "text"},
	"classPartition": {type: "group"},
	"propertyPartition": {type: "group"},
	"dataDump": {type: "text"},
	"exampleResource": {type: "text"},
	"linkPredicate": {type: "text"},
	"openSearchDescription": {type: "text", nodetype: "URI"},
	"property": {type: "text", nodetype: "URI"},
	"rootResource": {type: "text", nodetype: "URI"},
	"sparqlEndpoint": {type: "text", nodetype: "URI"},
	"uriLookupEndpoint": {type: "text", nodetype: "URI"},
	"uriRegexPattern": {type: "text", nodetype: "LITERAL"},
	"uriSpace": {type: "text", nodetype: "LITERAL"},
	"vocabulary": {type: "text", nodetype: "URI"}
    },
    order: [
    ],
    categories: []
};

requirejs(['fs', 'rdfjson/Graph', 'rdfjson/formats/converters', 'rdforms/converters/RDFS/converter'],
	function (fs, Graph, conv, rdfsconv) {
		fs.readFile(conf.source, 'utf8', function(err, data) {
			var graph = conv.rdfxml2graph(data);
		    var sirf = rdfsconv.convert(graph, conf);
		    	var fd = fs.openSync(conf.destination, "w");
			fs.writeSync(fd, "define("+JSON.stringify(sirf, true, 1)+");", 0, "utf8");

		});
	}
);