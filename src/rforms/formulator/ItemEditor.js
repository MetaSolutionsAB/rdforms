/*global define*/
define([
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/aspect",
	"dojo/on",
    "dojo/json",
    "dojo/dom-construct",
    "./LangString",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/form/TextBox", //For template
	"dijit/form/NumberTextBox", //For template
	"dijit/form/Textarea", //For template
    "dijit/form/ValidationTextBox", //For template
    "dijit/form/Select", //For template
    "dijit/form/ComboBox", //For template
    "dijit/form/ToggleButton", //For template
	"dojo/text!./ItemEditorTemplate.html"
], function(lang, declare, aspect, on, json, construct, LangString, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
            TextBox, NumberTextBox, Textarea, ValidationTextBox, Select, ComboBox, ToggleButton, template) {


    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
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
            this._styles2Dijit = {};
            var styles= this.item.getAvailableStyles();
            var f = lang.hitch(this, this._changeStyles);
            for (var i=0;i< styles.length;i++) {
                var style = styles[i];
                this._styles2Dijit[style] = new ToggleButton({
                    showLabel: true,
                    checked: this.item.hasStyle(style),
                    onChange: f,
                    label: style,
                    iconClass:'dijitCheckBoxIcon'
                }, construct.create("div", null, this._stylesWrapper));
            }

            this._idDijit.set("value", this.item.getId() || "");
            this._typeDijit.set("value", this.item.getType() || "");
            this._extendsDijit.set("value", this.item.getExtends() || "");
            this._propDijit.set("value", this.item.getProperty() || "");
            this._ntDijit.set("value", this.item.getNodetype() || "");
            this._dtDijit.set("value", this.item.getDatatype() || "");
            this._dtDijit.set("disabled", this.item.getNodetype() !== "DATATYPE_LITERAL");
            this._labelLangString.setMap(this.item.getLabelMap());
            aspect.before(this._labelLangString, "onChange", lang.hitch(this.item, "setLabelMap"));
            on(this._addLabel, "click", lang.hitch(this._labelLangString, this._labelLangString.add));
            this._descLangString.setMap(this.item.getDescriptionMap());
            aspect.before(this._descLangString, "onChange", lang.hitch(this.item, "setDescriptionMap"));
            on(this._addDesc, "click", lang.hitch(this._descLangString, this._descLangString.add));
            var card = this.item.getCardinality();
            this._minDijit.set("value", card.min || "");
            this._prefDijit.set("value", card.pref || "");
            this._maxDijit.set("value", card.max || "");
            this._constrDijit.set("value", json.stringify(this.item.getConstraints() || {}));
            this._constrDijit.set("disabled", this.item.getType() === "text" || (this.item.getNodetype() !== "URI" && this.item.getNodetype() !== "RESOURCE"));
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
                this._clsDijit.set("value", this.item.getClasses().join(", "));
//            this._styDijit.set("value", json.stringify(this.item.getStyles() || {}));
        },
        //===================================================
        // Private methods
        //===================================================
        _addLangString: function(node, onChange) {

        },
        _changeId: function() {
            this.item.setId(this._idDijit.get("value")); //Make sure references are not broken.
        },
        _changeExtends: function() {
            this.item.setExtends(this._extendsDijit.get("value"));
        },
        _changeProperty: function() {
            this.item.setProperty(this._propDijit.get("value"));
        },
        _changeNT: function() {
            var nt = this._ntDijit.get("value");
            this.item.setNodetype(nt);
            this._dtDijit.set("disabled", nt !== "DATATYPE_LITERAL");
            this._constrDijit.set("disabled", this.item.getType() === "text" || (this.item.getNodetype() !== "URI" && this.item.getNodetype() !== "RESOURCE"));
        },
        _changeDT: function() {
            this.item.setDatatype(this._dtDijit.get("value"));
        },
        _changeCard: function() {
            var card = {
                "min": this._minDijit.get("value") || 0,
                "pref": this._prefDijit.get("value") || 0,
                "max": this._maxDijit.get("value") || -1
            }
            if (card.max === -1) {
                delete card.max;
            }
            this.item.setCardinality(card);
        },
        _changeConstr: function() {
            try {
                var val = this._constrDijit.get("value");
                if (val === "{}" || val === "") {
                    this.item.setConstraints();
                } else {
                    var obj = json.parse(val);
                    this.item.setConstraints(obj);
                }
            } catch(e) {
            }
        },
        _changeCls: function() {
            var val = this._clsDijit.get("value");
            var arr = val.replace(/[,;:] ?/, " ").split(" ");
            this.item.setClasses(arr);
        },
        _changeStyles: function() {
            var styles= this.item.getAvailableStyles();
            var arr = [];
            for (var i=0;i< styles.length;i++) {
                var style = styles[i];
                if (this._styles2Dijit[style].get("checked")) {
                    arr.push(style);
                }
            }
            this.item.setStyles(arr);
        }
    });
});