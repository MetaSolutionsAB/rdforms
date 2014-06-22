//#!/usr/bin/env node

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require, baseUrl: '../../../'});

var conf = {
    source: "dcterms.rdf",
    destination: "terms.json",
    ns: "http://purl.org/dc/terms/",
    abbrev: "dcterms",
    major: ["Agent"],
    ignore: [],
    order: [
    ],
    categories: []
};

requirejs(['fs', 'rdfjson/Graph', 'rdfjson/formats/converters', 'rforms/converters/RDFS/converter'],
	  function (fs, Graph, conv, rdfsconv) {
	      fs.readFile(conf.source, 'utf8', function(err, data) {
		  var graph = conv.rdfxml2graph(data);
		  var sirf = rdfsconv.convert(graph, conf);
		  var fd = fs.openSync(conf.destination, "w");
		  fs.writeSync(fd, "define("+JSON.stringify(sirf, true, 1)+");", 0, "utf8");
	      });
	  }
);