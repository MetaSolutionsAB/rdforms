export const fromDuration = (value) => {
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
};

export const toDuration = (data) => {
  if (data.years || data.months || data.days || data.hours || data.minutes) {
    let str = `P${data.years ? `${data.years}Y` : ''
    }${data.months ? `${data.months}M` : ''
    }${data.days ? `${data.days}D` : ''}`;
    if (data.hours || data.minutes) {
      str = `${str}T${
        data.hours ? `${data.hours}H` : ''
      }${data.minutes ? `${data.minutes}M` : ''}`;
    }
    return str;
  }
  return null;
};

export const getDate = (value) => {
  try {
    // xsd:time
    if (value.includes(':') && !value.includes('T')) {
      const datePart = new Date().toISOString().substr(0, 11);
      const timeDate = new Date(`${datePart}${value}`);
      timeDate.setMinutes(timeDate.getMinutes() + timeDate.getTimezoneOffset());
      return timeDate;
    }
    // all other cases
    return new Date(value);
  } catch (e) {
    return null;
  }
};