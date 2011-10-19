/*global dojo, doh, rdfjson*/
dojo.provide("rdfjson.tests.Statement");
dojo.require("rdfjson.Graph");

doh.register("Statement_assertion", [
  function assertStatement() {
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], undefined, false);
	doh.t(g.find().length === 0);
	s1.setAsserted(true);
	doh.t(g.find().length == 1);
	doh.t(g.find()[0] === s1);
  },
  function unAssertStatement() {
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0]);
	doh.t(g.find().length == 1);
	s1.setAsserted(false);
	doh.t(g.find().length === 0);
  }
]);

doh.register("Statement_manipulation", [
  function changeObjectValue() {
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hi'});
	doh.t(g.find(undefined, undefined, {type: 'literal', value: 'hi'}).length === 1);
	s1.setValue("Hello!");
	doh.t(g.find(undefined, undefined, {type: 'literal', value: 'hi'}).length === 0);
	doh.t(g.find(undefined, undefined, {type: 'literal', value: 'Hello!'}).length === 1);		
  },
   function changePredicate() {
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hi'});
	doh.t(g.find(undefined, rdfjson.tests.predicates[0]).length === 1);
	s1.setPredicate(rdfjson.tests.predicates[1]);
	doh.t(g.find(undefined, rdfjson.tests.predicates[0]).length === 0);
	doh.t(g.find(undefined, rdfjson.tests.predicates[1]).length === 1);
  },
  function changeSubject() {
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hi'});
	doh.t(g.find(rdfjson.tests.uris[0]).length === 1);
	s1.setSubject(rdfjson.tests.uris[1]);
	doh.t(g.find(rdfjson.tests.uris[0]).length === 0);
	doh.t(g.find(rdfjson.tests.uris[1]).length === 1);
  }
]);

doh.register("Statement_manipulation_across_graphs", [
  function copyStatement() {
	var g1 = new rdfjson.Graph({});
	var s1 = g1.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hi'});
	var g2 = new rdfjson.Graph({});
	var s2 = g2.add(s1);
	doh.t(s1 !== s2);
  },
  function removeStatement() {
	var g1 = new rdfjson.Graph({});
	var s1 = g1.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hi'});
	var g2 = new rdfjson.Graph({});
	var s2 = g1.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hi'});
	g2.remove(s1);
	doh.t(g1.find().length === 1);
	doh.t(g2.find().length === 0);
  }
]);