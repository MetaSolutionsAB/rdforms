/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang",
    "jquery",
    "rdforms/view/bootstrap/DateTimeBase",
    "dojo/text!./DateTimeBootstrapDatepickerTemplate.html"
], function(declare, lang, jquery, DateTimeBase, template) {
    /**
     * A Date and time picker.
     */
    var DateTimeBootstrapDatepicker = declare([DateTimeBase], {
        templateString: template,

        //===================================================
        // Inherited methods
        //===================================================

        initDatePicker: function() {
            var updateDate = lang.hitch(this, function(evt) {
                this.setDateInBinding(this.$datepickerField.datepicker('getDate'));
            });
            this.$datepicker = jquery(this.cal);
            this.$datepickerField = jquery(this.datepickerField)
                .datepicker().on("changeDate", updateDate);

            if (!this.item.isEnabled()) {
                this.$datepicker.datepicker("disabled");
            }
        },
        setDateInPicker: function(d) {
            this.$datepickerField.datepicker("update", d);
        }
    });

    DateTimeBase.register(DateTimeBootstrapDatepicker);
    return DateTimeBootstrapDatepicker;
});