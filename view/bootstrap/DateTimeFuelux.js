/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang",
    "dojo/dom-class",
    "jquery",
    "fuelux/datepicker",
    "di18n/locale",
    "moment",
    "rdforms/view/bootstrap/DateTimeBase",
    "dojo/text!./DateTimeFueluxTemplate.html"
], function(declare, lang, domClass, jquery, datepicker, locale, moment, DateTimeBase, template) {
    /**
     * A Date and time picker.
     */
    var DateTimeFuelux = declare([DateTimeBase], {
        templateString: template,

        //===================================================
        // Inherited methods
        //===================================================

        initDatePicker: function() {
            var loca = locale.get();
            moment.locale(loca);
            var updateDate = lang.hitch(this, function(evt, d) {
                this.setDateInBinding(d);
            });
            var month, months = moment.months();
            for (i=0;i<12;i++) {
                month = months[i];
                month = month.charAt(0).toUpperCase() + month.slice(1);
                jquery(this.months).find('span[data-month="' + i + '"]').text(month);
            }
            var days = moment.weekdaysMin();
            jquery(this.days).find('th').each(function(idx) {
                jquery(this).text(days[idx]);
            });
            jquery(this.today).text(this.messages.today);

            this.$datepicker = jquery(this.cal).datepicker({
                allowPastDates: true,
                date: null,
                momentConfig: {
                    culture: loca,
                    format: 'L'
                }
            });
            var $input = this.$datepicker.find('input');

            this.$datepicker.on('changed.fu.datepicker', updateDate
            ).on('dateClicked.fu.datepicker', lang.hitch(this, function(evt, d) {
                updateDate(evt, d);
                $input.blur();
            }));
            $input.on('blur.fu.datepicker', lang.hitch(this, function() {
                this.blurringTime = new Date().getTime();
            }));

            if (!this.item.isEnabled()) {
                this.$datepicker.datepicker("disabled");
            }
        },
        setDateInPicker: function(d) {
            this.$datepicker.datepicker("setDate", d);
        },
        datetimeButtonClick: function() {
            if (new Date().getTime() - this.blurringTime < 200) {
                return;
            }
            var $input = this.$datepicker.find('input');
            if (domClass.contains(this.menuBlock, "open")) {
                $input.blur();
            } else {
                $input.focus();
            }
        }
    });

    DateTimeBase.register(DateTimeFuelux);
    return DateTimeFuelux;
});