/* global define*/
define(['dojo/_base/declare',
  'dojo/_base/lang',
  'jquery',
  'rdforms/view/bootstrap/DateTimeBase',
  'dojo/text!./DateTimeBootstrapDatepickerTemplate.html',
], (declare, lang, jquery, DateTimeBase, template) => {
    /**
     * A Date and time picker.
     */
  const DateTimeBootstrapDatepicker = declare([DateTimeBase], {
    templateString: template,

        //= ==================================================
        // Inherited methods
        //= ==================================================

    initDatePicker() {
      const updateDate = lang.hitch(this, (/* evt */) => {
        this.setDateInBinding(this.$datepickerField.datepicker('getDate'));
      });
      this.$datepicker = jquery(this.cal);
      this.$datepickerField = jquery(this.datepickerField)
                .datepicker().on('changeDate', updateDate);

      if (!this.item.isEnabled()) {
        this.$datepicker.datepicker('disabled');
      }
    },
    setDateInPicker(d) {
      this.$datepickerField.datepicker('update', d);
    },
  });

  DateTimeBase.register(DateTimeBootstrapDatepicker);
  return DateTimeBootstrapDatepicker;
});
