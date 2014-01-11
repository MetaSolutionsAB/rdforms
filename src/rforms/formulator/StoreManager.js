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
    "rforms/template/Group",
    "rforms/template/Choice",
    "rforms/apps/Experiment",
    "dojo/text!./StoreManagerTemplate.html"
], function (declare, lang, xhr, on, domClass, construct, attr, array, json, registry, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin,
             DnDSource, TreeDndSource, Tree, Menu, MenuItem, MenuSeparator, ContentPane, TabContainer, BorderContainer, Button,
             ItemEditor, ItemTreeModel, ChoicesEditor, Group, Choice, Experiment, template) {


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
            var items = this.itemStore.getItems();
            items.sort(function (i1, i2) {
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

            var root = new Group({source: {}});
            root.items = items;
            root._internalId = "_root";
            root.getChildren = function () {
                return this.items;
            };
            root.getLabel = function() {
                return "Root";
            };
            var itemAcceptance = function(node,source,position) {
                var tn = registry.getEnclosingWidget(node);
                if (tn.item === root) {
                    return false;
                }
                var sourceTn = source.getSelectedTreeNodes()[0];
                if (position === "over") {
                    if (tn.item instanceof Group) {
                        return tn.item.getChildren().indexOf(sourceTn.item) == -1; //only allow if the item is not already a child.
                    }
                    return false;
                }

                if (tn.getParent().item === root) { //Changing order between items in root is not allowed.
                    return false;
                }

                if (tn.getParent() == sourceTn.getParent()) { //a move within the same group, always ok.
                    return true;
                } else {
                    //Only allow a move into a group if the item is not already a child.
                    return tn.getParent().item.getChildren().indexOf(sourceTn.item) == -1;
                }
            };

            this.tree = new Tree({
                showRoot: false,
                model: new ItemTreeModel(root, this.itemStore),
                dndController: TreeDndSource,
                "class": "container",
                checkItemAcceptance: itemAcceptance,
                betweenThreshold: 5,
                getIconClass: function(/*dojo.store.Item*/ item, /*Boolean*/ opened){
                    return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") :
                        item instanceof Choice ? "dijitIconConnector" : "dijitLeaf";
                },
                onClick: lang.hitch(this, function (item) {
                    if (this._editor != null) {
                        this._editor.destroy();
                    }
                    this.item = item;
                    this._editor = new ItemEditor({item: item, itemStore: this.itemStore, storeManager: this}, construct.create("div", null, this._editorNode));
                    this._showEditor();
                    this._showContent();
                    this._showChoices();
                })
            }, construct.create("div", null, this._treeNode));
            this.tree.startup();
            if (this.menu) {
                this.menu.destroy();
            }
            this.menu = new Menu({
                targetNodeIds: [this.tree.id],
                selector: ".dijitTreeNode"
            });
            var addItem = lang.hitch(this, function(tn, source) {
                var clone = source == null;
                if (clone) {
                    source = lang.clone(tn.item.getSource(true));
                    delete source.id;
                }
                if (tn.item === root || (tn.getParent().item === root && !(tn.item instanceof Group))) {
                    source.id = ""+new Date().getTime();
                    this.__newItem(source, root);
                    return;
                }

                if (tn.item instanceof Group && !clone) {
                    this.__newItem(source, tn.item);
                } else {
                    var parent = tn.getParent().item;
                    this.__newItem(source, parent, parent.getChildren().indexOf(tn.item)+1);
                }
            });
            this.menu.addChild(new MenuItem({
                label: "New TextItem",
                iconClass: "dijitIconFile",
                onClick: function() {
                    addItem(registry.byNode(this.getParent().currentTarget), {type: "text"});
                }
            }));
            this.menu.addChild(new MenuItem({
                label: "New ChoiceItem",
                iconClass: "dijitIconConnector",
                onClick: function() {
                    addItem(registry.byNode(this.getParent().currentTarget), {type: "choice"});
                }
            }));
            this.menu.addChild(new MenuItem({
                label: "New GroupItem",
                iconClass: "dijitFolderOpened",
                onClick: function() {
                    addItem(registry.byNode(this.getParent().currentTarget), {type: "group"});
                }
            }));
            this.menu.addChild(new MenuItem({
                label: "Clone Item",
                iconClass: "dijitFolderOpened",
                onClick: function() {
                    addItem(registry.byNode(this.getParent().currentTarget));
                }
            }));
            this.menu.addChild(new MenuSeparator());
            var removeItem = lang.hitch(this, function(tn) {
                if (tn.item === root) {
                    alert("Cannot remove root!");
                } else if (tn.getParent().item === root) {
                    this.__removeItem(tn.item);
                } else {
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
            var bundle = this.itemStore.getBundles()[0];
            xhr.put(bundle.path, {data: json.stringify(bundle.source, true, "  "), headers: {"content-type": "application/json"}});
        },
/*        _itemIdClicked: function (event) {
            if (event.target !== this._listNode) {
                if (this._curSel != null) {
                    domClass.remove(this._curSel, "selected");
                }
                this._curSel = event.target;
                domClass.add(this._curSel, "selected");
                var id = attr.get(event.target, "innerHTML");
                if (id === "all") {
                    this._showAll();
                    this._showEditor();
                } else {
                    this.item = this.itemStore.getItem(id) || this.itemStore.getItemByProperty(id);
                    this._showContent(this.item);
                    this._showEditor(this.item);
                }
            }
        },*/
        _showEditor: function () {
            if (this._editor != null) {
                this._editor.destroy();
            }
            if (this.item != null) {
                this._editor = new ItemEditor({item: this.item, itemStore: this.itemStore, storeManager: this}, construct.create("div", null, this._editorNode));
            }
        },
        _newTextItem: function() {
            this.__newItem({type: "text", id: ""+new Date().getTime()});
        },
        _newChoiceItem: function() {
            this.__newItem({type: "choice", id: ""+new Date().getTime()});
        },
        _newGroupItem: function() {
            this.__newItem({type: "group", id: ""+new Date().getTime()});
        },
        __newItem: function(source, parent, insertIndex) {
            var newItem;
            var treeModel = this.tree.get("model");
            if (parent && parent !== treeModel.item) { //Not root.
                newItem = this.itemStore.createItem(source, false, true); //Do not clone, but skip registration since item is inline.
                treeModel.newItem(newItem, parent, insertIndex);
            } else {
                parent = treeModel.item;
                newItem = this.itemStore.createItem(source); //Register mew item since it is not inline.
                treeModel.newItem(newItem, parent, insertIndex);
            }
            var tn = this.tree.getNodesByItem(newItem)[0];
            tn.getParent().expand();
            this.tree.focusNode(tn);
            this.tree.set("selectedItem", newItem);
            this.item = newItem;
            this._showEditor();
            this._showContent();
            this._showChoices();
        },
        __removeItem: function(item) {
            var bundle = this.itemStore.getBundles()[0];
            var templates = bundle.source.templates || bundle.source.auxilliary;
            var idx = templates.indexOf(item.getSource(true));
            templates.splice(idx, 1);
            this.itemStore.removeItem(item);
            var treeModel = this.tree.get("model");
            var idx = treeModel.item.items.indexOf(item);
            treeModel.item.items.splice(idx, 1);
            treeModel.onChildrenChange(treeModel.item, treeModel.item.items); //Root has changed its children
        },
        _showContent: function () {
            attr.set(this._contentsNode, "value", json.stringify(this.item.getSource(true), true, "  "));
            var template;
            if (this.item.getChildren) {
                template = this.itemStore.createTemplateFromRoot(this.item);
            } else {
                template = this.itemStore.createTemplateFromChildren([this.item]);
            }
            if (this._editorDijit != null) {
                this._editorDijit.destroy();
            }
            this._editorDijit = new Experiment({hideTemplate: true, template: template, graphObj: this.data}, construct.create("div", null, this._previewNode));
            this._editorDijit.startup();
            this._bcDijit.resize();
        },
        _showChoices: function() {
            if (this._choicesEditor) {
                this._choicesEditor.destroy();
            }
            if (this.item instanceof Choice) {
                this._choicesEditor = new ChoicesEditor({item: this.item}, construct.create("div", null, this._choicesNode));
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
            attr.set(this._contentsNode, "value", str);
            if (this._editorDijit != null) {
                this._editorDijit.destroy();
            }
        }
    });
});