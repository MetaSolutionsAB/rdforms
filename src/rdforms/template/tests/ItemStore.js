/*global dojo, doh, rdforms*/
dojo.provide("rdforms.template.tests.ItemStore");
dojo.require("rdforms.template.ItemStore");

doh.register("Create-ItemStore", [
  function createTemplateStore(){
	var is = new rdforms.template.ItemStore();
	doh.t(is instanceof rdforms.template.ItemStore);
  },
  function createEmptyTemplate() {
	var is = new rdforms.template.ItemStore();
	var t = is.createTemplate({root: {"@type": "group", content: []}});
	doh.t(t instanceof rdforms.template.Template);
  },
  function createTemplateFromSource() {
	var is = new rdforms.template.ItemStore();
	var t = is.createTemplate(rdforms.template.tests.template1);
	var children = t.getRoot().getChildren();
	doh.t(children.length === 5);
	doh.t(children[0].getChildren().length === 2);
  },
  function checkPropertyGroup() {
	var is = new rdforms.template.ItemStore();
	var t = is.createTemplate(rdforms.template.tests.template1);
	var children = t.getRoot().getChildren();
	doh.t(children[4] instanceof rdforms.template.PropertyGroup);
	doh.t(children[4].getChildren().length == 2);
	doh.t(children[4].getChildren()[0] instanceof rdforms.template.Choice);
	doh.t(children[4].getChildren()[1] instanceof rdforms.template.Group);
  },
  function checkCachedChoices() {
	var deferred = new doh.Deferred();
	var is = new rdforms.template.ItemStore();
	var t = is.createTemplate(rdforms.template.tests.template1);
	var c = t.getRoot().getChildren()[3];
	doh.t(c instanceof rdforms.template.Choice);
	c.getDynamicChoices(function(choices) {
		deferred.callback(choices.length === 3);
	});
	return deferred;
  }
]);
