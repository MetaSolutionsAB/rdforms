/*global rdforms, dojo, doh, rdfjson*/
dojo.provide("rdforms.model.tests.Engine");
dojo.require("rdforms.model.Engine");
dojo.require("rdforms.template.ItemStore");
dojo.require("rdfjson.Graph");


var setup = function() {
	this.itemStore = new rdforms.template.ItemStore();
	this.template = this.itemStore.createTemplate(rdforms.template.tests.template1);
	this.graph = new rdfjson.Graph(rdfjson.tests.graph2);
};

doh.register("Engine matching test", [
  { name: "Matching a graph with a template",
	setUp: setup,
	runTest: function() {
		var binding = rdforms.model.match(this.graph, "http://example.org/about", this.template);
		doh.t(binding instanceof rdforms.model.GroupBinding);
		doh.t(binding.getChildBindings().length === 5); //A publisher, two titles, a subject and a creator.
		doh.t(binding.getItemGroupedChildBindings()[0].length === 1); //One publisher
		doh.t(binding.getItemGroupedChildBindings()[1].length === 2); //Two titles
		doh.t(binding.getItemGroupedChildBindings()[2].length === 0); //No date
		doh.t(binding.getItemGroupedChildBindings()[3].length === 1); //One subject
		doh.t(binding.getItemGroupedChildBindings()[4].length === 1); //One contributor
	}
  },
  { name: "Checking matched direct values",
	setUp: setup,
	runTest: function() {
		var binding = rdforms.model.match(this.graph, "http://example.org/about", this.template);
		doh.t(binding.getItemGroupedChildBindings()[1][0].getValue() === "Anna's Homepage");
		doh.t(binding.getItemGroupedChildBindings()[1][0].getLanguage() === "en");
		doh.t(binding.getItemGroupedChildBindings()[1][1].getValue() === "Anna hemsida");
		doh.t(binding.getItemGroupedChildBindings()[1][1].getLanguage() === "sv");
		doh.t(binding.getItemGroupedChildBindings()[3][0].getValue() === "http://example.com/instance1");
	}
  },
  { name: "Checking matched grouped values",
	setUp: setup,
	runTest: function() {
		var binding = rdforms.model.match(this.graph, "http://example.org/about", this.template);
		doh.t(binding.getItemGroupedChildBindings()[0][0].getItemGroupedChildBindings()[0][0].getValue() === "Anna");
		doh.t(binding.getItemGroupedChildBindings()[0][0].getItemGroupedChildBindings()[0][1].getValue() === "Annie");
		doh.t(binding.getItemGroupedChildBindings()[0][0].getItemGroupedChildBindings()[1][0].getValue() === "Wilder");
		doh.t(binding.getItemGroupedChildBindings()[4].length === 1); //One contributor
	}
  },
  { name: "Checking matched PredicateGroup values",
	setUp: setup,
	runTest: function() {
		var binding = rdforms.model.match(this.graph, "http://example.org/about", this.template);
		doh.t(binding.getItemGroupedChildBindings()[4][0].getPredicateBinding().getValue() === "http://purl.org/dc/terms/creator");
		doh.t(binding.getItemGroupedChildBindings()[4][0].getObjectBinding().getItemGroupedChildBindings()[0][0].getValue() === "Steve");
		doh.t(binding.getItemGroupedChildBindings()[4][0].getObjectBinding().getItemGroupedChildBindings()[1][0].getValue() === "Jobs");
	}
  }  
]);

var setup2 = function() {
	this.itemStore = new rdforms.template.ItemStore();
	this.template = this.itemStore.createTemplate(rdforms.template.tests.template1);
	this.graph = new rdfjson.Graph({});
	this.root = new rdforms.model.GroupBinding({item: this.template.getRoot(), childrenRootUri: "http://example.org/about", graph: this.graph});
};

doh.register("Engine create test", [
  { name: "Creating direct value",
	setUp: setup2,
	runTest: function() {
		var titleBinding = rdforms.model.create(this.root, this.template.getRoot().getChildren()[1]);
		doh.t(titleBinding.getParent() === this.root);
		doh.t(titleBinding.getValue() === "");
		doh.t(titleBinding.isValid() === false);
		doh.t(this.graph.find().length === 0);
		titleBinding.setValue("Hello");
		doh.t(titleBinding.getValue() === "Hello");		
		doh.t(titleBinding.isValid() === true);
		doh.t(this.graph.find().length === 1);
	}
  },
  { name: "Creating group with direct values",
	setUp: setup2,
	runTest: function() {
		var groupBinding = rdforms.model.create(this.root, this.template.getRoot().getChildren()[0]);
		doh.t(groupBinding.getParent() === this.root);
		doh.t(groupBinding.isValid() === false);
		doh.t(this.graph.find().length === 0);
		var valueBinding = rdforms.model.create(groupBinding, this.template.getRoot().getChildren()[0].getChildren()[0]);
		doh.t(groupBinding.isValid() === false);
		doh.t(valueBinding.isValid() === false);
		doh.t(this.graph.find().length === 0);
		valueBinding.setValue("Pete");
		doh.t(groupBinding.isValid() === true);
		doh.t(valueBinding.isValid() === true);
		doh.t(this.graph.find().length === 3);
	}
  },
  { name: "Creating propertygroup",
	setUp: setup2,
	runTest: function() {
		var pGroupBinding = rdforms.model.create(this.root, this.template.getRoot().getChildren()[4]);
		doh.t(pGroupBinding.getParent() === this.root);
		doh.t(pGroupBinding.isValid() === false);
		doh.t(this.graph.find().length === 0);
		var groupBinding = pGroupBinding.getObjectBinding();
		var valueBinding = rdforms.model.create(groupBinding, groupBinding.getItem().getChildren()[0]);
		doh.t(groupBinding.isValid() === false);
		doh.t(pGroupBinding.isValid() === false);
		doh.t(valueBinding.isValid() === false);
		doh.t(this.graph.find().length === 0);
		valueBinding.setValue("Pete");
		doh.t(groupBinding.isValid() === false);
		doh.t(pGroupBinding.isValid() === false);
		doh.t(valueBinding.isValid() === true);
		doh.t(this.graph.find().length === 0);
		pGroupBinding.getPredicateBinding().setValue("http://purl.org/dc/terms/creator");
		doh.t(groupBinding.isValid() === true);
		doh.t(pGroupBinding.isValid() === true);
		doh.t(valueBinding.isValid() === true);
		doh.t(this.graph.find().length === 3);
	}
  }
]);