import moment from 'moment';
import {i18n, NLSMixin} from 'esi18n';
import templateString from './DateTimeFueluxTemplate.html';
import 'fuelux/js/datepicker';
import DateTimeBase from './DateTimeBase';

import declare from 'dojo/_base/declare';


/**
 * A Date and time picker.
 */
const DateTimeFuelux = declare([DateTimeBase], {
  templateString,

  //= ==================================================
  // Inherited methods
  //= ==================================================

  initDatePicker() {
    let month;
    const months = moment.months();
    for (i = 0; i < 12; i++) {
      month = months[i];
      month = month.charAt(0).toUpperCase() + month.slice(1);
      jquery(this.months).find(`span[data-month="${i}"]`).text(month);
    }
    const days = moment.weekdaysMin();
    jquery(this.days).find('th').each((idx) => {
      jquery(this).text(days[idx]);
    });
    jquery(this.today).text(this.messages.today);

    this.$datepicker = jquery(this.cal).datepicker({
      allowPastDates: true,
      date: null,
      momentConfig: {
        culture: i18n.getLocale(),//locale.getCurrentMomentLocale(),
        format: 'L',
      },
    });

    const updateDate = (evt, d) => this.setDateInBinding(d);
    this.$datepicker
      .on('changed.fu.datepicker', updateDate)
      .on('dateClicked.fu.datepicker', updateDate);

    if (!this.item.isEnabled()) {
      this.$datepicker.datepicker('disabled');
    }
  },
  setDateInPicker(d) {
    this.$datepicker.datepicker('setDate', d);
  },
});

DateTimeBase.register(DateTimeFuelux);
export default DateTimeFuelux;
