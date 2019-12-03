import 'bootstrap-datepicker/dist/js/bootstrap-datepicker';
import declare from 'dojo/_base/declare';
import jquery from 'jquery';
import DateTimeBase from './DateTimeBase';
import templateString from './DateTimeBootstrapDatepickerTemplate.html';

/**
 * A Date and time picker.
 */
const DateTimeBootstrapDatepicker = declare([DateTimeBase], {
  templateString,

  //= ==================================================
  // Inherited methods
  //= ==================================================

  initDatePicker() {
    this.$datepicker = jquery(this.cal).datepicker({
      autoclose: true,
    });
    const updateDate = (/* evt */) => {
      const selectedDate = this.$datepicker.datepicker('getDate');
      const newDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        this._date.getHours(),
        this._date.getMinutes(),
        this._date.getSeconds(),
        this._date.getMilliseconds(),
      );

      this.setDateInBinding(newDate);
    };
    this.$datepicker.on('changeDate', updateDate);
    if (!this.item.isEnabled()) {
      this.$datepicker.datepicker('disabled');
    }
  },
  setDateInPicker(d) {
    this.$datepicker.datepicker('update', d);
  },
});

DateTimeBase.register(DateTimeBootstrapDatepicker);
export default DateTimeBootstrapDatepicker;
