//#!/usr/bin/env node
/*global require*/

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['nodeunit', 
			'./Graph_create', 
			'./Graph_manipulate', 
			'./Graph_search', 
			'./Statement',
			'./converters',
			'./Rdfs'], function (
				nodeunit, 
				graph_create, 
				graph_manipulate, 
				graph_search, 
				statement, 
				converters,
				rdfs) {
	var reporter = nodeunit.reporters.default;
	reporter.run({
		graphCreate: graph_create,
		graphManipulate: graph_manipulate,
		graphSearch: graph_search,
		statement: statement,
		converters: converters,
		rdfs: rdfs
	});
});