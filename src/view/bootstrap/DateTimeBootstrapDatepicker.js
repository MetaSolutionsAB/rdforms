import DateTimeBase from './DateTimeBase';
import templateString from './DateTimeBootstrapDatepickerTemplate.html';
import declare from 'dojo/_base/declare';

/**
 * A Date and time picker.
 */
const DateTimeBootstrapDatepicker = declare([DateTimeBase], {
  templateString,

  //= ==================================================
  // Inherited methods
  //= ==================================================

  initDatePicker() {
    const updateDate = (/* evt */) => this.setDateInBinding(this.$datepickerField.datepicker('getDate'));
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
export default DateTimeBootstrapDatepicker;
