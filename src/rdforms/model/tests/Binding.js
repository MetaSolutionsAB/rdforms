/*global rdforms, dojo, doh, rdfjson*/
dojo.provide("rdforms.model.tests.Binding");
dojo.require("rdforms.model.GroupBinding");
dojo.require("rdforms.model.PropertyGroupBinding");
dojo.require("rdforms.model.ValueBinding");
dojo.require("rdforms.template.ItemStore");
dojo.require("rdfjson.Graph");

var setup = function() {
	this.graph = new rdfjson.Graph({});
	this.s1 = this.graph.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0]);
	this.s2 = this.graph.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[1], {"type": "literal", "value": "Hepp"});
	this.is = new rdforms.template.ItemStore();
	this.t1 = this.is.createTemplate(rdforms.template.tests.template1);
};

doh.register("Binding-creation", [
  { name: "GroupBinding creation",
	setUp: setup,
	runTest: function() {
		var b1 = new rdforms.model.GroupBinding({item: this.t1.getRoot()});
		doh.t(b1 instanceof rdforms.model.GroupBinding);
	}
  },
  { name: "ValueBinding creation",
	setUp: setup,
	runTest: function() {
		var b1 = new rdforms.model.ValueBinding({item: this.t1.getRoot().getChildren()[1]});
		doh.t(b1 instanceof rdforms.model.ValueBinding);
	}
  }
]);

var setup2 = function() {
	this.graph = new rdfjson.Graph({});
	this.s1 = this.graph.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[0]);
	this.s2 = this.graph.create(rdfjson.tests.uris[0], rdfjson.tests.predicates[1], {"type": "literal", "value": "Hepp"});
	this.is = new rdforms.template.ItemStore();
	this.t1 = this.is.createTemplate(rdforms.template.tests.template1);
	this.b1 = new rdforms.model.GroupBinding({item: this.t1.getRoot()});
	this.b2 = new rdforms.model.ValueBinding({item: this.t1.getRoot().getChildren()[1], statement: this.s2});	
};

doh.register("Binding-hierarchy", [
  { name: "Adding childrenbindings",
	setUp: setup2,
	runTest: function() {
		doh.t(this.b1.getChildBindings().length === 0);
		this.b1.addChildBinding(this.b2);
		doh.t(this.b1.getChildBindings().length === 1);
		this.b1.removeChildBinding(this.b2);
		doh.t(this.b1.getChildBindings().length === 0);
	}
  }
]);

var setup4 = function() {
	this.graph = new rdfjson.Graph({});
	this.s1 = this.graph.create("re1", "http://purl.org/dc/elements/1.1/creator", {"type": "bnode", "value": "_:person"});
	this.s2 = this.graph.create("_:person", "http://www.w3.org/TR/rdf-schema/type", {"type": "uri", "value": "http://xmlns.com/foaf/0.1/Person"});
	this.s3 = this.graph.create("_:person", "http://xmlns.com/foaf/0.1/firstname", {"type": "literal", "value": "Anna"});
	this.s4 = this.graph.create("re1", "http://purl.org/dc/elements/1.1/title", {"type": "literal", "value": "Some title"});
	this.is = new rdforms.template.ItemStore();
	this.t1 = this.is.createTemplate(rdforms.template.tests.template1);	
	this.b1 = new rdforms.model.GroupBinding({item: this.t1.getRoot()});
	this.b2 = new rdforms.model.GroupBinding({item: this.t1.getRoot().getChildren()[0], statement: this.s1, constraints: [this.s2]});
	this.b3 = new rdforms.model.ValueBinding({item: this.t1.getRoot().getChildren()[0].getChildren()[0], statement: this.s3});
	this.b4 = new rdforms.model.ValueBinding({item: this.t1.getRoot().getChildren()[1], statement: this.s4});
	this.b1.addChildBinding(this.b2);
	this.b2.addChildBinding(this.b3);
	this.b1.addChildBinding(this.b4);	
};

