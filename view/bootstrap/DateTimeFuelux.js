/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang",
    "jquery",
    "fuelux/datepicker",
    "rdforms/view/bootstrap/DateTimeBase",
    "dojo/text!./DateTimeFueluxTemplate.html"
], function(declare, lang, jquery, datepicker, DateTimeBase, template) {
    /**
     * A Date and time picker.
     */
    var DateTimeFuelux = declare([DateTimeBase], {
        templateString: template,

        //===================================================
        // Inherited methods
        //===================================================

        initDatePicker: function() {
            var updateDate = lang.hitch(this, function(evt, d) {
                this.setDateInBinding(d);
            });
            this.$datepicker = jquery(this.cal).datepicker({
                allowPastDates: true,
                date: null
            }).on('changed.fu.datepicker', updateDate)
                .on('dateClicked.fu.datepicker', updateDate);

            if (!this.item.isEnabled()) {
                this.$datepicker.datepicker("disabled");
            }
        },
        setDateInPicker: function(d) {
            this.$datepicker.datepicker("setDate", d);
        }
    });

    DateTimeBase.register(DateTimeFuelux);
    return DateTimeFuelux;
});