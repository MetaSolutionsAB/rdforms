/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';
import Select from '@mui/material/Select';
import moment from 'moment';
import renderingContext from '../renderingContext';
import { getDate } from '../jquery/util';

const getDatatype = (datatype) => {
  switch (datatype) {
    case 'http://www.w3.org/2001/XMLSchema#dateTime':
    case 'http://purl.org/dc/terms/W3CDTF':
      return 'Datetime';
    case 'http://www.w3.org/2001/XMLSchema#date':
      return 'Date';
    case 'http://www.w3.org/2001/XMLSchema#gYear':
      return 'Year';
    case 'http://www.w3.org/2001/XMLSchema#time':
      return 'Time';
    default:
      return undefined;
  }
};

const getDatatypeFromItem = (item) => {
  const dt = item.getDatatype();
  if (Array.isArray(dt)) {
    return getDatatype(dt[0]);
  }
  return getDatatype(dt);
};

const getAllowedDateAlternatives = (item) => {
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

const getDatatypeFromBinding = binding => getDatatype(binding.getDatatype()) || getDatatypeFromItem(binding.getItem());

const getDatatypeURI = (datatype) => {
  switch (datatype) {
    case 'Datetime':
      return 'http://www.w3.org/2001/XMLSchema#dateTime';
    case 'Date':
      return 'http://www.w3.org/2001/XMLSchema#date';
    case 'Time':
      return 'http://www.w3.org/2001/XMLSchema#time';
    case 'Year':
      return 'http://www.w3.org/2001/XMLSchema#gYear';
    default:
      return '';
  }
};

const getDateValue = (value, datatype) => {
  if (value) {
    switch (datatype) {
      case 'Datetime':
        return value.toISOString();
      case 'Date':
        // Since we cut of the timezone section at the end we need to compensate for it
        value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
        return value.toISOString().substr(0, 10);
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

const datePresenter = (fieldDiv, binding, context) => {
  const data = binding.getValue();
  if (data != null && data !== '') {
    const date = getDate(data);
    try {
      let str;
      if (data.indexOf('T') > 0) {
        // DateTime
        str = moment(date).format('lll');
      } else if (data.indexOf(':') > 0) {
        // Time
        str = moment(date).format('LT');
      } else if (data.length > 4) {
        // Full date
        str = moment(date).format('LL');
      } else {
        // Year only
        str = moment(date).format('YYYY');
      }
      fieldDiv.appendChild(<div key={binding.getHash()} >{str}</div>);
    } catch (e) {
      console.warn(`Could not present date, expected ISO8601 format in the form 2001-01-01 (potentially with time given after a 'T' character as well) but found '${data}' instead.`);
    }
  }
};

const presenters = renderingContext.presenterRegistry;
presenters.itemtype('text').datatype('xsd:dateTime').register(datePresenter);
presenters.itemtype('text').datatype('xsd:date').register(datePresenter);
presenters.itemtype('text').datatype('xsd:time').register(datePresenter);
presenters.itemtype('text').datatype('xsd:gYear').register(datePresenter);
presenters.itemtype('text').datatype('dcterms:W3CDTF').register(datePresenter);

const dateEditor = (fieldDiv, binding, context) => {
  const bundle = context.view.messages;
  const DateComp = () => {
    const value = binding.getGist();
    const alternatives = useMemo(() => getAllowedDateAlternatives(binding.getItem()));
    const onlyOneAlternative = Object.keys(alternatives).length === 1;
    const [selectedDate, setSelectedDate] = useState(value === '' ? null : getDate(value));
    const [selectedDatatype, setDatatype] = useState(getDatatypeFromBinding(binding));
    useEffect(() => {
      context.clear = () => {
        setSelectedDate(null);
        setDatatype(getDatatypeFromBinding(binding));
      };
    }, []);

    const onDateChange = (date) => {
      if (date == null) {
        binding.setValue('');
        setSelectedDate(null);
      } else if (date.isValid()) {
        binding.setValue(getDateValue(date.toDate(), selectedDatatype));
        setSelectedDate(date.toDate());
      }
    };

    const onDatatypeChange = (event) => {
      binding.setDatatype(getDatatypeURI(event.target.value));
      binding.setValue(getDateValue(selectedDate, event.target.value));
      setDatatype(event.target.value);
    };
    const inputProps = {
      'aria-labelledby': context.view.getLabelIndex(binding),
      variant: renderingContext.materialVariant,
    };
    const dateFormat = selectedDatatype === 'Year' ? 'YYYY' : 'YYYY-MM-DD';
    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <span className="rdformsDatePicker">
          {(alternatives.Date || alternatives.DateTime || alternatives.Year) && (
            <DatePicker
              renderInput={props => <TextField {...props} {...inputProps} />}
              leftArrowButtonProps={{ 'aria-label': bundle.date_previousMonth }}
              rightArrowButtonProps={{ 'aria-label': bundle.date_nextMonth }}
              KeyboardButtonProps={{
                'aria-label':
                  selectedDatatype === 'Year'
                    ? bundle.date_openYearPicker
                    : bundle.date_openDatePicker,
              }}
              label={
                selectedDatatype === 'Year' ? bundle.date_year : bundle.date_date
              }
              {...(selectedDatatype === 'Datetime' || selectedDatatype === 'Date' || selectedDatatype === 'Year' ?
                {} : { disabled: true })}
              value={selectedDatatype === 'Datetime' || selectedDatatype === 'Date' || selectedDatatype === 'Year' ?
                selectedDate : null}
              minDate={moment(new Date('0000-01-01'))}
              inputFormat={dateFormat}
              views={selectedDatatype === 'Year' ? ['year'] : ['day']}
              onChange={onDateChange}
              autoOk={true}
              mask={selectedDatatype === 'Year' ? '____' : '____-__-__'}
              PopperProps={{
                modifiers: [
                  {
                    name: 'flip',
                    enabled: false,
                  },
                ],
              }}
            />
          )}
          {(alternatives.Datetime || alternatives.Time) && (
            <TimePicker
              renderInput={props => <TextField {...props} {...inputProps} />}
              label={bundle.date_time}
              {...(selectedDatatype === 'Datetime' || selectedDatatype === 'Time' ? {} : { disabled: true })}
              KeyboardButtonProps={{
                'aria-label': bundle.date_openTimePicker,
              }}
              value={selectedDatatype === 'Datetime' || selectedDatatype === 'Time' ? selectedDate : null}
              onChange={onDateChange}
              ampm={false}
              autoOk={true}
              PopperProps={{
                modifiers: [
                  {
                    name: 'flip',
                    enabled: false,
                  },
                ],
              }}
            />
          )}
          {!onlyOneAlternative && (
            <FormControl variant={renderingContext.materialVariant}>
              <Select
                value={selectedDatatype}
                inputProps={inputProps}
                onChange={onDatatypeChange}
              >
                {alternatives.Year && (
                  <MenuItem value="Year">{bundle.date_year}</MenuItem>
                )}
                {alternatives.Date && (
                  <MenuItem value="Date">{bundle.date_date}</MenuItem>
                )}
                {alternatives.Datetime && (
                  <MenuItem value="Datetime">
                    {bundle.date_date_and_time}
                  </MenuItem>
                )}
                {alternatives.Time && (
                  <MenuItem value="Time">{bundle.date_time}</MenuItem>
                )}
              </Select>
            </FormControl>
          )}
        </span>
      </LocalizationProvider>
    );
  };
  fieldDiv.appendChild(<DateComp key={binding.getHash()}></DateComp>);
};

const editors = renderingContext.editorRegistry;
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#date').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#dateTime').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#gYear').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#time').register(dateEditor);
editors.itemtype('text').datatype('http://purl.org/dc/terms/W3CDTF').register(dateEditor);