var setup6 = function() {
	this.graph = new rdfjson.Graph({});
	this.s1 = this.graph.create("re1", "http://purl.org/dc/elements/1.1/creator", {"type": "bnode", "value": "_:person"});
	this.s2 = this.graph.create("_:person", "http://www.w3.org/TR/rdf-schema/type", {"type": "uri", "value": "http://xmlns.com/foaf/0.1/Person"});
	this.s3 = this.graph.create("_:person", "http://xmlns.com/foaf/0.1/firstname", {"type": "literal", "value": "Anna"});
	this.s4 = this.graph.create("re1", "http://purl.org/dc/elements/1.1/title", {"type": "literal", "value": "Some title"});
	this.is = new rdforms.template.ItemStore();
	this.t1 = this.is.createTemplate(rdforms.template.tests.template1);	
	this.b1 = new rdforms.model.GroupBinding({item: this.t1.getRoot()});
	this.b2 = new rdforms.model.PropertyGroupBinding({item: this.t1.getRoot().getChildren()[4], statement: this.s1, constraints: [this.s2]});
	this.b3 = new rdforms.model.ValueBinding({item: this.t1.getRoot().getChildren()[4].getChildren()[1].getChildren()[0], statement: this.s3});
	this.b4 = new rdforms.model.ValueBinding({item: this.t1.getRoot().getChildren()[1], statement: this.s4});
	this.b1.addChildBinding(this.b2);
	this.b2.getObjectBinding().addChildBinding(this.b3);
	this.b1.addChildBinding(this.b4);
};

doh.register("Binding-assertions", [
  { name: "Changing values",
	setUp: setup2,
	runTest: function() {
		this.b1.addChildBinding(this.b2);
		doh.t(this.s2.isAsserted());
		this.b2.setValue("");
		doh.f(this.s2.isAsserted());
		this.b2.setValue("hopp");
		doh.t(this.s2.isAsserted());
		this.b2.setValue();
		doh.f(this.s2.isAsserted());
	}
  },
  { name: "Changing values in hierarchy",
	setUp: setup4,
	runTest: function() {
		doh.t(this.s1.isAsserted());
		doh.t(this.s2.isAsserted());
		doh.t(this.s3.isAsserted());
		doh.t(this.s4.isAsserted());
		this.b3.setValue("");
		doh.f(this.s1.isAsserted());
		doh.f(this.s2.isAsserted());
		doh.f(this.s3.isAsserted());
		doh.t(this.s4.isAsserted());
		this.b3.setValue("Anna Wilder");
		doh.t(this.s1.isAsserted());
		doh.t(this.s2.isAsserted());
		doh.t(this.s3.isAsserted());
		doh.t(this.s4.isAsserted());
	}
  },
  { name: "Checking two children validity in hierarchy",
	setUp: setup4,
	runTest: function() {
		this.s5 = this.graph.create("_:person", "http://xmlns.com/foaf/0.1/surame", {"type": "literal", "value": "Wilder"});
		this.b5 = new rdforms.model.ValueBinding({item: this.t1.getRoot().getChildren()[0].getChildren()[1], statement: this.s5});
		this.b2.addChildBinding(this.b5);
		
		doh.t(this.s1.isAsserted());
		doh.t(this.s3.isAsserted());
		doh.t(this.s5.isAsserted());
		this.b3.setValue("");
		doh.t(this.s1.isAsserted());
		doh.f(this.s3.isAsserted());
		doh.t(this.s5.isAsserted());
		this.b5.setValue("");
		doh.f(this.s1.isAsserted());
		doh.f(this.s3.isAsserted());
		doh.f(this.s5.isAsserted());
		this.b5.setValue("Wilder2");	
		doh.t(this.s1.isAsserted());
		doh.f(this.s3.isAsserted());
		doh.t(this.s5.isAsserted());
	}
  },
  { name: "Checking propertyGroup bindings",
	setUp: setup6,
	runTest: function() {
		//First check leaf validity effect.
		doh.t(this.s1.isAsserted());
		doh.t(this.s2.isAsserted());
		doh.t(this.s3.isAsserted());
		doh.t(this.s4.isAsserted());
		this.b3.setValue("");
		doh.f(this.s1.isAsserted());
		doh.f(this.s2.isAsserted());
		doh.f(this.s3.isAsserted());
		doh.t(this.s4.isAsserted());
		this.b3.setValue("Anna");
		doh.t(this.s1.isAsserted());
		doh.t(this.s2.isAsserted());
		doh.t(this.s3.isAsserted());
		doh.t(this.s4.isAsserted());
		//Second, check hierarchy updated when predicate changed above.
		this.b2.getPredicateBinding().setValue("");
		doh.f(this.s1.isAsserted());
		doh.f(this.s2.isAsserted());
		doh.f(this.s3.isAsserted());
		doh.t(this.s4.isAsserted());
		this.b2.getPredicateBinding().setValue("http://purl.org/dc/elements/1.1/creator");
		doh.t(this.s1.isAsserted());
		doh.t(this.s2.isAsserted());
		doh.t(this.s3.isAsserted());
		doh.t(this.s4.isAsserted());
	}
  }
]);