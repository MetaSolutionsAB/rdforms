/* eslint-disable class-methods-use-this */
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


export default class DateTimeBase {
  constructor(params, node) {
    this.binding = params.binding;
    this.context = params.context;
    this.item = this.binding.getItem();
    this.allowedOptions = getAllowedDateAlternatives(this.item);
    this._date = null;
    this._valid = false;
    this._excludeTime = true;
    this.domNode = node;
    this.buildUI();
    this.initDatePicker();
    this.initialize();
  }
  includeDateOption() {
    return this.allowedOptions.Date;
  }
  includeDateTimeOption() {
    return this.allowedOptions.Datetime;
  }
  includeYearOption() {
    return this.allowedOptions.Year;
  }

  buildUI() {
  }

  initDatePicker() {
  }

  initialize() {
    // Time input, assumes a this.timeInput input node
    const timePattern = '^([0-1][0-9]|2[0-3]):[0-5][0-9]$';
    this.$timeInput = jquery(this.timeInput).attr('pattern', '^([0-1][0-9]|2[0-3]):[0-5][0-9]$')
      .change(() => {
        const val = this.$timeInput.val();
        if (typeof this.$timeInput[0].checkValidity === 'function') {
          if (!this.$timeInput[0].checkValidity()) {
            return;
          }
        } else if ((new RegExp(timePattern)).test(val)) {
          return;
        }

        this._date.setHours(parseInt(val.substr(0, 2), 10),
          parseInt(val.substr(3, 2), 10));
        this.binding.setValue(this._date.toISOString());
      });

    // Year input, assumes a this.yearInput input node
    this.$yearInput = jquery(this.yearInput).attr('pattern', '^-?[0-9][0-9][0-9][0-9]$')
      .change(() => {
        const val = this.$yearInput.val();
        this._date.setYear(parseInt(val, 10));
        this.binding.setValue(val);
      });

    // Date control, assumes this.dateControl select node
    this.$dateControl = jquery(this.dateControl).change(() => {
      const val = this.$dateControl.val();
      this[`_show${val}`]();
    });

    this._binding2Gui();
  }

  setDateInPicker(/* dateinstance */) {
  }

  setDateInBinding(d) {
    this._valid = true;
    this._date.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
    const str = moment(d).toISOString();
    if (this._excludeTime) {
      this.binding.setValue(str.substring(0, str.indexOf('T')));
    } else {
      this.binding.setValue(str);
      this.$timeInput.prop('disabled', false);
    }
  }

  clear() {
    this._valid = false;
    jquery(this.domNode).find('input').val('');
  }

  //= ==================================================
  // Private methods
  //= ==================================================

  _binding2Gui() {
    this._firstTime = true;
    const data = this.binding.getValue();
    this._valid = data != null && data !== '';
    if (this._valid) {
      this._date = new Date(data);
      this._valid = this._date != null;
    }
    this._date = this._date || new Date('2000'); // TODO, why, do we always neew a date instance?
    if (this._valid) {
      if (/^\d{4}$/.test(data)) {
        this.$dateControl.val('Year');
        this._showYear();
      } else if (/T/.test(data) && data.indexOf('T00:00:00') === -1) {
        this.$dateControl.val('DateTime');
        this._showDateTime();
      } else {
        this.$dateControl.val('Date');
        this._showDate();
      }
    } else {
      this._showDate();
    }
    this._firstTime = false;
  }

  _showDate() {
    this._excludeTime = true;
    this.$yearInput.parent().hide();
    this.$timeInput.parent().hide();
    this.$datepicker.parent().show();
    if (this._valid) {
      this.setDateInPicker(this._date);
      const str = this._date.toISOString();
      if (!this._firstTime) {
        this.binding.setValue(str.substring(0, str.indexOf('T')));
        this.binding.setDatatype('xsd:date');
      }
    } else {
      this.setDateInPicker(null);
    }
  }

  _showDateTime() {
    this._excludeTime = false;
    this.$yearInput.parent().hide();
    this.$timeInput.parent().show();
    this.$datepicker.parent().show();

    if (this._valid) {
      if (this._date.getHours() !== 0 || this._date.getMinutes() !== 0) {
        let h = this._date.getHours();
        h = h <= 9 ? `0${h}` : h;
        let m = this._date.getMinutes();
        m = m <= 9 ? `0${m}` : m;
        this.$timeInput.val(`${h}:${m}`);
      } else {
        this.$timeInput.val('');
      }
      this.setDateInPicker(this._date);
      if (!this._firstTime) {
        this.binding.setValue(this._date.toISOString());
        this.binding.setDatatype('xsd:dateTime');
      }
    } else {
      this.setDateInPicker(null);
      // this.$timeInput.prop("disabled", true);
      this.$timeInput.val('');
    }
  }

  _showYear() {
    this.$yearInput.parent().show();
    this.$timeInput.parent().hide();
    this.$datepicker.parent().hide();

    if (this._valid) {
      this.$yearInput.val(this._date.getFullYear());
      if (!this._firstTime) {
        this.binding.setValue(`${this._date.getFullYear()}`);
        this.binding.setDatatype('xsd:gYear');
      }
    } else {
      this.$yearInput.val('');
    }
  }

  _setValueAttr(v) {
    this.binding.setValue(v);
  }
}

DateTimeBase.register = (DTCls) => {
  // Editor for dates and dates with time.
  const dateEditor = (fieldDiv, binding, context) => {
    const dt = new DTCls({
      messages: context.view.messages,
      binding,
      context,
    }, jquery('<div>').appendTo(fieldDiv)[0]);
    context.clear = () => {
      dt.clear();
    };
  };
  const editors = renderingContext.editorRegistry;
  editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#date').register(dateEditor);
  editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#dateTime').register(dateEditor);
  editors.itemtype('text').datatype('http://www.w3.org/2001/XMLSchema#gYear').register(dateEditor);
  editors.itemtype('text').datatype('http://purl.org/dc/terms/W3CDTF').register(dateEditor);
};
