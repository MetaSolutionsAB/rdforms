import moment from 'moment';
import {locale} from 'di18n';
import template from './DateTimeFueluxTemplate.html';
import 'fuelux/js/datepicker';
import DateTimeBase from './DateTimeBase';

define([
  'dojo/_base/declare',
  'dojo/_base/lang',
], (declare, lang) => {
  /**
   * A Date and time picker.
   */
  const DateTimeFuelux = declare([DateTimeBase], {
    templateString: template,

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
          culture: 'en',//locale.getCurrentMomentLocale(),
          format: 'L',
        },
      });

      const updateDate = lang.hitch(this, (evt, d) => {
        this.setDateInBinding(d);
      });
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
  return DateTimeFuelux;
});
