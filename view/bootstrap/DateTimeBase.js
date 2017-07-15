/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang",
    "dojo/date/stamp",
    "rdforms/view/renderingContext",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "jquery"
], function(declare, lang, stamp, renderingContext, _WidgetBase, _TemplatedMixin,
            _WidgetsInTemplateMixin, jquery) {
    var DateTimeBase = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

        //===================================================
        // Public attributes
        //===================================================
        binding: null,
        item: null,

        //===================================================
        // Private attributes
        //===================================================
        _date: null,
        _valid: false,
        _excludeTime: true,

        //===================================================
        // Inherited methods
        //===================================================
        postCreate: function () {
            this.inherited("postCreate", arguments);

            //Datepicker
            this.initDatePicker();

            //Time input, assumes a this.timeInput input node
            var timePattern = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$";
            this.$timeInput = jquery(this.timeInput).attr("pattern", "^([0-1][0-9]|2[0-3]):[0-5][0-9]$")
                .change(lang.hitch(this, function() {
                    var val = this.$timeInput.val();
                    if (typeof this.$timeInput[0].checkValidity === "function") {
                        if (!this.$timeInput[0].checkValidity()) {
                            return;
                        }
                    } else if ((new RegExp(timePattern)).test(val)) {
                        return;
                    }

                    this._date.setHours(parseInt(val.substr(0,2)), parseInt(val.substr(3,2)));
                    this.binding.setValue(stamp.toISOString(this._date));
                }));

            //Year input, assumes a this.yearInput input node
            this.$yearInput = jquery(this.yearInput).attr("pattern", "^-?[0-9][0-9][0-9][0-9]$")
                .change(lang.hitch(this, function() {
                    var val = this.$yearInput.val();
                    this._date.setYear(parseInt(val));
                    this.binding.setValue(val);
                }));

            //Date control, assumes this.dateControl select node
            this.$dateControl = jquery(this.dateControl).change(lang.hitch(this, function() {
                var val = this.$dateControl.val();
                this["_show"+val]();
            }));

            this._binding2Gui();
        },

        initDatePicker: function() {
        },
        setDateInPicker: function(d) {
        },
        setDateInBinding: function(d) {
            this._valid = true;
            this._date.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
            var str = stamp.toISOString(d);
            if (this._excludeTime) {
                this.binding.setValue(str.substring(0,str.indexOf('T')));
            } else {
                this.binding.setValue(str);
                this.$timeInput.prop("disabled", false);
            }
        },

        clear: function() {
            this._valid = false;
            jquery(this.domNode).find("input").val("");
        },

        //===================================================
        // Private methods
        //===================================================

        _binding2Gui: function() {
            this._firstTime = true;
            var data = this.binding.getValue();
            this._valid = data != null && data != "";
            if (this._valid) {
                if (data.match(/.*Z$/)) {
                    data = data.substr(0, data.length-1);
                }
                this._date = stamp.fromISOString(data);
                this._valid = this._date != null;
            }
            this._date = this._date || new Date("2000");
            if (this._valid) {
                if (/^\d{4}$/.test(data)) {
                    this.$dateControl.val("Year");
                    this._showYear();
                } else if (/T/.test(data) && data.indexOf("T00:00:00")=== -1) {
                    this.$dateControl.val("DateTime");
                    this._showDateTime();
                } else {
                    this.$dateControl.val("Date");
                    this._showDate();
                }
            } else {
                this._showDate();
            }
            this._firstTime = false;
        },

        _showDate: function() {
            this._excludeTime = true;
            this.$yearInput.hide();
            this.$timeInput.parent().hide();
            this.$datepicker.parent().show();
            if (this._valid) {
                this.setDateInPicker(this._date);
                var str = stamp.toISOString(this._date);
                !this._firstTime && this.binding.setValue(str.substring(0,str.indexOf('T')));
            } else {
                this.setDateInPicker(null);
            }
        },
        _showDateTime: function() {
            this._excludeTime = false;
            this.$yearInput.hide();
            this.$timeInput.parent().show();
            this.$datepicker.parent().show();

            if (this._valid) {
                if (this._date.getHours() !== 0 || this._date.getMinutes() !== 0) {
                    var h = this._date.getHours();
                    h = h <=9 ? "0"+h: h;
                    var m = this._date.getMinutes();
                    m = m <=9 ? "0"+m: m;
                    this.$timeInput.val(h+":"+m);
                } else {
                    this.$timeInput.val("");
                }
                this.setDateInPicker(this._date);
                !this._firstTime && this.binding.setValue(stamp.toISOString(this._date));
            } else {
                this.setDateInPicker(null);
                this.$timeInput.prop("disabled", true);
                this.$timeInput.val("");
            }
        },
        _showYear: function() {
            this.$yearInput.show();
            this.$timeInput.parent().hide();
            this.$datepicker.parent().hide();

            if (this._valid) {
                this.$yearInput.val(this._date.getFullYear());
                !this._firstTime && this.binding.setValue(""+this._date.getFullYear());
            } else {
                this.$yearInput.val("");
            }
        },
        _setValueAttr: function(v) {
            this.binding.setValue(v);
        }
    });

    DateTimeBase.register = function(DTCls) {
        //Editor for dates and dates with time.
        var dateEditor = function(fieldDiv, binding, context) {
            var dt = new DTCls({
                messages: context.view.messages,
                binding: binding,
                item: binding.getItem()
            }, jquery("<div>").appendTo(fieldDiv)[0]);
            context.clear = function() {
                dt.clear();
            }
        };
        var editors = renderingContext.editorRegistry;
        editors.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#date").register(dateEditor);
        editors.itemtype("text").datatype("http://purl.org/dc/terms/W3CDTF").register(dateEditor);
    };

    return DateTimeBase;
});