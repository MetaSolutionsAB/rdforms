/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang", 
	"dijit/_WidgetsInTemplateMixin",
    "jquery",
	"dojo/text!./DurationEditorTemplate.html",
	"./DurationPresenter"
], function(declare, lang, _WidgetsInTemplateMixin, jquery, template, DurationPresenter) {

    return declare([DurationPresenter, _WidgetsInTemplateMixin], {
        templateString: template,
        regex: /^([\-\+])?P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+(?:\.[0-9]+)?)?S)?)?$/,

        buildRendering: function () {
            this.inherited("buildRendering", arguments);
            this.$years = jquery(this.yearsInput);
            this.$months = jquery(this.monthsInput);
            this.$days = jquery(this.daysInput);
            this.$hours = jquery(this.hoursInput);
            this.$minutes = jquery(this.minutesInput);
            var f = lang.hitch(this, function() {
                this.onChange(this.get("value"));
            });
            this.$years.change(f);
            this.$months.change(f);
            this.$days.change(f);
            this.$hours.change(f);
            this.$minutes.change(f);
        },

        onChange: function () {
        },

        _setValueAttr: function(value) {
            var arr = this.regex.exec(value);
            if (arr != null) {
                if (arr[2] != null) {
                    this.$years.val(arr[2]);
                }
                if (arr[3] != null) {
                    this.$months.val(arr[3]);
                }
                if (arr[4] != null) {
                    this.$days.val(arr[4]);
                }
                if (arr[5] != null) {
                    this.$hours.val(arr[5]);
                }
                if (arr[6] != null) {
                    this.$minutes.val(arr[6]);
                }
            }
        },

        _getValueAttr: function () {
            //this.get("years");
            var years = this.$years.val();
            var months = this.$months.val();
            var days = this.$days.val();
            var hours = this.$hours.val();
            var minutes = this.$minutes.val();
            if (years || months || days || hours || minutes) {
                var str = "P" + (years ? "" + years + "Y" : "")
                    + (months ? "" + months + "M" : "")
                    + (days ? "" + days + "D" : "");
                if (hours || minutes) {
                    str = str + "T"
                    + (hours ? "" + hours + "H" : "")
                    + (minutes ? "" + minutes + "M" : "");
                }
                return str;
            }
            return null;
        }
    });
});