import moment from 'moment';
import jquery from 'jquery';
import DateTimeBase from '../bootstrap/DateTimeBase';
import { getNamedGraphId } from '../viewUtils';

/**
 * A Date and time picker.
 */
export default class DateTimeMD extends DateTimeBase {
  buildUI() {
    const disabledAttr = getNamedGraphId(this.binding, this.context) ? 'disabled' : '';
    this.tpdate = null;
    this.dpdate = null;
    const bundle = this.context.view.messages;
    const yearOption = this.includeYearOption() ? `<option value="Year">${bundle.date_year}</option>` : '';
    const dateOption = this.includeDateOption() ? `<option value="Date" selected="true">${bundle.date_date}</option>` : '';
    const dateTimeOption = this.includeDateTimeOption() ? `<option value="DateTime">${bundle.date_date_and_time}</option>` : '';

    this.domNode.innerHTML = `<div class="rdformsDateValue rdformsFieldInput" xmlns="http://www.w3.org/1999/html">
    <div class="rdformsDatepicker form-group input" style="padding-right: 15px;">
        <input ${disabledAttr} class="form-control dateInput date" type="text" placeholder="YYYY-MM-DD" />
        <span >
            <button ${disabledAttr} type="button" class="btn btn-primary bmd-btn-fab bmd-btn-fab-sm dateButton"><span class="fa fa-calendar"></span>
                <div class="ripple-container"></div></button>
        </span>
    </div>
    <div class="form-group input" style="display:none;">
        <input ${disabledAttr} type="text" class="form-control timeInput" placeholder="HH:MM"/>
        <span>
            <button ${disabledAttr} type="button" class="btn btn-primary bmd-btn-fab bmd-btn-fab-sm timeButton"><span class="fa fa-clock"></span></button>
        </span>
    </div>
    <div class="form-group input" style="display:none;">
        <input ${disabledAttr} type="text" class="form-control yearInput" placeholder="YYYY"/>
    </div>

    <select ${disabledAttr} class="form-control dateControl">
        ${yearOption}
        ${dateOption}
        ${dateTimeOption}
    </select>
</div>`;
    this.cal = jquery(this.domNode).find('.date')[0];
    this.dateButton = jquery(this.domNode).find('.dateButton')[0];
    this.timeInput = jquery(this.domNode).find('.timeInput')[0];
    this.timeButton = jquery(this.domNode).find('.timeButton')[0];
    this.yearInput = jquery(this.domNode).find('.yearInput')[0];
    this.dateControl = jquery(this.domNode).find('.dateControl')[0];
  }

  initDatePicker() {
    this.$datepicker = jquery(this.cal).bootstrapMaterialDatePicker({
      time: false,
      date: true,
      triggerEvent: 'none',
      switchOnClick: true,
      lang: this.context.view.getLocale(),
    });

    // time
    this.$timepicker = jquery(this.timeInput).bootstrapMaterialDatePicker({
      format: 'HH:mm',
      time: true,
      date: false,
      triggerEvent: 'none',
      switchOnClick: true,
      lang: this.context.view.getLocale(),
    });

    jquery(this.dateButton).click(() => {
      this.$datepicker.bootstrapMaterialDatePicker('_fireCalendar');
    });
    this.$datepicker.on('change', (evt, mInstance) => {
      const m = mInstance || moment(evt.target.value, undefined, this.context.view.getLocale());

      if (this.tpdate) {
        const tpd = moment(this.tpdate, undefined, this.context.view.getLocale());
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

    this.$timepicker.on('change', (evt, mInstance) => {
      const m = mInstance || moment(evt.target.value, undefined, this.context.view.getLocale());

      if (this.dpdate != null) {
        const dpd = moment(this.dpdate, undefined, this.context.view.getLocale());
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
  }

  setDateInPicker(d) {
    this.$datepicker.bootstrapMaterialDatePicker('setDate', d);
    this.$timepicker.bootstrapMaterialDatePicker('setTime', d);
    this.dpdate = d;
    this.tpdate = d;
  }
}

DateTimeBase.register(DateTimeMD);
