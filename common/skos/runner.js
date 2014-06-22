//#!/usr/bin/env node

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require, baseUrl: '../../../'});

var conf = {
    source: "skos.rdf",
    destination: "terms.js",
    ns: "http://www.w3.org/2004/02/skos/core#",
    abbrev: "skos",
    major: ["Concept", "ConceptScheme", "Collection", "OrderedCollection"],
    ignore: ["semanticRelation"],
    specs: {
    		prefLabel: {nodetype: "LANGUAGE_LITERAL"},
    		altLabel: {nodetype: "LANGUAGE_LITERAL"},
    		hiddenLabel: {nodetype: "LANGUAGE_LITERAL"},
    		definition: {nodetype: "LANGUAGE_LITERAL", cls: ["rformsmultiline"]},
    		example: {nodetype: "LANGUAGE_LITERAL", cls: ["rformsmultiline"]},
    		note: {nodetype: "LANGUAGE_LITERAL", cls: ["rformsmultiline"]},
    		editorialNote: {nodetype: "LANGUAGE_LITERAL", cls: ["rformsmultiline"]},
    		scopeNote: {nodetype: "LANGUAGE_LITERAL", cls: ["rformsmultiline"]},
    		changeNote: {nodetype: "LANGUAGE_LITERAL", cls: ["rformsmultiline"]},
    		historyNote: {nodetype: "LANGUAGE_LITERAL", cls: ["rformsmultiline"]}
    },
    forced: {"Concept": ["prefLabel",
    					"altLabel",
    					"hiddenLabel",
    					"definition",
    					"example",
    					"note",
    					"editorialNote",
    					"scopeNote",
    					"changeNote",
    					"historyNote",
    					"inScheme"
    	]},
    order: [
    	"prefLabel",
    	"definition",
		"example",
		"topConceptOf",
		"hasTopConcept",
		"inScheme",
		"notation",
		"memberList",
		"broader",
		"narrower",
		"related",
		"member"
    ],
    categories: [{
    	label: {en: "Labels and annotations"},
    	properties: [
    	    "altLabel",
			"hiddenLabel",
			"note",
			"editorialNote",
			"scopeNote",
			"changeNote",
			"historyNote"
    	]
    }, {
    	label: {en: "Additional concept relations"},
    	properties: [
			"broaderTransitive",
			"narrowerTransitive",
			"broadMatch",
			"narrowMatch",
			"exactMatch",
			"closeMatch",
			"relatedMatch",
			"mappingRelation"
    	]
    }]
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