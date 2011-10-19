/*global dojo, doh, rdfjson*/ 
dojo.provide("rdfjson.tests.Graph");
dojo.require("rdfjson.Graph");

doh.register("Create-Graph", [
  function createEmpty(){
	var g = new rdfjson.Graph({});
	doh.t(g.find().length === 0);
  },
  function createFrombject() {
	var g = new rdfjson.Graph(rdfjson.tests.graph1);
	//console.log(g.find().length);
	doh.t(g.find().length == 14);
  }
]);

doh.register("Manipulate-Graph", [
  function addingAStatement(){
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0]);
	doh.t(s1 instanceof rdfjson.Statement);
  },
  function addingStatementObjectBNode(){
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0]);
	doh.t(s1 instanceof rdfjson.Statement);
  },
  function addingStatementSubjectBNode(){
	var g = new rdfjson.Graph({});
	var s1 = g.create(undefined, rdfjson.tests.predicates[0], {type: 'literal', value: 'hepp'});
	doh.t(s1 instanceof rdfjson.Statement);
  },
  function bnodeStatementsDifferObjectPosition(){
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0]);
	doh.t(s1 instanceof rdfjson.Statement);
	var s2 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0]);
	doh.t(s1 !== s2);
  },
  function bnodeStatementsDifferSubjectPosition(){
	var g = new rdfjson.Graph({});
	var s1 = g.create(undefined, rdfjson.tests.predicates[0], {type: 'literal', value: 'hepp'});
	doh.t(s1 instanceof rdfjson.Statement);
	var s2 = g.create(undefined, rdfjson.tests.predicates[0], {type: 'literal', value: 'hepp'});
	doh.t(s1 !== s2);
  },
  function createNonAssertedStatement() {
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], undefined, false);
	doh.t(g.find().length === 0);
  },
  function duplicatStatementDetected(){
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hepp'});
	var s2 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hepp'});
	doh.t(s1 === s2);
  },
  function removingStatement() {
	var g = new rdfjson.Graph({});
	var s1 = g.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0], {type: 'literal', value: 'hepp'});
	doh.t(g.find().length === 1);
	g.remove(s1);
	doh.t(g.find().length === 0);	
  }
]);

doh.register("Search-Graph", [
  function findS__() {
	var g = new rdfjson.Graph(rdfjson.tests.graph1);
	var r = g.find("http://example.org/about");
	doh.t(r.length === 5);
	doh.t(r[0] instanceof rdfjson.Statement);
  },
  function find_P_() {
	var g = new rdfjson.Graph(rdfjson.tests.graph1);
	var r = g.find(undefined, "http://xmlns.com/foaf/0.1/nick");
	doh.t(r.length === 3);
	doh.t(r[0] instanceof rdfjson.Statement);
  },
  function find__O() {
	var g = new rdfjson.Graph(rdfjson.tests.graph1);
	var r = g.find(undefined, undefined, { "value" : "http://example.org/about", "type" : "uri" });
	doh.t(r.length === 3);
	doh.t(r[0] instanceof rdfjson.Statement);
  },
  function findSP_() {
	var g = new rdfjson.Graph(rdfjson.tests.graph1);
	var r = g.find("http://example.org/about", "http://xmlns.com/foaf/0.1/nick");
	doh.t(r.length === 1);
	doh.t(r[0] instanceof rdfjson.Statement);
  },
  function findS_O() {
	var g = new rdfjson.Graph(rdfjson.tests.graph1);
	var r = g.find("_:person", undefined, { "value" : "http://example.org/about", "type" : "uri" });
	doh.t(r.length === 2);
	doh.t(r[0] instanceof rdfjson.Statement);
  },
  function find_PO() {
	var g = new rdfjson.Graph(rdfjson.tests.graph1);
	var r = g.find(undefined,"http://purl.org/dc/terms/related", { "value" : "http://example.org/about", "type" : "uri" });
	doh.t(r.length === 1);
	doh.t(r[0] instanceof rdfjson.Statement);
  },
  function findSPO() {
	var g = new rdfjson.Graph(rdfjson.tests.graph1);
	var r = g.find("http://example.org/about", "http://purl.org/dc/terms/related", { "value" : "http://example.org/about", "type" : "uri" });
	doh.t(r.length === 1);
	doh.t(r[0] instanceof rdfjson.Statement);
  }
]);