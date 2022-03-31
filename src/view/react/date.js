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
import {
  getDate,
  getDatatype,
  getDatatypeURI,
  getDatatypeFromItem,
  getDateValue,
  getAllowedDateAlternatives,
  getDatePresentation,
} from '../jquery/util';


const getDatatypeFromBinding = binding => getDatatype(binding.getDatatype()) || getDatatypeFromItem(binding.getItem());

const datePresenter = (fieldDiv, binding, context) => {
  try {
    const pres = getDatePresentation(binding);
    fieldDiv.appendChild(<div key={binding.getHash()} >{pres}</div>);
  } catch (e) {
    console.warn(`Could not present date, expected ISO8601 format in the form 2001-01-01 
      (potentially with time given after a 'T' character as well) but found '${binding.getValue()}' instead.`);
  }
};

const presenters = renderingContext.presenterRegistry;
presenters.itemtype('text').datatype('xsd:dateTime').register(datePresenter);
presenters.itemtype('text').datatype('xsd:date').register(datePresenter);
presenters.itemtype('text').datatype('xsd:time').register(datePresenter);
presenters.itemtype('text').datatype('xsd:gYear').register(datePresenter);
presenters.itemtype('text').datatype('xsd:gYearMonth').register(datePresenter);
presenters.itemtype('text').datatype('xsd:gMonthDay').register(datePresenter);
presenters.itemtype('text').datatype('dcterms:W3CDTF').register(datePresenter);

const datePickerConfig = {
  format: {
    Year: 'YYYY',
    DateTime: 'YYYY-MM-DD',
    Date: 'YYYY-MM-DD',
    YearMonth: 'YYYY-MM',
    MonthDay: 'MM-DD',
    Time: 'YYYY-MM-DD', // Since datepicker is sometimes visible but disabled
  },
  mask: {
    Year: '____',
    DateTime: '____-__-__',
    Date: '____-__-__',
    YearMonth: '____-__',
    MonthDay: '__-__',
    Time: '____-__-__', // Since datepicker is sometimes visible but disabled
  },
  views: {
    Year: ['year'],
    DateTime: ['day'],
    Date: ['day'],
    YearMonth: ['year', 'month'],
    MonthDay: ['month', 'day'],
    Time: ['day'], // Since datepicker is sometimes visible but disabled
  },
  labelKey: {
    Year: 'date_year',
    DateTime: 'date_date',
    Date: 'date_date',
    YearMonth: 'date_year_and_month', // TODO
    MonthDay: 'date_month_and_day', // TODO
    Time: 'date_date', // Since datepicker is sometimes visible but disabled
  },
  ariaLabelKey: {
    Year: 'date_openYearPicker',
    DateTime: 'date_openDatePicker',
    Date: 'date_openDatePicker',
    YearMonth: 'date_openDatePicker', // TODO
    MonthDay: 'date_openDatePicker', // TODO
    Time: 'date_openDatePicker', // Since datepicker is sometimes visible but disabled
  },
};


const dateEditor = (fieldDiv, binding, context) => {
  const bundle = context.view.messages;
  const DateComp = () => {
    const value = binding.getGist();
    const alternatives = useMemo(() => getAllowedDateAlternatives(binding.getItem()), []);
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
    const visibleDatePicker = alternatives.Date || alternatives.DateTime || alternatives.Year
      || alternatives.YearMonth || alternatives.MonthDay;
    const enabledDatePicker = selectedDatatype === 'DateTime' || selectedDatatype === 'Date'
      || selectedDatatype === 'Year' || selectedDatatype === 'YearMonth' || selectedDatatype === 'MonthDay';
    return (
      <LocalizationProvider dateAdapter={DateAdapter}>
        <span className="rdformsDatePicker">
          {visibleDatePicker && (
            <DatePicker
              renderInput={props => <TextField {...props} {...inputProps} />}
              leftArrowButtonProps={{ 'aria-label': bundle.date_previousMonth }}
              rightArrowButtonProps={{ 'aria-label': bundle.date_nextMonth }}
              KeyboardButtonProps={{ 'aria-label': bundle[datePickerConfig.ariaLabelKey[selectedDatatype]] }}
              label={bundle[datePickerConfig.labelKey[selectedDatatype]]}
              {...(enabledDatePicker ? {} : { disabled: true })}
              value={enabledDatePicker ? selectedDate : null}
              minDate={moment(new Date('0000-01-01'))}
              inputFormat={datePickerConfig.format[selectedDatatype]}
              views={datePickerConfig.views[selectedDatatype]}
              onChange={onDateChange}
              autoOk={true}
              mask={datePickerConfig.mask[selectedDatatype]}
            />
          )}
          {(alternatives.DateTime || alternatives.Time) && (
            <TimePicker
              renderInput={props => <TextField {...props} {...inputProps} />}
              label={bundle.date_time}
              {...(selectedDatatype === 'DateTime' || selectedDatatype === 'Time' ? {} : { disabled: true })}
              KeyboardButtonProps={{
                'aria-label': bundle.date_openTimePicker,
              }}
              value={selectedDatatype === 'DateTime' || selectedDatatype === 'Time' ? selectedDate : null}
              onChange={onDateChange}
              ampm={false}
              autoOk={true}
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
                {alternatives.DateTime && (
                  <MenuItem value="DateTime">
                    {bundle.date_date_and_time}
                  </MenuItem>
                )}
                {alternatives.YearMonth && (
                  <MenuItem value="YearMonth">{bundle.date_year_and_month}</MenuItem>
                )}
                {alternatives.MonthDay && (
                  <MenuItem value="MonthDay">{bundle.date_month_and_day}</MenuItem>
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
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#gMonthDay').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#gYearMonth').register(dateEditor);
editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#time').register(dateEditor);
editors.itemtype('text').datatype('http://purl.org/dc/terms/W3CDTF').register(dateEditor);
