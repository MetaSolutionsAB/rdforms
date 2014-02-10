/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang", 
	"dijit/_WidgetsInTemplateMixin", 
	"dojo/text!./DurationTemplate.html", 
	"./DurationPresentation"
], function(declare, lang,  _WidgetsInTemplateMixin, template, DurationPresentation) {

    return declare([DurationPresentation, _WidgetsInTemplateMixin], {
	templateString: template,
	regex: /^([\-\+])?P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+(?:\.[0-9]+)?)?S)?)$/,

	postCreate: function() {
	    this.inherited("postCreate", arguments);
	    var data = this.binding.getValue();
	    var arr = this.regex.exec(data);
	    if (arr != null) {
		if (arr[2] != null) {
		    this._setYearsAttr(arr[2]);
		}
		if (arr[3] != null) {
		    this._setMonthsAttr(arr[3]);
		}
		if (arr[4] != null) {
		    this._setDaysAttr(arr[4]);
		}
		if (arr[5] != null) {
		    this._setHoursAttr(arr[5]);
		}
		if (arr[6] != null) {
		    this._setMinutesAttr(arr[6]);
		}
	    }

	    this.yearsSpinner.onChange = lang.hitch(this, function () {this.onChange();});
	    this.monthsSpinner.onChange = lang.hitch(this, function () {this.onChange();});
	    this.daysSpinner.onChange = lang.hitch(this, function () {this.onChange();});
	    this.hoursSpinner.onChange = lang.hitch(this, function () {this.onChange();});
	    this.minutesSpinner.onChange = lang.hitch(this, function () {this.onChange();});
	},
	
	onChange: function() {
	    this.binding.setValue(this.get("value"));
	},
	
	_getValueAttr: function() {
		this.get("years");
		this.get("months");
		this.get("days");
		this.get("hours");
		this.get("minutes");
		if (this.years || this.months || this.days || this.hours || this.minutes) {
			var str = "P"+(this.years ? ""+this.years+"Y" : "")
					+ (this.months ? ""+this.months+"M" : "")
					+ (this.days ? ""+this.days+"D" : "");
			if (this.hours || this.minutes) {
				str = str + "T"
						+ (this.hours ? ""+this.hours+"H" : "")
						+ (this.minutes ? ""+this.minutes+"M" : "");
			}
			return str;
		}
		return null;
	},
	_setYearsAttr: function(value) {
		this.yearsSpinner.set("value", value);
		this.years = value;
	},
	_setMonthsAttr: function(value) {
		this.monthsSpinner.set("value", value);
		this.months = value;
	},
	_setDaysAttr: function(value) {
		this.daysSpinner.set("value", value);
		this.days = value;
	},
	_setHoursAttr: function(value) {
		this.hoursSpinner.set("value", value);
		this.hours = value;
	},
	_setMinutesAttr: function(value) {
		this.minutesSpinner.set("value", value);
		this.minutes = value;
	},
	_getYearsAttr: function() {
		this.years = this.yearsSpinner.get("value");
		return this.years;
	},
	_getMonthsAttr: function() {
		this.months = this.monthsSpinner.get("value");
		return this.months;
	},
	_getDaysAttr: function() {
		this.days = this.daysSpinner.get("value");
		return this.days;
	},
	_getHoursAttr: function() {
		this.hours = this.hoursSpinner.get("value");
		return this.hours;
	},
	_getMinutesAttr: function() {
		this.minutes = this.minutesSpinner.get("value");
		return this.minutes;
	}
    });
});