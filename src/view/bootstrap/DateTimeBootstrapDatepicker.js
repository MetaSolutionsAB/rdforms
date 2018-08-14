import DateTimeBase from './DateTimeBase';
import template from './DateTimeBootstrapDatepickerTemplate.html';

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
], (declare, lang) => {
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
