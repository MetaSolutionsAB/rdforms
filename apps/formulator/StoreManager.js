/*global define*/
define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/request/xhr",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/_base/array",
    "dojo/json",
    "dijit/registry",
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/dnd/Source",
    "dijit/tree/dndSource",
    "dijit/Tree",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/MenuSeparator",
    "dijit/layout/ContentPane", //For template
    "dijit/layout/TabContainer", //For template
    "dijit/layout/BorderContainer", //For template
    "dijit/form/Button", //For template
    "./ItemEditor",
    "./ItemTreeModel",
    "./ChoicesEditor",
    "rdforms/template/Bundle",
    "rdforms/template/Group",
    "rdforms/template/Choice",
    "rdforms/apps/components/Experiment",
    "rdfjson/Graph",
    "dojo/text!./StoreManagerTemplate.html"
], function (declare, lang, xhr, on, domClass, domConstruct, domAttr, array, json, registry, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, DnDSource, TreeDndSource, Tree, Menu, MenuItem, MenuSeparator, ContentPane, TabContainer, BorderContainer, Button, ItemEditor, ItemTreeModel, ChoicesEditor, Bundle, Group, Choice, Experiment, Graph, template) {

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
        postCreate: function () {
            this.inherited("postCreate", arguments);
            this.itemStore.automaticSortAllowed = false;
            this._buildTree();
//            on(this._listNode, "click", lang.hitch(this, this._itemIdClicked));
        },
        startup: function () {
            this.inherited("startup", arguments);
            this._tabsDijit.watch("selectedChildWidget", lang.hitch(this, function (name, oval, nval) {
                if (nval === this._itemEditorTab) {
                    if (oval !== this._choicesTab) {
//TODO fix
//                        this.item._source = json.parse(attr.get(this._contentsNode, "value"));
                    }
                    this._showEditor();
                } else if (nval === this._choicesTab) {
                    this._showChoices();
                } else {
                    this._showContent();
                }
            }));
            var readOnly = this.saveDisabled || array.every(this.itemStore.getBundles(), function(bundle) {
                return bundle.isReadOnly();
            })
            if (readOnly) {
                this._saveAllButton.set("disabled", true);
            }
        },
        resize: function () {
            this.inherited("resize", arguments);
            if (this._bcDijit) {
                this._bcDijit.resize();
            }
        },
        itemChanged: function() {
            this.tree.get("model").onChange(this.item);
            this._showContent();
        },
        //===================================================
        // Private methods
        //===================================================

        _buildTree: function () {
            var root = this.itemStore;
            var model = new ItemTreeModel(root);

            var itemAcceptance = function(node,source,position) {
                var tn = registry.getEnclosingWidget(node);
                var sourceTn = source.getSelectedTreeNodes()[0];
                if (tn.item === root) {
                    return false;
                }

                var item = sourceTn.item;
                var oldParentItem = sourceTn.getParent().item;
                var newParentItem = position === "over" ? tn.item: tn.getParent().item;
                if (!(newParentItem instanceof Group || newParentItem instanceof Bundle)) {
                    return false;
                }
                return model.getPasteAction(item, oldParentItem, newParentItem)[0] !== "N";
            };

            this.tree = new Tree({
                showRoot: false,
                model: model,
                dndController: TreeDndSource,
                checkItemAcceptance: itemAcceptance,
                betweenThreshold: 5,
                getRowClass: function(item) {
                    if (item === root) {
                        return "readOnly";
                    } else {
                        var bundle = item instanceof Bundle ? item : item.getBundle();
                        return bundle.isReadOnly() ? "readOnly": "editable";
                    }
                },
                getIconClass: function(/*dojo.store.Item*/ item, /*Boolean*/ opened){
                    return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") :
                        item instanceof Choice ? "dijitIconConnector" : "dijitLeaf";
                },
                onClick: lang.hitch(this, function (item) {
                    if (this._editor != null) {
                        this._editor.destroy();
                    }
                    this.item = item;
                    this._showEditor();
                    this._showContent();
                    this._showChoices();
                })
            }, domConstruct.create("div", null, this._treeNode));
            this.tree.startup();
            if (this.menu) {
                this.menu.destroy();
            }
            this.menu = new Menu({
                targetNodeIds: [this.tree.id],
                selector: ".dijitTreeNode"
            });
            var addItem = lang.hitch(this, function(tn, source) {
                var bundle = tn.item instanceof Bundle ? tn.item : tn.item.getBundle();
                if (bundle.isReadOnly()) {
                    alert("Cannot perform operation on read-only item.");
                    return;
                }
                if (tn.item === root || tn.item instanceof Bundle) {
                    source.id = ""+new Date().getTime();
                    this.__newItem(source, tn.item);
                    return;
                }
                var parentItem = tn.getParent().item;

                if (parentItem instanceof Bundle && !(tn.item instanceof Group)) {
                    source.id = ""+new Date().getTime();
                    this.__newItem(source, parentItem);
                    return;
                }

                if (tn.item instanceof Group) {
                    this.__newItem(source, tn.item);
                } else {
                    this.__newItem(source, parentItem, parentItem.indexOf(tn.item)+1);
                }
            });
            var cloneItem = lang.hitch(this, function(tn) {
                var bundle = tn.item instanceof Bundle ? tn.item : tn.item.getBundle();
                if (bundle.isReadOnly()) {
                    alert("Cannot perform operation on read-only item.");
                    return;
                }
                if (tn.item === root || tn.item instanceof Bundle) {
                    alert("Cannot clone entire bundles.");
                    return;  //Not allowed to clone bundle or root
                }
                var parentItem = tn.getParent().item;
                var source = lang.clone(tn.item.getSource(true));

                if (parentItem instanceof Bundle) { //Toplevel
                    source.id = "" + new Date().getTime();
                    this.__newItem(source, parentItem);
                } else {
                    delete source.id;
                    this.__newItem(source, parentItem, parentItem.getChildren().indexOf(tn.item)+1);
                }
            });
            this.menu.addChild(new MenuItem({
                label: "New TextItem",
                iconClass: "dijitIconFile",
                onClick: function() {
                    addItem(registry.byNode(this.getParent().currentTarget), {type: "text", nodetype: "LITERAL"});
                }
            }));
            this.menu.addChild(new MenuItem({
                label: "New ChoiceItem",
                iconClass: "dijitIconConnector",
                onClick: function() {
                    addItem(registry.byNode(this.getParent().currentTarget), {type: "choice", nodetype: "URI"});
                }
            }));
            this.menu.addChild(new MenuItem({
                label: "New GroupItem",
                iconClass: "dijitFolderOpened",
                onClick: function() {
                    addItem(registry.byNode(this.getParent().currentTarget), {type: "group", nodetype: "RESOURCE"});
                }
            }));
            this.menu.addChild(new MenuItem({
                label: "Clone Item",
                iconClass: "dijitFolderOpened",
                onClick: function() {
                    cloneItem(registry.byNode(this.getParent().currentTarget));
                }
            }));
            this.menu.addChild(new MenuSeparator());
            var removeItem = lang.hitch(this, function(tn) {
                if (tn.item === root || tn.item instanceof Bundle) {
                    alert("Cannot remove root or bundles!");
                } else if (tn.getParent().item instanceof Bundle) {
                    if (tn.item.getBundle().isReadOnly()) {
                        alert("Cannot remove read-only items.");
                        return;
                    }
                    this.tree.get("model").removeItem(tn.item, tn.getParent().item);
                    this.itemStore.removeItem(tn.item);
                } else {
                    if (tn.getParent().item.getBundle().isReadOnly()) {
                        alert("Cannot remove read-only items.");
                        return;
                    }
                    this.tree.get("model").removeItem(tn.item, tn.getParent().item);
                }
            });
            this.menu.addChild(new MenuItem({
                label: "Remove item",
                iconClass: "dijitEditorIcon dijitEditorIconDelete",
                onClick: function() {
                    removeItem(registry.byNode(this.getParent().currentTarget));
                }
            }));

            this.menu.startup();
        },
        _saveTemplates: function () {
            array.forEach(this.itemStore.getBundles(), function(bundle) {
                if (!bundle.isReadOnly()) {
                    xhr.put(bundle.getPath(), {data: json.stringify(bundle.getSource(), true, "  "), headers: {"content-type": "application/json"}});
                }
            });
        },

        _showEditor: function () {
            if (this._editor != null) {
                this._editor.destroy();
            }
            if (this.item != null && !(this.item instanceof Bundle)) {
                this._editor = new ItemEditor({item: this.item, itemStore: this.itemStore, storeManager: this}, domConstruct.create("div", null, this._editorNode));
            }
        },
        __newItem: function(source, parent, insertIndex) {
            var newItem;
            if (parent === this.itemStore || parent == null) {
                parent = this.itemStore;
                newItem = this.itemStore.createItem(source, false, false, this.itemStore.getBundles()[0]); //Register mew item since it is not inline.
            } else if (parent instanceof Bundle) {
                newItem = this.itemStore.createItem(source, false, false, parent); //Register mew item since it is not inline.
            } else {
                newItem = this.itemStore.createItem(source, false, true, parent.getBundle()); //Do not clone, but skip registration since item is inline.
            }
            this.tree.get("model").newItem(newItem, parent, insertIndex);
            var tn = this.tree.getNodesByItem(newItem)[0];
            tn.getParent().expand();
            this.tree.focusNode(tn);
            this.tree.set("selectedItem", newItem);
            this.item = newItem;
            this._showEditor();
            this._showContent();
            this._showChoices();
        },
        _showContent: function () {
            domAttr.set(this._contentsNode, "value", json.stringify(this.item.getSource(true), true, "  "));
            if (this._editorDijit != null) {
                this._editorDijit.destroy();
            }
            if (this.item instanceof Bundle) {
                return;
            }
            var template;
            if (this.item.getChildren) {
                template = this.item;
            } else {
                template = this.itemStore.createTemplateFromChildren([this.item]);
            }
            var uri = "http://example.com/about";
            var graph = new Graph(this.data || {});
            var constr = template.getConstraints();
            if (constr) {
                for (var p in constr) if (constr.hasOwnProperty(p)) {
                    if (lang.isArray(constr[p])) {
                        graph.add(uri, p, constr[p][0]);
                    } else {
                        graph.add(uri, p, constr[p]);
                    }
                }
            }

            this._editorDijit = new Experiment({
                gutters: false,
                hideTemplate: true,
                template: template,
                resource: uri,
                graph: graph},
                domConstruct.create("div", null, this._previewNode));
            this._editorDijit.startup();
            this._bcDijit.resize();
        },
        _showChoices: function() {
            if (this._choicesEditor) {
                this._choicesEditor.destroy();
            }
            if (this.item instanceof Choice) {
                this._choicesEditor = new ChoicesEditor({item: this.item}, domConstruct.create("div", null, this._choicesNode));
                this._choicesEditor.onChange = lang.hitch(this, this._showContent);
                this._choicesEditor.startup();
                this._choicesEditor.resize();
            }
        },
        _showAll: function () {
            var arr = [];
            array.forEach(this.itemStore.getItems(), function (item) {
                arr.push(item.getSource(true));
            }, this);

            var str = json.stringify(arr, true, "  ");
            domAttr.set(this._contentsNode, "value", str);
            if (this._editorDijit != null) {
                this._editorDijit.destroy();
            }
        }
    });
});