/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang",
 	"dojo/on", 
	"dojo/dom-construct", 
	"dojo/dom-attr", 
	"dojo/_base/array",
	"dojo/json",
	"dijit/layout/_LayoutWidget", 
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/Tree",
	"dijit/layout/ContentPane", //For template
	"dijit/layout/TabContainer", //For template
	"dijit/layout/BorderContainer", //For template
	"./GroupEditor",
	"./TreeModel",
	"rforms/template/Group",
	"rforms/apps/Experiment",
	"dojo/text!./StoreManagerTemplate.html"
], function(declare, lang, on, construct, attr, array, json, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, Tree, ContentPane, TabContainer, BorderContainer, GroupEditor, TreeModel, Group, Experiment, template) {


    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
	//===================================================
	// Public attributes
	//===================================================
	itemStore: null,
	
	//===================================================
	// Inherited attributes
	//===================================================
	templateString: template,
	
	//===================================================
	// Inherited methods
	//===================================================
	postCreate: function() {
	    this.inherited("postCreate", arguments);
	    this._buildList();
	    on(this._listNode, "click", lang.hitch(this, this._itemIdClicked));
	},
	resize: function() {
	    this.inherited("resize", arguments);
	    if (this._bcDijit) {
		this._bcDijit.resize();
	    }		
	},
	//===================================================
	// Private methods
	//===================================================
	_buildList: function() {
	    construct.create("div", {innerHTML: "all"}, this._listNode);
	    var items = this.itemStore.getItems();
	    items.sort(function(i1, i2) {
		var lab1 = i1.getId() || i1.getProperty();
		var lab2 = i2.getId() || i2.getProperty();
		if (lab1 > lab2) {
		    return 1;
		} else if (lab1 < lab2) {
		    return -1;
		} else {
		    return 0;
		}
	    });
	    array.forEach(items, function(item) {
		construct.create("div", {innerHTML: item.getId() || item.getProperty()}, this._listNode);
	    }, this);
	},
	_itemIdClicked: function(event) {
	    if (event.target !== this._listNode) {
		var id = attr.get(event.target, "innerHTML");
		if (id === "all") {
		    this._showAll();
		    this._showEditor();
		} else {
		    var item = this.itemStore.getItem(id) || this.itemStore.getItemByProperty(id);
		    this._showContent(item);
		    this._showEditor(item);
		}
	    }
	},
	_showEditor: function(item) {
	    if (this._editor !=null) {
		this._editor.destroy();
	    }
	    if (item != null) {
		this._editor = new GroupEditor({item: item}, construct.create("div", null, this._editorNode));
		if (this.tree) {
		    this.tree.destroy();
		}
		var root = item;
		if (item.getChildren == null) {
		    var root = new Group({});
		    root._internalId = "_root";
		    root.getChildren = function() {return [item]};			
		}
		this.tree = new Tree({
		    showRoot: item.getChildren != null,
		    model: new TreeModel(root),
		    onClick: lang.hitch(this, function(item) {
			if (this._editor !=null) {
			    this._editor.destroy();
			}
			this._editor = new GroupEditor({item: item}, construct.create("div", null, this._editorNode));						
		    })
		}, construct.create("div", null, this._dijitItemTreeNode));
		this.tree.startup();				
	    }
	},
	_showContent: function(item) {
	    attr.set(this._contentsNode, "value", json.stringify(item._source, true, "  "));
	    var template;
	    if (item.getChildren) {
		template = this.itemStore.createTemplateFromChildren(item.getChildren());
	    } else {
		template = this.itemStore.createTemplateFromChildren([item]);
	    }
	    if (this._editorDijit != null) {
		this._editorDijit.destroy();
	    }
	    this._editorDijit = new Experiment({hideTemplate: true, template: template, graphObj: this.data}, construct.create("div", null, this._previewNode));
	    this._editorDijit.startup();
	    this._bcDijit.resize();
	},
	_showAll: function() {
	    var arr = [];
	    array.forEach(this.itemStore.getItems(), function(item) {
		arr.push(item._source);
	    }, this);

	    var str = json.stringify(arr, true, "  ");
	    attr.set(this._contentsNode, "value", str);
	    if (this._editorDijit != null) {
		this._editorDijit.destroy();
	    }
	}
    });
});