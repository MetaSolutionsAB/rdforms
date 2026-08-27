import { useState, useEffect, useMemo, useRef } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment';
import CODES from '../../model/CODES';
import renderingContext from '../renderingContext';
import {
  getDate,
  getDatatype,
  getDatatypeURI,
  getDatatypeFromItem,
  getDateValue,
  getAllowedDateAlternatives,
  getDatePresentation,
} from '../viewUtils';
import { useNamedGraphId } from './hooks';

const getDatatypeFromBinding = (binding, alternatives) => {
  const currentDatatype = getDatatype(binding.getDatatype());
  if (!alternatives[currentDatatype]) {
    alternatives[currentDatatype] = 'error';
  }
  return currentDatatype || getDatatypeFromItem(binding.getItem());
};

const datePresenter = (fieldDiv, binding, context) => {
  try {
    const pres = getDatePresentation(binding, context.view.getLocale());
    fieldDiv.appendChild(<div key={binding.getHash()}>{pres}</div>);
  } catch {
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
    const alternatives = useMemo(
      () => getAllowedDateAlternatives(binding.getItem()),
      []
    );
    const [selectedDate, setSelectedDate] = useState(
      value === '' ? null : getDate(value)
    );
    const [selectedDatatype, setDatatype] = useState(
      getDatatypeFromBinding(binding, alternatives)
    );
    const onlyOneAlternative = Object.keys(alternatives).length === 1;
    const [datatypeError, setDatatypeError] = useState(
      binding.getMatchingCode() === CODES.WRONG_DATATYPE
    );
    // Picker validation is tracked apart from the datatype verdict, and per
    // picker, so neither a datatype change nor the other picker's valid
    // transition can erase an active error.
    const [datePickerError, setDatePickerError] = useState(null);
    const [timePickerError, setTimePickerError] = useState(null);
    const error =
      datatypeError || Boolean(datePickerError) || Boolean(timePickerError);
    // A partial value can already parse as valid — the single-section 'YYYY'
    // format pads '2' to '0002' — so the binding is only written once input
    // settles, on blur or accept. `undefined` means nothing to commit.
    const pendingDate = useRef(undefined);

    useEffect(() => {
      fieldDiv.toggleClass('mismatchReport', error);
    }, [error]);

    useEffect(() => {
      context.clear = () => {
        pendingDate.current = undefined;
        setSelectedDate(null);
        setDatatype(getDatatypeFromItem(binding.getItem()));
        setDatatypeError(false);
        setDatePickerError(null);
        setTimePickerError(null);
      };
    }, []);

    const onDateChange = (date) => {
      if (date == null) {
        pendingDate.current = null;
        setSelectedDate(null);
      } else if (date.isValid()) {
        pendingDate.current = date.toDate();
        setSelectedDate(date.toDate());
      } else {
        pendingDate.current = undefined;
      }
    };

    const commitDate = () => {
      if (pendingDate.current !== undefined) {
        binding.setValue(getDateValue(pendingDate.current, selectedDatatype));
        pendingDate.current = undefined;
      }
    };

    // min/maxDate bound the picker's navigation, not data validity, so range
    // reasons are not errors. maxDate stays at its default — the year view
    // renders a button per year, and a 9999 ceiling makes it crawl.
    const onDatePickerError = (reason) =>
      setDatePickerError(
        reason === 'minDate' || reason === 'maxDate' ? null : reason
      );

    // Keep the controlled value's instance stable between renders: the picker
    // detects external changes by reference, and a fresh moment mid-edit
    // would reset the field and wipe in-progress input.
    const selectedMoment = useMemo(
      () => (selectedDate ? moment(selectedDate) : null),
      [selectedDate]
    );

    const onDatatypeChange = (event) => {
      binding.setDatatype(getDatatypeURI(event.target.value));
      binding.setValue(getDateValue(selectedDate, event.target.value));
      setDatatype(event.target.value);
      setDatatypeError(alternatives[event.target.value] === 'error');
    };
    const inputProps = {
      'aria-labelledby': context.view.getLabelIndex(binding),
      variant: renderingContext.materialVariant,
    };
    const ngId = useNamedGraphId(binding, context);
    const visibleDatePicker =
      alternatives.Date ||
      alternatives.DateTime ||
      alternatives.Year ||
      alternatives.YearMonth ||
      alternatives.MonthDay;
    const enabledDatePicker =
      !ngId &&
      (selectedDatatype === 'DateTime' ||
        selectedDatatype === 'Date' ||
        selectedDatatype === 'Year' ||
        selectedDatatype === 'YearMonth' ||
        selectedDatatype === 'MonthDay');
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <span className="rdformsDatePicker">
            {visibleDatePicker && (
              <DatePicker
                label={bundle[datePickerConfig.labelKey[selectedDatatype]]}
                {...(enabledDatePicker ? {} : { disabled: true })}
                value={enabledDatePicker ? selectedMoment : null}
                minDate={moment(new Date('0000-01-01'))}
                format={datePickerConfig.format[selectedDatatype]}
                views={datePickerConfig.views[selectedDatatype]}
                onChange={onDateChange}
                onAccept={commitDate}
                onError={onDatePickerError}
                localeText={{ todayButtonLabel: bundle.today }}
                slotProps={{
                  actionBar: {
                    actions:
                      selectedDatatype === 'Date' ||
                      selectedDatatype === 'DateTime'
                        ? ['today']
                        : [],
                  },
                  // Without an explicit error prop the field colors itself from
                  // MUI's internal validation, which still counts the ignored
                  // range reasons.
                  textField: {
                    ...inputProps,
                    onBlur: commitDate,
                    error: Boolean(datePickerError),
                  },
                  openPickerButton: {
                    'aria-label':
                      bundle[datePickerConfig.ariaLabelKey[selectedDatatype]],
                  },
                  previousIconButton: {
                    'aria-label': bundle.date_previousMonth,
                  },
                  nextIconButton: { 'aria-label': bundle.date_nextMonth },
                }}
              />
            )}
            {(alternatives.DateTime || alternatives.Time) && (
              <TimePicker
                label={bundle.date_time}
                {...(!ngId &&
                (selectedDatatype === 'DateTime' || selectedDatatype === 'Time')
                  ? {}
                  : { disabled: true })}
                value={
                  selectedDatatype === 'DateTime' || selectedDatatype === 'Time'
                    ? selectedMoment
                    : null
                }
                onChange={onDateChange}
                onAccept={commitDate}
                onError={(reason) => setTimePickerError(reason)}
                ampm={false}
                localeText={{ todayButtonLabel: bundle.now }}
                slotProps={{
                  actionBar: { actions: ['today'] },
                  textField: {
                    ...inputProps,
                    onBlur: commitDate,
                    error: Boolean(timePickerError),
                  },
                  openPickerButton: {
                    'aria-label': bundle.date_openTimePicker,
                  },
                }}
              />
            )}
            {!onlyOneAlternative && (
              <FormControl variant={renderingContext.materialVariant}>
                <Select
                  value={selectedDatatype}
                  inputProps={inputProps}
                  error={alternatives[selectedDatatype] === 'error'}
                  onChange={onDatatypeChange}
                  disabled={!!ngId}
                >
                  {alternatives.Year && (
                    <MenuItem
                      disabled={alternatives.Year === 'error'}
                      className="rdformsDatatypeOption"
                      value="Year"
                    >
                      {bundle.date_year}
                    </MenuItem>
                  )}
                  {alternatives.Date && (
                    <MenuItem
                      disabled={alternatives.Date === 'error'}
                      className="rdformsDatatypeOption"
                      value="Date"
                    >
                      {bundle.date_date}
                    </MenuItem>
                  )}
                  {alternatives.DateTime && (
                    <MenuItem
                      disabled={alternatives.DateTime === 'error'}
                      className="rdformsDatatypeOption"
                      value="DateTime"
                    >
                      {bundle.date_date_and_time}
                    </MenuItem>
                  )}
                  {alternatives.YearMonth && (
                    <MenuItem
                      disabled={alternatives.YearMonth === 'error'}
                      className="rdformsDatatypeOption"
                      value="YearMonth"
                    >
                      {bundle.date_year_and_month}
                    </MenuItem>
                  )}
                  {alternatives.MonthDay && (
                    <MenuItem
                      disabled={alternatives.MonthDay === 'error'}
                      className="rdformsDatatypeOption"
                      value="MonthDay"
                    >
                      {bundle.date_month_and_day}
                    </MenuItem>
                  )}
                  {alternatives.Time && (
                    <MenuItem
                      disabled={alternatives.Time === 'error'}
                      className="rdformsDatatypeOption"
                      value="Time"
                    >
                      {bundle.date_time}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
          </span>
        </LocalizationProvider>
        {error && (
          <div key="warning" className="rdformsWarning">
            {datatypeError
              ? context.view.messages.wrongDatatypeField
              : context.view.messages.wrongValueField}
          </div>
        )}
      </>
    );
  };
  fieldDiv.appendChild(<DateComp key={binding.getHash()}></DateComp>);
};

const editors = renderingContext.editorRegistry;
editors
  .itemtype('text')
  .datatype('http://www.w3.org/2001/XMLSchema#date')
  .register(dateEditor);
editors
  .itemtype('text')
  .datatype('http://www.w3.org/2001/XMLSchema#dateTime')
  .register(dateEditor);
editors
  .itemtype('text')
  .datatype('http://www.w3.org/2001/XMLSchema#gYear')
  .register(dateEditor);
editors
  .itemtype('text')
  .datatype('http://www.w3.org/2001/XMLSchema#gMonthDay')
  .register(dateEditor);
editors
  .itemtype('text')
  .datatype('http://www.w3.org/2001/XMLSchema#gYearMonth')
  .register(dateEditor);
editors
  .itemtype('text')
  .datatype('http://www.w3.org/2001/XMLSchema#time')
  .register(dateEditor);
editors
  .itemtype('text')
  .datatype('http://purl.org/dc/terms/W3CDTF')
  .register(dateEditor);
