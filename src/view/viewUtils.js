import moment from 'moment';

export const fromDuration = (value) => {
  const f = val => (val && val.length > 1 ? parseInt(val[0], 10) : 0);
  const years = f(value.match(/([0-9])*Y/));
  const days = f(value.match(/([0-9])*D/));
  const hours = f(value.match(/([0-9])*H/));
  let months;
  let minutes = 0;
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

export const getDatatype = (datatype) => {
  switch (datatype) {
    case 'http://www.w3.org/2001/XMLSchema#dateTime':
    case 'http://purl.org/dc/terms/W3CDTF':
      return 'DateTime';
    case 'http://www.w3.org/2001/XMLSchema#date':
      return 'Date';
    case 'http://www.w3.org/2001/XMLSchema#gYear':
      return 'Year';
    case 'http://www.w3.org/2001/XMLSchema#time':
      return 'Time';
    case 'http://www.w3.org/2001/XMLSchema#gYearMonth':
      return 'YearMonth';
    case 'http://www.w3.org/2001/XMLSchema#gMonthDay':
      return 'MonthDay';
    default:
      return undefined;
  }
};

export const getDatatypeFromItem = (item) => {
  const dt = item.getDatatype();
  if (Array.isArray(dt)) {
    return getDatatype(dt[0]);
  }
  return getDatatype(dt);
};

export const getDatatypeFromValue = (data) => {
  if (data.indexOf('T') > 0) {
    return 'DateTime';
  } else if (data.indexOf(':') > 0) {
    return 'Time';
  } else if (/^\d\d\d\d-\d\d$/.test(data)) {
    return 'YearMonth';
  } else if (/^\d\d-\d\d$/.test(data)) {
    return 'MonthDay';
  } else if (data.length > 4) {
    return 'Date';
  }
  return 'Year';
};

export const getDatatypeURI = (datatype) => {
  switch (datatype) {
    case 'DateTime':
      return 'http://www.w3.org/2001/XMLSchema#dateTime';
    case 'Date':
      return 'http://www.w3.org/2001/XMLSchema#date';
    case 'Time':
      return 'http://www.w3.org/2001/XMLSchema#time';
    case 'Year':
      return 'http://www.w3.org/2001/XMLSchema#gYear';
    case 'YearMonth':
      return 'http://www.w3.org/2001/XMLSchema#gYearMonth';
    case 'MonthDay':
      return 'http://www.w3.org/2001/XMLSchema#gMonthDay';
    default:
      return '';
  }
};

export const getDateValue = (value, datatype) => {
  if (value) {
    switch (datatype) {
      case 'DateTime':
        return value.toISOString();
      case 'Date':
        // Since we cut of the timezone section at the end we need to compensate for it
        value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
        return value.toISOString().substr(0, 10);
      case 'YearMonth':
        // Since we cut of the timezone section at the end we need to compensate for it
        value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
        return value.toISOString().substr(0, 7);
      case 'MonthDay':
        // Since we cut of the timezone section at the end we need to compensate for it
        value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
        return value.toISOString().substr(5, 5);
      case 'Time':
        value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
        return value.toISOString().substr(11);
      case 'Year':
        // Since we cut of the timezone section at the end we need to compensate for it
        value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
        return value.toISOString().substr(0, 4);
      default:
        return '';
    }
  }
  return '';
};

export const getDatePresentationFromDatatype = (datatype, date) => {
  switch (datatype) {
    case 'DateTime':
      return moment(date).format('lll');
    case 'Date':
      return moment(date).format('LL');
    case 'Time':
      return moment(date).format('LT');
    case 'Year':
      return moment(date).format('YYYY');
    case 'YearMonth':
      return moment(date).format('MMMM YYYY');
    case 'MonthDay':
      return moment(date).format('D MMMM');
    default:
      return '';
  }
};

export const getAllowedDateAlternatives = (item) => {
  const dateAllowedDataAlternatives = {};
  const dt = item.getDatatype();
  const alts = Array.isArray(dt) ? dt : [dt];
  alts.forEach((datatype) => {
    const alt = getDatatype(datatype);
    if (alt) {
      dateAllowedDataAlternatives[alt] = true;
    }
  });
  return dateAllowedDataAlternatives;
};

export const getDatePresentation = (binding) => {
  const data = binding.getValue();
  if (data != null && data !== '') {
    const item = binding.getItem();
    const date = getDate(data);
    if (date) {
      const valueDatatype = getDatatypeFromValue(data);
      const datatypeDatatype = getDatatype(binding.getDatatype());
      const itemSuggestedDatatype = getDatatypeFromItem(item);
      const allowed = getAllowedDateAlternatives(item);
      let datatype;
      if (allowed[datatypeDatatype]) {
        // This is always the case unless "relaxedDatatypeMatch" is specified
        datatype = datatypeDatatype;
      } else if (allowed[valueDatatype]) {
        // If the detected datatype from the value is supported
        datatype = valueDatatype;
      } else {
        // Rely on the datatype from the item if everything else fails
        datatype = itemSuggestedDatatype;
      }
      return getDatePresentationFromDatatype(datatype, date);
    }
  }
  return undefined;
};

export const getNamedGraphId = (binding, context) => {
  const ng = (binding.getStatement() || binding.getParent().getStatement())?.getNamedGraph();
  if (ng) {
    let view = context.view;
    while (view.getParentView()) view = view.getParentView();
    return view.getNamedGraphId(ng);
  }
  return undefined;
};
