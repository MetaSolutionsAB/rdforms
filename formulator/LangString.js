/*global define*/
define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dijit/_Widget",
    "dijit/form/TextBox",
    "dijit/form/Textarea",
    "dijit/form/ComboBox",
    "dojo/store/Memory"
], function(declare, lang, domClass, construct, attr, Widget, TextBox, Textarea, ComboBox, Memory) {
    return declare(Widget, {
        buildRendering: function() {
            this.domNode = this.srcNodeRef || construct.create("div");
            domClass.add(this.domNode, "langStringArr");
            var timer;
            this._onChange = lang.hitch(this, function() {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(lang.hitch(this, function() {
                        timer = null;
                        this.onChange(this.getMap());
                    }), 200);
            });
            this._comboChoiceStore = new Memory({
                data: [
                    {id:"en"},
                    {id:"sv"},
                    {id:"de"},
                    {id:"es"},
                    {id:"fr"},
                    {id:"it"}
                ]
            });
        },
        onChange: function(map) {
        },
        setMap: function(map) {
            map = map || {};
            if (this._rows) {
                for (var i=0;i<this._rows.length;i++) {
                    this._rows[i].lang.destroy();
                    this._rows[i].text.destroy();
                }
                this._rows = [];
                attr.set(this.domNode, "innerHTML", "");
            }
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    this._add(map[key], key);
                }
            }
            if (this._rows == null || this._rows.length == 0) {
                this._add("", "");
            }
        },
        getMap: function() {
            var map = {};
            for(var i=0;i<this._rows.length;i++) {
                var row = this._rows[i];
                var l = row.lang.get("value") || "";
                var t = row.text.get("value");
                if (t != null && t !== "") {
                    map[l] = t;
                }
            }
            return map;
        },
        add: function() {
            this._add("", "");
        },
        _add: function(s, l) {
            var row = construct.create("div", {"class": "langString"}, this.domNode);
            var textNode = construct.create("div", {"class": "langStringString"}, row);
            var langNode = construct.create("div", {"class": "langStringLang"}, row);
            var text;
            if (this.multiline) {
                text = Textarea({value: s, disabled: this.get("disabled"), onChange: this._onChange, intermediateChanges: true}, construct.create("div", null, textNode));
                text.resize();
            } else {
                text = TextBox({value: s, disabled: this.get("disabled"), onChange: this._onChange, intermediateChanges: true}, construct.create("div", null, textNode));
            }
            var lang = ComboBox({value: l, disabled: this.get("disabled"), onChange: this._onChange, store: this._comboChoiceStore, searchAttr: "id"}, construct.create("div", null, langNode));
            if (this._rows == null) {
                this._rows = [];
            }
            this._rows.push({row: row, text: text, lang: lang});
        }
    });
});