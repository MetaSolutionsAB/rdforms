import templateString from './DurationEditorTemplate.html';
import DurationPresenter from './DurationPresenter';
import declare from 'dojo/_base/declare';
import _WidgetsInTemplateMixin from 'dijit/_WidgetsInTemplateMixin';

export default declare([_WidgetsInTemplateMixin, DurationPresenter], {
  templateString,
  regex: /^([\-\+])?P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+(?:\.[0-9]+)?)?S)?)?$/,

  buildRendering() {
    this.inherited('buildRendering', arguments);
    this.$years = jquery(this.yearsInput);
    this.$months = jquery(this.monthsInput);
    this.$days = jquery(this.daysInput);
    this.$hours = jquery(this.hoursInput);
    this.$minutes = jquery(this.minutesInput);
    const f = () => this.onChange(this.get('value'));
    this.$years.change(f);
    this.$months.change(f);
    this.$days.change(f);
    this.$hours.change(f);
    this.$minutes.change(f);
  },

  onChange() {
  },

  _setValueAttr(value) {
    const arr = this.regex.exec(value);
    if (arr != null) {
      if (arr[2] != null) {
        this.$years.val(arr[2]);
      }
      if (arr[3] != null) {
        this.$months.val(arr[3]);
      }
      if (arr[4] != null) {
        this.$days.val(arr[4]);
      }
      if (arr[5] != null) {
        this.$hours.val(arr[5]);
      }
      if (arr[6] != null) {
        this.$minutes.val(arr[6]);
      }
    }
  },

  _getValueAttr() {
    // this.get("years");
    const years = this.$years.val();
    const months = this.$months.val();
    const days = this.$days.val();
    const hours = this.$hours.val();
    const minutes = this.$minutes.val();
    if (years || months || days || hours || minutes) {
      let str = `P${years ? `${years}Y` : ''
        }${months ? `${months}M` : ''
        }${days ? `${days}D` : ''}`;
      if (hours || minutes) {
        str = `${str}T${
          hours ? `${hours}H` : ''
          }${minutes ? `${minutes}M` : ''}`;
      }
      return str;
    }
    return null;
  },
});
