//#!/usr/bin/env node

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require, baseUrl: '../../../'});

var conf = {
    source: "terms.rdf",
    destination: "terms.json",
    ns: "http://xmlns.com/foaf/0.1/",
    abbrev: "foaf",
    major: ["Agent", "Group", "Person", "Organization", "Document", "Image", "PersonalProfileDocument", "OnlineAccount", "OnlineGamingAccount", "OnlineEcommerceAccount", "OnlineChatAccount", "Project"]
};

requirejs(['fs', 'rdfjson/Graph', 'rdfjson/converters', 'rforms/converters/RDFS/converter'], 
	function (fs, Graph, conv, rdfsconv) {
		fs.readFile(conf.source, 'utf8', function(err, data) {
			var graph = conv.rdfxml2graph(data);
		    var sirf = rdfsconv.convert(graph, conf);
		    	var fd = fs.openSync(conf.destination, "w");
			fs.writeSync(fd, JSON.stringify(sirf, true, 1), 0, "utf8");

		});
	}
);