/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import moment from 'moment';
import renderingContext from '../renderingContext';

const getDatatype = (binding) => {
  switch (binding.getDatatype()) {
    case 'http://www.w3.org/2001/XMLSchema.xsd#dateTime':
      return 'Datetime';
    case 'http://www.w3.org/2001/XMLSchema.xsd#date':
      return 'Date';
    case 'http://www.w3.org/2001/XMLSchema.xsd#gYear':
      return 'Year';
    default:
      return 'Datetime';
  }
};

const getDatatypeURI = (datatype) => {
  switch (datatype) {
    case 'Datetime':
      return 'http://www.w3.org/2001/XMLSchema.xsd#dateTime';
    case 'Date':
      return 'http://www.w3.org/2001/XMLSchema.xsd#date';
    case 'Year':
      return 'http://www.w3.org/2001/XMLSchema.xsd#gYear';
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
      fieldDiv.appendChild(<div>{str}</div>);
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
    const [selectedDate, setSelectedDate] = useState(value === '' ? null : new Date(value));
    const [selectedDatatype, setDatatype] = useState(getDatatype(binding));
    useEffect(() => {
      context.clear = () => {
        setSelectedDate(null);
        setDatatype(getDatatype(binding));
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

    const dateFormat = selectedDatatype === 'Year' ? 'YYYY' : 'YYYY-MM-DD';

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <span className="rdformsDatePicker">
          <KeyboardDatePicker value={selectedDate} minDate={new Date('0000-01-01')} format={dateFormat}
                              views={selectedDatatype === 'Year' ? ['year'] : ['date']}
                              onChange={onDateChange} autoOk={true} inputVariant={renderingContext.materialVariant}/>
          <KeyboardTimePicker { ...(selectedDatatype === 'Datetime' ? {} : { disabled: true })}
                              value={selectedDate} onChange={onDateChange} ampm={false} autoOk={true}
                              inputVariant={renderingContext.materialVariant}/>
          <FormControl variant={renderingContext.materialVariant}>
            <Select
              value={selectedDatatype}
              onChange={onDatatypeChange}>
              <MenuItem value="Datetime">{bundle.date_date_and_time}</MenuItem>
              <MenuItem value="Date">{bundle.date_date}</MenuItem>
              <MenuItem value="Year">{bundle.date_year}</MenuItem>
            </Select>
          </FormControl>
        </span>
      </MuiPickersUtilsProvider>
    );
  };
  fieldDiv.appendChild(<DateComp></DateComp>);
};

const editors = renderingContext.editorRegistry;
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#date').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#dateTime').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#gYear').register(dateEditor);
editors.itemtype('text').datatype('http://purl.org/dc/terms/W3CDTF').register(dateEditor);
