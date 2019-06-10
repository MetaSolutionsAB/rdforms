import moment from 'moment';
import DateTimeBase from '../bootstrap/DateTimeBase';
import template from './DateTimeMDTemplate.html';
import jquery from 'jquery';
import declare from 'dojo/_base/declare';

/**
 * A Date and time picker.
 */
const DTMD = declare([DateTimeBase], {
  templateString: template,
  tpdate: null,
  dpdate: null,
  //= ==================================================
  // Inherited methods
  //= ==================================================

  initDatePicker() {
    this.$datepicker = jquery(this.cal).bootstrapMaterialDatePicker({
      time: false,
      date: true,
      triggerEvent: 'none',
      switchOnClick: true,
      lang: moment.locale(),
    });

    // time
    this.$timepicker = jquery(this.timeInput).bootstrapMaterialDatePicker({
      format: 'HH:mm',
      time: true,
      date: false,
      triggerEvent: 'none',
      switchOnClick: true,
      lang: moment.locale(),
    });

    jquery(this.dateButton).click(() => {
      this.$datepicker.bootstrapMaterialDatePicker('_fireCalendar');
    });
    this.$datepicker.on('change', (evt, m) => {
      if (!m) {
        m = moment(evt.target.value);
      }

      if (this.tpdate) {
        const tpd = moment(this.tpdate);
        m.minute(tpd.minute());
        m.hour(tpd.hour());
      }
      this.dpdate = m.toDate();
      this.setDateInBinding(this.dpdate);
    });

    if (!this.item.isEnabled()) {
      this.$datepicker.prop('disabled', true);
    }

    jquery(this.timeButton).click(() => {
      this.$timepicker.bootstrapMaterialDatePicker('_fireCalendar');
    });

    this.$timepicker.on('change', (evt, m) => {
      if (!m) {
        m = moment(evt.target.value);
      }

      if (this.dpdate != null) {
        const dpd = moment(this.dpdate);
        dpd.minute(m.minute());
        dpd.hour(m.hour());
        this.tpdate = dpd.toDate();
        this.setDateInBinding(this.tpdate);
      } else {
        this.tpdate = m.toDate();
      }
    });

    if (!this.item.isEnabled()) {
      this.$timepicker.prop('disabled', true);
    }
  },
  setDateInPicker(d) {
    this.$datepicker.bootstrapMaterialDatePicker('setDate', d);
    this.$timepicker.bootstrapMaterialDatePicker('setTime', d);
    this.dpdate = d;
    this.tpdate = d;
  },
});

DateTimeBase.register(DTMD);
export default DTMD;
