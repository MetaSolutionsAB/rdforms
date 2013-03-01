define(['nodeunit', '../Graph', '../Statement', './rdf1'], function(nodeunitNode, Graph, Statement, rdf1) {
	//browsers have the global nodeunit already available
	var nu = nodeunitNode || nodeunit;
	
	return nu.testCase({
		findS__: function(test) {
			var g = new Graph(rdf1.graph);
			var r = g.find("http://example.org/about");
			test.ok(r.length === 5);
			test.ok(r[0] instanceof Statement);
			test.done();
		},
	    find_P_: function(test)  {
			var g = new Graph(rdf1.graph);
			var r = g.find(undefined, "http://xmlns.com/foaf/0.1/nick");
			test.ok(r.length === 3);
			test.ok(r[0] instanceof Statement);
			test.done();
		},
	    find__O: function(test) {
			var g = new Graph(rdf1.graph);
			var r = g.find(undefined, undefined, { "value" : "http://example.org/about", "type" : "uri" });
			test.ok(r.length === 3);
			test.ok(r[0] instanceof Statement);
			test.done();
		},
	    findSP_: function(test) {
			var g = new Graph(rdf1.graph);
			var r = g.find("http://example.org/about", "http://xmlns.com/foaf/0.1/nick");
			test.ok(r.length === 1);
			test.ok(r[0] instanceof Statement);
			test.done();
		},
	    findS_O: function(test) {
			var g = new Graph(rdf1.graph);
			var r = g.find("_:person", undefined, { "value" : "http://example.org/about", "type" : "uri" });
			test.ok(r.length === 2);
			test.ok(r[0] instanceof Statement);
			test.done();
		},
	    find_PO: function(test) {
			var g = new Graph(rdf1.graph);
			var r = g.find(undefined,"http://purl.org/dc/terms/related", { "value" : "http://example.org/about", "type" : "uri" });
			test.ok(r.length === 1);
			test.ok(r[0] instanceof Statement);
			test.done();
		},
	    findSPO: function(test) {
			var g = new Graph(rdf1.graph);
			var r = g.find("http://example.org/about", "http://purl.org/dc/terms/related", { "value" : "http://example.org/about", "type" : "uri" });
			test.ok(r.length === 1);
			test.ok(r[0] instanceof Statement);
			test.done();
	  	}
	})
});