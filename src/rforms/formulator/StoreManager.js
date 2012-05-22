dojo.provide("rforms.formulator.StoreManager");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.Tree");
dojo.require("rdfjson.Graph");
dojo.require("rforms.view.Editor");
dojo.require("rforms.model.Engine");
dojo.require("rforms.formulator.GroupEditor");
dojo.require("rforms.apps.Experiment");
dojo.require("rforms.formulator.TreeModel");

dojo.declare("rforms.formulator.StoreManager", [dijit.layout._LayoutWidget, dijit._Templated], {	
	//===================================================
	// Public attributes
	//===================================================
	itemStore: null,

	//===================================================
	// Inherited attributes
	//===================================================
	templatePath: dojo.moduleUrl("rforms.formulator", "StoreManagerTemplate.html"),
	widgetsInTemplate: true,
	
	//===================================================
	// Inherited methods
	//===================================================
	postCreate: function() {
		this.inherited("postCreate", arguments);
		this._buildList();
		dojo.connect(this._listNode, "onclick", this, this._itemIdClicked);
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
		dojo.create("div", {innerHTML: "all"}, this._listNode);
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
		dojo.forEach(items, function(item) {
			dojo.create("div", {innerHTML: item.getId() || item.getProperty()}, this._listNode);
		}, this);
	},
	_itemIdClicked: function(event) {
		if (event.target !== this._listNode) {
			var id = dojo.attr(event.target, "innerHTML");
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
			this._editor = new rforms.formulator.GroupEditor({item: item}, dojo.create("div", null, this._editorNode));
			if (this.tree) {
				this.tree.destroy();
			}
			this.tree = new dijit.Tree({
					showRoot:true, 
					model: new rforms.formulator.TreeModel(item),
					onClick: dojo.hitch(this, function(item) {
						if (this._editor !=null) {
							this._editor.destroy();
						}
						this._editor = new rforms.formulator.GroupEditor({item: item}, dojo.create("div", null, this._editorNode));						
					})
				}, dojo.create("div", null, this._dijitItemTreeNode));
			this.tree.startup();
		}
	},
	_showContent: function(item) {
		dojo.attr(this._contentsNode, "value", dojo.toJson(item._source, true, "  "));
		var template;
		if (item.getChildren) {
			template = this.itemStore.createTemplateFromChildren(item.getChildren());
		} else {
			template = this.itemStore.createTemplateFromChildren([item]);
		}
		if (this._editorDijit != null) {
			this._editorDijit.destroy();
		}
		this._editorDijit = new rforms.apps.Experiment({hideTemplate: true, template: template, graphObj: this.data}, dojo.create("div", null, this._previewNode));
		this._editorDijit.startup();
		this._bcDijit.resize();
	},
	_showAll: function() {
		var arr = [];
		dojo.forEach(this.itemStore.getItems(), function(item) {
			arr.push(item._source);
		}, this);

		var str = dojo.toJson(arr, true, "  ");
		dojo.attr(this._contentsNode, "value", str);
		if (this._editorDijit != null) {
			this._editorDijit.destroy();
		}
	}
});