/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang",
    "dojo/date/stamp",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
	"fuelux/datepicker",
    "jquery",
    "bootstrap/tooltip",
    "bootstrap/popover",
    "dojo/text!./DateTimeTemplate.html"
], function(declare, lang, stamp, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
            datepicker, jquery, tooltip, popover, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,

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
            var updateDate = lang.hitch(this, function(evt, d) {
                this._valid = true;
                this._date.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
                var str = stamp.toISOString(d);
                if (this._excludeTime) {
                    this.binding.setValue(str.substring(0,str.indexOf('T')));
                } else {
                    this.binding.setValue(str);
                    this.$timeInput.prop("disabled", false);
                }
            });
            this.$datepicker = jquery(this.cal).datepicker({
                allowPastDates: true,
                date: null
            }).on('changed.fu.datepicker', updateDate)
                .on('dateClicked.fu.datepicker', updateDate);

            if (!this.item.isEnabled()) {
                this.$datepicker.datepicker("disabled");
            }

            //Time input
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

            //Year input
            this.$yearInput = jquery(this.yearInput).attr("pattern", "^-?[0-9][0-9][0-9][0-9]$")
                .change(lang.hitch(this, function() {
                    var val = this.$yearInput.val();
                    this._date.setYear(parseInt(val));
                    this.binding.setValue(val);
                }));

            //Date control
            this.$dateControl = jquery(this.dateControl).change(lang.hitch(this, function() {
                var val = this.$dateControl.val();
                this["_show"+val]();
            }));

            this._binding2Gui();
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
            this.$timeInput.hide();
            this.$datepicker.show();
            if (this._valid) {
                this.$datepicker.datepicker("setDate", this._date);
                var str = stamp.toISOString(this._date);
                !this._firstTime && this.binding.setValue(str.substring(0,str.indexOf('T')));
            } else {
                this.$datepicker.datepicker("setDate", null);
            }
        },
        _showDateTime: function() {
            this._excludeTime = false;
            this.$yearInput.hide();
            this.$timeInput.show();
            this.$datepicker.show();

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
                this.$datepicker.datepicker("setDate", this._date);
                !this._firstTime && this.binding.setValue(stamp.toISOString(this._date));
            } else {
                this.$datepicker.datepicker("setDate", null);
                this.$timeInput.prop("disabled", true);
                this.$timeInput.val("");
            }
        },
        _showYear: function() {
            this.$yearInput.show();
            this.$timeInput.hide();
            this.$datepicker.hide();

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
});