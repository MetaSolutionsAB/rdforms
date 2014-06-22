/*global define*/
define([
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/aspect",
	"dojo/on",
    "dojo/json",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    "dijit/registry",
    "dijit/form/ComboBox",
    "rdforms/formulator/LangString",
    "rdforms/template/Item",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "dijit/form/ToggleButton", //For template
    "dojo/dnd/Target",
	"dojo/text!./ItemEditorTemplate.html"
], function(lang, array, declare, aspect, on, json, construct, _WidgetBase, registry, ComboBox, LangString,
            Item, _TemplatedMixin, _WidgetsInTemplateMixin, ToggleButton, Target, template) {


    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        //===================================================
        // Public attributes
        //===================================================
        itemStore: null,
        storeManager: null,

        //===================================================
        // Inherited attributes
        //===================================================
        templateString: template,

        //===================================================
        // Inherited methods
        //===================================================
        postCreate: function() {
            this.inherited("postCreate", arguments);
            this.lock = true;
            var readOnly = this.item.getBundle().isReadOnly()
            this._styles2Dijit = {};
            var styles= this.item.getAvailableStyles();
            var f = lang.hitch(this, this._changeStyles);
            for (var i=0;i< styles.length;i++) {
                var style = styles[i];
                this._styles2Dijit[style] = new ToggleButton({
                    showLabel: true,
                    disabled: readOnly,
                    checked: this.item.hasStyle(style),
                    onChange: f,
                    label: style,
                    iconClass:'dijitCheckBoxIcon'
                }, construct.create("div", null, this._stylesWrapper));
            }

            this._typeDijit.set("value", this.item.getType(true) || "");
            this._extendsDijit.set("value", this.item.getExtends(true) || "");
            this._propDijit.set("value", this.item.getProperty(true) || "");
            this._ntDijit.set("value", this.item.getNodetype(true) || "");
            this._dtDijit.set("value", this.item.getDatatype(true) || "");
            this._patternDijit.set("value", this.item.getPattern(true) || "");
            var card = this.item.getCardinality(true);
            this._minDijit.set("value", card.min || "");
            this._prefDijit.set("value", card.pref || "");
            this._maxDijit.set("value", card.max || "");
            this._constrDijit.set("value", json.stringify(this.item.getConstraints(true) || {}));
            this._clsDijit.set("value", this.item.getClasses(true).join(", "));
            setTimeout(lang.hitch(this, function() {
                this.lock = false;
            }), 200);
            if (readOnly) {
                array.forEach(["_idDijit", "_typeDijit", "_extendsDijit", "_propDijit", "_ntDijit", "_dtDijit",
                    "_patternDijit", "_labelLangString", "_descLangString", "_minDijit", "_prefDijit", "_maxDijit",
                    "_constrDijit", "_clsDijit"], function(wid) {
                    this[wid].set("disabled", "true");
                }, this);
            } else {
                var id = this.item.getId(true);
                if (id == null) {
                    this._idDijit.set("disabled", "true");
                } else {
                    this._idDijit.set("value", id);
                }
                this._dtDijit.set("disabled", this.item.getNodetype(true) !== "DATATYPE_LITERAL");
                this._patternDijit.set("disabled", this.item.getNodetype(true) !== "ONLY_LITERAL");
                aspect.before(this._labelLangString, "onChange", lang.hitch(this.item, "setLabelMap"));
                aspect.after(this._labelLangString, "onChange", lang.hitch(this, this.itemChanged));
                on(this._addLabel, "click", lang.hitch(this._labelLangString, this._labelLangString.add));
                aspect.before(this._descLangString, "onChange", lang.hitch(this.item, "setDescriptionMap"));
                aspect.after(this._descLangString, "onChange", lang.hitch(this, this.itemChanged));
                on(this._addDesc, "click", lang.hitch(this._descLangString, this._descLangString.add));
                this._constrDijit.set("disabled", this.item.getType(true) === "text" || (this.item.getNodetype(true) !== "URI" && this.item.getNodetype(true) !== "RESOURCE"));
                this._constrDijit.validator = function(value, constraints){
                    try {
                        if (value !== "{}" && value !== "") {
                            var obj = json.parse(value);
                        }
                        return true;
                    } catch(e) {
                        return false;
                    }
                }

                this._extends_target.checkAcceptance = function(source, nodes) {
                    if (nodes.length === 1) {
                        var tn = registry.getEnclosingWidget(nodes[0]);
                        return tn.item instanceof Item;
                    }

                    return false;
                };
                this._extends_target.onDrop = lang.hitch(this, function(source, nodes, copy) {
                    var tn = registry.getEnclosingWidget(nodes[0]);
                    this._extendsDijit.set("value", tn.item.getId());
                });
            }
            this._labelLangString.setMap(this.item.getLabelMap(true));
            this._descLangString.setMap(this.item.getDescriptionMap(true));

//            this._styDijit.set("value", json.stringify(this.item.getStyles() || {}));
        },
        itemChanged: function() {
            this.storeManager.itemChanged(this.item);
        },
        //===================================================
        // Private methods
        //===================================================
        _addLangString: function(node, onChange) {
        },
        _changeId: function() {
            if (this.lock) {
                return;
            }
            if (this._idTimer) {
                clearTimeout(this._idTimer);
            }
            this._idTimer = setTimeout(lang.hitch(this, function() {
                delete this._idTimer;
                if (this._destroyed) {
                    return;
                }
                var from = this.item.getId(), to = this._idDijit.get("value");
                if (from !== to) {
                    try {
                        this.itemStore.renameItem(from, to);
                        this.itemChanged();
                    } catch (e) {
                        //Silently ignore non-acceptable changes
                    }
                }
            }), 200);
        },
        _changeExtends: function() {
            if (this.lock) {
                return;
            }
            this.item.setExtends(this._extendsDijit.get("value"));
            this.itemChanged();
        },
        _changeProperty: function() {
            if (this.lock) {
                return;
            }
            this.item.setProperty(this._propDijit.get("value"));
            this.storeManager.itemChanged(this.item);
        },
        _changeNT: function() {
            if (this.lock) {
                return;
            }
            var nt = this._ntDijit.get("value");
            this.item.setNodetype(nt);
            this._dtDijit.set("disabled", nt !== "DATATYPE_LITERAL");
            this._patternDijit.set("disabled", nt !== "ONLY_LITERAL");
            this._constrDijit.set("disabled", this.item.getType(true) === "text" || (this.item.getNodetype(true) !== "URI" && this.item.getNodetype(true) !== "RESOURCE"));
            this.itemChanged();
        },
        _changeDT: function() {
            if (this.lock) {
                return;
            }
            this.item.setDatatype(this._dtDijit.get("value"));
            this.itemChanged();
        },
        _changePattern: function() {
            if (this.lock) {
                return;
            }
            this.item.setPattern(this._patternDijit.get("value"));
            this.itemChanged();
        },
        _changeCard: function() {
            if (this.lock) {
                return;
            }
            var card = {
                "min": this._minDijit.get("value") || 0,
                "pref": this._prefDijit.get("value") || 0,
                "max": this._maxDijit.get("value") || -1
            }
            if (card.max === -1) {
                delete card.max;
            }
            this.item.setCardinality(card);
            this.itemChanged();
        },
        _changeConstr: function() {
            if (this.lock) {
                return;
            }
            try {
                var val = this._constrDijit.get("value");
                if (val === "{}" || val === "") {
                    this.item.setConstraints();
                } else {
                    var obj = json.parse(val);
                    this.item.setConstraints(obj);
                }
                this.itemChanged();
            } catch(e) {
            }
        },
        _changeCls: function() {
            if (this.lock) {
                return;
            }
            var val = this._clsDijit.get("value");
            var arr = val.replace(/[,;:] ?/, " ").split(" ");
            if (arr.length === 1 && arr[0] === "") {
                this.item.setClasses();
            } else {
                this.item.setClasses(arr);
            }
            this.itemChanged();
        },
        _changeStyles: function() {
            if (this.lock) {
                return;
            }
            var styles= this.item.getAvailableStyles();
            var arr = [];
            for (var i=0;i< styles.length;i++) {
                var style = styles[i];
                if (this._styles2Dijit[style].get("checked")) {
                    arr.push(style);
                }
            }
            this.item.setStyles(arr);
            this.itemChanged();
        }
    });
});