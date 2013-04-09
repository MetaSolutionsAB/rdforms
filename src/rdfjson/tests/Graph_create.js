define(['nodeunit', '../Graph', './rdf1'], function(nodeunitNode, Graph, rdf1) {
	//browsers have the global nodeunit already available
	var nu = nodeunitNode || nodeunit;
	
	return nu.testCase({
		createEmpty: function(test) {
			var g = new Graph({});
			test.ok(g.isEmpty());
			test.done();
  		},
  		createFrombject: function (test) {
			var g = new Graph(rdf1.graph);
			//console.log(g.find().length);
			test.ok(g.find().length == 14);
			test.ok(!g.isEmpty());
			test.done();
  		}
	})
});