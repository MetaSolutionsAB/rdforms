define(['nodeunit', '../Graph', '../converters', './rdf1', 'fs'], function(nodeunitNode, Graph, converters, rdf1, fs) {
	//browsers have the global nodeunit already available
	var nu = nodeunitNode || nodeunit;
	
	return nu.testCase({
		convertrdfxml: function(test) {
			var g = converters.rdfxml2graph(rdf1.rdfxml);
			test.ok(g.find().length == 14);
			test.done();
  	    }
	})
});