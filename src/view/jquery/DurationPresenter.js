import templateString from './DurationPresenterTemplate.html';

import declare from 'dojo/_base/declare';
import _WidgetBase from 'dijit/_WidgetBase';
import _TemplatedMixin from 'dijit/_TemplatedMixin';

export default declare([_WidgetBase, _TemplatedMixin], {
  templateString,

  yearsLabel: '',
  _setYearsLabelAttr: {node: 'yearsLabelNode', type: 'innerHTML'},
  monthsLabel: '',
  _setMonthsLabelAttr: {node: 'monthsLabelNode', type: 'innerHTML'},
  daysLabel: '',
  _setDaysLabelAttr: {node: 'daysLabelNode', type: 'innerHTML'},
  hoursLabel: '',
  _setHoursLabelAttr: {node: 'hoursLabelNode', type: 'innerHTML'},
  minutesLabel: '',
  _setMinutesLabelAttr: {node: 'minutesLabelNode', type: 'innerHTML'},
  years: 0,
  _setYearsAttr: {node: 'yearsNode', type: 'innerHTML'},
  months: 0,
  _setMonthsAttr: {node: 'monthsNode', type: 'innerHTML'},
  days: 0,
  _setDaysAttr: {node: 'daysNode', type: 'innerHTML'},
  hours: 0,
  _setHoursAttr: {node: 'hoursNode', type: 'innerHTML'},
  minutes: 0,
  _setMinutesAttr: {node: 'minutesNode', type: 'innerHTML'},

  _setValueAttr(value) {
// eslint-disable-next-line arrow-body-style
    const f = (val) => {
      return val && val.length > 1 ? parseInt(val[0], 10) : 0;
    };
    this.set('years', f(value.match(/([0-9])*Y/)));
    this.set('days', f(value.match(/([0-9])*D/)));
    this.set('hours', f(value.match(/([0-9])*H/)));
    if (value.indexOf('T') === -1) {
      this.set('months', f(value.match(/([0-9])*M/)));
    } else {
      const arr = value.split('T');
      this.set('months', f(arr[0].match(/([0-9])*M/)));
      this.set('minutes', f(arr[1].match(/([0-9])*M/)));
    }
  },
});
