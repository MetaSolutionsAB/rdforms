/*global dojo, doh, rforms*/
dojo.provide("rforms.template.tests.ItemStore");
dojo.require("rforms.template.ItemStore");

doh.register("Create-ItemStore", [
  function createTemplateStore(){
	var is = new rforms.template.ItemStore();
	doh.t(is instanceof rforms.template.ItemStore);
  },
  function createEmptyTemplate() {
	var is = new rforms.template.ItemStore();
	var t = is.createTemplate({root: {"@type": "group", content: []}});
	doh.t(t instanceof rforms.template.Template);
  },
  function createTemplateFromSource() {
	var is = new rforms.template.ItemStore();
	var t = is.createTemplate(rforms.template.tests.template1);
	var children = t.getRoot().getChildren();
	doh.t(children.length === 5);
	doh.t(children[0].getChildren().length === 2);
  },
  function checkPropertyGroup() {
	var is = new rforms.template.ItemStore();
	var t = is.createTemplate(rforms.template.tests.template1);
	var children = t.getRoot().getChildren();
	doh.t(children[4] instanceof rforms.template.PropertyGroup);
	doh.t(children[4].getChildren().length == 2);
	doh.t(children[4].getChildren()[0] instanceof rforms.template.Choice);
	doh.t(children[4].getChildren()[1] instanceof rforms.template.Group);
  },
  function checkCachedChoices() {
	var deferred = new doh.Deferred();
	var is = new rforms.template.ItemStore();
	var t = is.createTemplate(rforms.template.tests.template1);
	var c = t.getRoot().getChildren()[3];
	doh.t(c instanceof rforms.template.Choice);
	c.getDynamicChoices(function(choices) {
		deferred.callback(choices.length === 3);
	});
	return deferred;
  }
]);
