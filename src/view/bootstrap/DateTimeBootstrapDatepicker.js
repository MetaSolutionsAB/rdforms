import 'bootstrap-datepicker/dist/js/bootstrap-datepicker';
import jquery from 'jquery';
import DateTimeBase from './DateTimeBase';
import { getNamedGraphId } from '../viewUtils';

/**
 * A Date and time picker.
 */
export default class DateTimeBootstrapDatepicker extends DateTimeBase {
  buildUI() {
    const disabledAttr = getNamedGraphId(this.binding, this.context) ? 'disabled' : '';
    const bundle = this.context.view.messages;
    const yearOption = this.includeYearOption() ? `<option value="Year">${bundle.date_year}</option>` : '';
    const dateOption = this.includeDateOption() ? `<option value="Date" selected="true">${bundle.date_date}</option>` : '';
    const dateTimeOption = this.includeDateTimeOption() ? `<option value="DateTime">${bundle.date_date_and_time}</option>` : '';
    this.domNode.innerHTML = `<div class="rdformsDateValue rdformsFieldInput" xmlns="http://www.w3.org/1999/html">
    <div class="rdformsDatepicker datepicker">
        <div class="input-group date">
            <input ${disabledAttr} type="text" class="form-control">
            <div class="input-group-append">
                <span class="input-group-text">
                <i class="fas fa-calendar"></i>
                </span>
            </div>
        </div>
    </div>
    <span style="display: none">
        <input ${disabledAttr} type="text" class="form-control timeInput" placeholder="HH:MM"/>
    </span>
    <span style="display: none">
        <input ${disabledAttr} type="text" class="form-control yearInput" placeholder="YYYY"/>
    </span>
    <select ${disabledAttr} class="form-control dateControl">
        ${yearOption}
        ${dateOption}
        ${dateTimeOption}
    </select>
</div>`;
    this.cal = jquery(this.domNode).find('.date')[0];
    this.timeInput = jquery(this.domNode).find('.timeInput')[0];
    this.yearInput = jquery(this.domNode).find('.yearInput')[0];
    this.dateControl = jquery(this.domNode).find('.dateControl')[0];
  }


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
  }
  setDateInPicker(d) {
    this.$datepicker.datepicker('update', d);
  }
}

DateTimeBase.register(DateTimeBootstrapDatepicker);
