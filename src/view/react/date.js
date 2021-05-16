/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import moment from 'moment';
import renderingContext from '../renderingContext';

const getDatatype = (datatype) => {
  switch (datatype) {
    case 'http://www.w3.org/2001/XMLSchema#dateTime':
    case 'http://purl.org/dc/terms/W3CDTF':
      return 'Datetime';
    case 'http://www.w3.org/2001/XMLSchema#date':
      return 'Date';
    case 'http://www.w3.org/2001/XMLSchema#gYear':
      return 'Year';
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
        return value.toISOString().substr(0, 10);
      case 'Year':
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
    try {
      let str;
      if (data.indexOf('T') > 0) {
        str = moment(data).format('lll');
      } else if (data.length > 4) {
        str = moment(data).format('LL');
      } else {
        str = moment(data).format('YYYY');
      }
      fieldDiv.appendChild(<div key={binding.getHash()} >{str}</div>);
    } catch (e) {
      console.warn(`Could not present date, expected ISO8601 format in the form 2001-01-01 (potentially with time given after a 'T' character as well) but found '${data}' instead.`);
    }
  }
};

const presenters = renderingContext.presenterRegistry;
presenters.itemtype('text').datatype('xsd:date').register(datePresenter);
presenters.itemtype('text').datatype('dcterms:W3CDTF').register(datePresenter);


const dateEditor = (fieldDiv, binding, context) => {
  const bundle = context.view.messages;
  const DateComp = () => {
    const value = binding.getGist();
    const alternatives = useMemo(() => getAllowedDateAlternatives(binding.getItem()));
    const onlyOneAlternative = Object.keys(alternatives).length === 1;
    const [selectedDate, setSelectedDate] = useState(value === '' ? null : new Date(value));
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
    const bundle = context.view.messages;
    const inputProps = { 'aria-labelledby': context.view.getLabelIndex(binding) };
    const dateFormat = selectedDatatype === 'Year' ? 'YYYY' : 'YYYY-MM-DD';
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <span className="rdformsDatePicker">
          <KeyboardDatePicker
            KeyboardButtonProps={{ 'aria-label': selectedDatatype === 'Year' ?
                bundle.date_openYearPicker : bundle.date_openDatePicker }}
            label={selectedDatatype === 'Year' ? bundle.date_year : bundle.date_date}
            value={selectedDate} minDate={new Date('0000-01-01')} format={dateFormat}
            views={selectedDatatype === 'Year' ? ['year'] : ['date']}
            inputProps={inputProps}
            onChange={onDateChange} autoOk={true} inputVariant={renderingContext.materialVariant}/>
          {alternatives.Datetime && (<KeyboardTimePicker
            label={bundle.date_time}
            { ...(selectedDatatype === 'Datetime' ? {} : { disabled: true })}
            KeyboardButtonProps={{ 'aria-label': bundle.date_openTimePicker }}
            value={selectedDatatype === 'Datetime' ? selectedDate : null}
            onChange={onDateChange} ampm={false} autoOk={true}
            inputProps={inputProps}
            inputVariant={renderingContext.materialVariant}/>)}
          {!onlyOneAlternative && (<FormControl variant={renderingContext.materialVariant}>
            <Select
              value={selectedDatatype}
              inputProps={inputProps}
              onChange={onDatatypeChange}>
              {alternatives.Year && (<MenuItem value="Year">{bundle.date_year}</MenuItem>)}
              {alternatives.Date && (<MenuItem value="Date">{bundle.date_date}</MenuItem>)}
              {alternatives.Datetime && (<MenuItem value="Datetime">{bundle.date_date_and_time}</MenuItem>)}
            </Select>
          </FormControl>)}
        </span>
      </MuiPickersUtilsProvider>
    );
  };
  fieldDiv.appendChild(<DateComp key={binding.getHash()}></DateComp>);
};

const editors = renderingContext.editorRegistry;
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#date').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#dateTime').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#gYear').register(dateEditor);
editors.itemtype('text').datatype('http://purl.org/dc/terms/W3CDTF').register(dateEditor);
