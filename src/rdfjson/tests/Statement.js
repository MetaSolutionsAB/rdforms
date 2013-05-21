/*global define, nodeunit*/
define(['nodeunit', '../Graph', './rdf1'], function(nodeunitNode, Graph, rdf1) {
	//browsers have the global nodeunit already available
	var nu = nodeunitNode || nodeunit;
	
	return nu.testCase({
	    assertStatement: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0], undefined, false);
			test.ok(g.find().length === 0);
			s1.setAsserted(true);
			test.ok(g.find().length == 1);
			test.ok(g.find()[0] === s1);
			test.done();
		},
	    unAssertStatement: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0]);
			test.ok(g.find().length == 1);
			s1.setAsserted(false);
			test.ok(g.find().length === 0);
			test.done();
		},
	    changeObjectValue: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hi'});
			test.ok(g.find(undefined, undefined, {type: 'literal', value: 'hi'}).length === 1);
			s1.setValue("Hello!");
			test.ok(g.find(undefined, undefined, {type: 'literal', value: 'hi'}).length === 0);
			test.ok(g.find(undefined, undefined, {type: 'literal', value: 'Hello!'}).length === 1);		
			test.done();
		},
		changePredicate: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hi'});
			test.ok(g.find(undefined, rdf1.predicates[0]).length === 1);
			s1.setPredicate(rdf1.predicates[1]);
			test.ok(g.find(undefined, rdf1.predicates[0]).length === 0);
			test.ok(g.find(undefined, rdf1.predicates[1]).length === 1);
			test.done();
		},
	    changeSubject: function(test) {
			var g = new Graph({});
			var s1 = g.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hi'});
			test.ok(g.find(rdf1.uris[0]).length === 1);
			s1.setSubject(rdf1.uris[1]);
			test.ok(g.find(rdf1.uris[0]).length === 0);
			test.ok(g.find(rdf1.uris[1]).length === 1);
			test.done();
		},
	    copyStatementAcrossGraphs: function(test) {
			var g1 = new Graph({});
			var s1 = g1.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hi'});
			var g2 = new Graph({});
			var s2 = g2.add(s1);
			test.ok(s1 !== s2);
			test.done();
		},
		removeStatementFromOtherGraph: function(test) {
			var g1 = new Graph({});
			var s1 = g1.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hi'});
			var g2 = new Graph({});
			g1.create(rdf1.uris[0], rdf1.predicates[0], {type: 'literal', value: 'hi'});
			g2.remove(s1);
			test.ok(g1.find().length === 1);
			test.ok(g2.find().length === 0);
			test.done();
		}
 });
});