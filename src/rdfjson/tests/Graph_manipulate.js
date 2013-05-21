define(['nodeunit', '../Graph', '../Statement', './rdf1'], function(nodeunitNode, Graph, Statement, rdf1) {
	//browsers have the global nodeunit already available
	var nu = nodeunitNode || nodeunit;
	
	return nu.testCase({
  		addingAStatement: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0]);
			test.ok(s1 instanceof Statement);
			test.done();
		},
  		addingStatementObjectBNode: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0]);
			test.ok(s1 instanceof Statement);
			test.done();
  		},
	    addingStatementSubjectBNode: function(test) {
			var g = new Graph({});
			var s1 = g.create(undefined, rdf1.predicates[0], {type: 'literal', value: 'hepp'});
			test.ok(s1 instanceof Statement);
			test.done();
  		},
	    bnodeStatementsDifferObjectPosition: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0]);
			test.ok(s1 instanceof Statement);
			var s2 = g.create(rdf1.uris[0], rdf1.predicates[0]);
			test.ok(s1 !== s2);
			test.done();
		},
	    bnodeStatementsDifferSubjectPosition: function(test) {
			var g = new Graph({});
			var s1 = g.create(undefined, rdf1.predicates[0], {type: 'literal', value: 'hepp'});
			test.ok(s1 instanceof Statement);
			var s2 = g.create(undefined, rdf1.predicates[0], {type: 'literal', value: 'hepp'});
			test.ok(s1 !== s2);
			test.done();
		},
	    createNonAssertedStatement: function(test) {
			var g = new Graph({});
			g.create(rdf1.uris[0], rdf1.predicates[0], undefined, false);
			test.ok(g.find().length === 0);
			test.done();
		},
	    duplicatStatementDetected: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hepp'});
			var s2 = g.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hepp'});
			test.ok(s1 === s2);
			test.done();
		},
	    removingStatement: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hepp'});
			test.ok(g.find().length === 1);
			g.remove(s1);
			test.ok(g.find().length === 0);	
			test.done();
  		}
	})
});