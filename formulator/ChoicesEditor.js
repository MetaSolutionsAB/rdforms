/*global define*/
define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/aspect",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dijit/registry",
    "dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/Tree",
    "dijit/Menu",
    "dijit/MenuItem",
    //For template
    //For template
    //For template
    //For template
    //For template
    "dijit/tree/dndSource",
    "./ChoicesTreeModel",
    "dojo/text!./ChoicesEditorTemplate.html"
], function(declare, lang, array, aspect, on, domClass, construct, style, registry, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, Tree,
            Menu, MenuItem, TreeDndSource, ChoicesTreeModel, template) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        choices: [],
        templateString: template,
        postCreate: function() {
            this.choices = this.item.getStaticChoices() || [];
            this.inherited("postCreate", arguments);
            var readOnly = this.item.getBundle().isReadOnly();


            this.tree = new Tree({
                showRoot: true,
                model: new ChoicesTreeModel(this.choices),
                disabled: readOnly,
                dndController: TreeDndSource,
                checkItemAcceptance: function(node,source,position) {
                    return !readOnly && position === "over";
                },
                betweenThreshold: 5,
                onClick: lang.hitch(this, this._editChoice)
            }, construct.create("div", null, this._treeNode));
            this.tree.startup();

            if (readOnly) {
                array.forEach(["_valueDijit", "_labelLangString", "_descLangString", "_valueDijit", "_selectable",
                    "_inlineDijit", "_ontologyDijit", "_ppDijit", "_ppinvDijit", "_hpDijit", "_hpinvDijit"], function(wid) {
                    this[wid].set("disabled", "true");
                }, this);
            } else {
                this._valueDijit.validator = lang.hitch(this, function(value, constraints){
                    var model = this.tree.get("model");
                    if (this._choice == null || this._choice.value === value) {
                        return true;
                    }
                    return model.isNameFree(value);
                });
                aspect.before(this._labelLangString, "onChange", lang.hitch(this, "_setLabelMap"));
                on(this._addLabel, "click", lang.hitch(this._labelLangString, this._labelLangString.add));
                aspect.before(this._descLangString, "onChange", lang.hitch(this, "_setDescriptionMap"));
                on(this._addDesc, "click", lang.hitch(this._descLangString, this._descLangString.add));
                var self = this;
                this.menu = new Menu({
                    targetNodeIds: [this.tree.id],
                    selector: ".dijitTreeNode"
                });
                this.menu.addChild(new MenuItem({
                    label: "New Choice",
                    iconClass: "dijitIconFile",
                    onClick: function() {
                        var tn = registry.byNode(this.getParent().currentTarget);
                        var treeModel = self.tree.get("model");
                        var newChoice = {value: ""+(new Date()).getTime()};
                        treeModel.newItem(newChoice, tn.item);
                        var newtn = self.tree.getNodesByItem(newChoice)[0];
                        tn.expand();
                        self.tree.focusNode(newtn);
                        self.tree.set("selectedItem", newChoice);
                        self._editChoice(newChoice);
                    }
                }));
                this.menu.addChild(new MenuItem({
                    label: "Remove choice",
                    iconClass: "dijitEditorIcon dijitEditorIconDelete",
                    onClick: function() {
                        var tn = registry.byNode(this.getParent().currentTarget);
                        var treeModel = self.tree.get("model");
                        treeModel.removeItem(tn.item, tn.getParent().item);
                        self._choicesChanged();
                    }
                }));

                this.menu.startup();
            }

            this._inlineDijit.set("checked", this.item.getStaticChoices() != null);
            this._ontologyDijit.set("value", this.item.getOntologyUrl() || "");
            this._ppDijit.set("value", this.item.getParentProperty() || "");
            this._ppinvDijit.set("checked", this.item.isParentPropertyInverted() || false);
            this._hpDijit.set("value", this.item.getHierarchyProperty() || "");
            this._hpinvDijit.set("checked", this.item.isHierarchyPropertyInverted() || false);
        },
        resize: function () {
            this.inherited("resize", arguments);
            if (this._bcDijit) {
                this._bcDijit.resize();
            }
        },
        _choicesChanged: function() {
            this.tree.get("model").onChange(this._choice);
            this.onChange();
        },
        onChange: function() {
        },
        _editChoice: function(choice) {
            var model = this.tree.get("model");
            if (choice === model.root) {
                return;
            }
            this._choice = choice;
            this._valueDijit.set("value", choice.value);
            this._labelLangString.setMap(choice.label);
            this._descLangString.setMap(choice.description);
            this._selectable.set("checked", choice.selectable !== false);
        },
        _changeInline: function() {
            if (this._inlineDijit.get("checked")) {
                this.item.setStaticChoices(this.choices);
                style.set(this.tree.domNode, "display", "");
                style.set(this._controlDijit.domNode, "height", "25px");
                domClass.add(this._controlDijit.domNode, "inlineState");
                this._bcDijit.resize();
            } else {
                this.item.setStaticChoices();
                style.set(this.tree.domNode, "display", "none");
                style.set(this._controlDijit.domNode, "height", "45%");
                domClass.remove(this._controlDijit.domNode, "inlineState");
                this._bcDijit.resize();
            }
        },
        _changeOntologyUrl: function() {
            this.item.setOntologyUrl(this._ontologyDijit.get("value"));
        },
        _changePProperty: function() {
            this.item.setParentProperty(this._ppDijit.get("value"));
        },
        _changePPI: function() {
            this.item.setParentPropertyInverted(this._ppinvDijit.get("checked"));
        },
        _changeHProperty: function() {
            this.item.setHierarchyProperty(this._hpDijit.get("value"));
        },
        _changeHPI: function() {
            this.item.setHierarchyPropertyInverted(this._hpinvDijit.get("checked"));
        },
        _changeSelectable: function() {
            if (this._selectable.get("checked") === false) {
                this._choice.selectable = false;
            } else {
                delete this._choice.selectable;
            }
            this._choicesChanged();
        },
        _setLabelMap: function(map) {
            this._choice.label = map;
            this._choicesChanged();
        },
        _setDescriptionMap: function(map) {
            this._choice.description = map;
            this._choicesChanged();
        },
        _changeValue: function() {
            if (this._valueTimer) {
                clearTimeout(this._valueTimer);
            }
            this._valueTimer = setTimeout(lang.hitch(this, function() {
                delete this._valueTimer;
                if (this._destroyed) {
                    return;
                }
                var val = this._valueDijit.get("value");
                if (val != null) {
                    var model = this.tree.get("model");
                    model.renameItem(this._choice, val);
                }
                this._choicesChanged();
            }), 200);
        }
   });
});