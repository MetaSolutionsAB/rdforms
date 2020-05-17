export default class DurationPresenter {
  constructor(params, node) {
    const data = this.extract(params.value);
    const labels = {
      years: 'Years',
      months: 'Months',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
    };
    ['years', 'months', 'days', 'hours', 'minutes'].forEach((key) => {
      if (data.hasOwnProperty(key)) {
        jquery(`<span class="durationlabel">${labels[key]}:</span><span class="durationValue">${data[key]}</span>`)
          .appendTo(node);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  extract(value) {
    const f = val => (val && val.length > 1 ? parseInt(val[0], 10) : 0);
    const years = f(value.match(/([0-9])*Y/));
    const days = f(value.match(/([0-9])*D/));
    const hours = f(value.match(/([0-9])*H/));
    let months;
    let minutes;
    if (value.indexOf('T') === -1) {
      months = f(value.match(/([0-9])*M/));
    } else {
      const arr = value.split('T');
      months = f(arr[0].match(/([0-9])*M/));
      minutes = f(arr[1].match(/([0-9])*M/));
    }
    return { years, months, days, hours, minutes };
  }
}
