/*global define*/
define(["dojo/_base/declare",
	"dojo/_base/lang",
  "dojo/dom-class",
  "jquery",
  "bmddtp",
  "di18n/locale",
  "di18n/moment",
  "rdforms/view/bootstrap/DateTimeBase",
  "dojo/text!./DateTimeMDTemplate.html"
], function(declare, lang, domClass, jquery, bmddtp, locale, moment, DateTimeBase, template) {
    /**
     * A Date and time picker.
     */
    var DTMD = declare([DateTimeBase], {
        templateString: template,

        //===================================================
        // Inherited methods
        //===================================================

        initDatePicker: function() {
          this.$datepicker = jquery(this.cal).bootstrapMaterialDatePicker({
            time: false,
            date: true,
            triggerEvent: 'none',
            switchOnClick: true,
          });

          jquery(this.dateButton).click(() => {
            this.$datepicker.bootstrapMaterialDatePicker("_fireCalendar");
          });
          var updateDate = lang.hitch(this, function(evt, m) {
            this.setDateInBinding(m.toDate());
          });
          this.$datepicker.on('change', updateDate).on('dateSelected', lang.hitch(this, function() {
            this.$datepicker.bootstrapMaterialDatePicker("setElementValue");
          }));

          if (!this.item.isEnabled()) {
            this.$datepicker.prop("disabled", true);
          }
          // time
          this.$timepicker = jquery(this.timeInput).bootstrapMaterialDatePicker({
            format:'HH:mm',
            time: true,
            date: false,
            triggerEvent: 'none',
            switchOnClick: true,
          });

          jquery(this.timeButton).click(() => {
            this.$timepicker.bootstrapMaterialDatePicker("_fireCalendar");
          });
          var updateDate = lang.hitch(this, function(evt, m) {
            this.setDateInBinding(m.toDate());
          });
          this.$timepicker.on('change', updateDate).on('dateSelected', lang.hitch(this, function() {
            this.$timepicker.bootstrapMaterialDatePicker("setElementValue");
          }));

          if (!this.item.isEnabled()) {
            this.$timepicker.prop("disabled", true);
          }

        },
        setDateInPicker: function(d) {
            this.$datepicker.bootstrapMaterialDatePicker("setDate", d);
            this.$timepicker.bootstrapMaterialDatePicker("setTime", d);
        },
    });

    DateTimeBase.register(DTMD);
    return DTMD;
});