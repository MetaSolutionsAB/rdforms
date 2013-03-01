/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang", 
	"dijit/_WidgetsInTemplateMixin", 
	"dojo/text!./DurationTemplate.html", 
	"./DurationPresentation", 
	"dijit/form/NumberSpinner" //Needed only for the template.
], function(declare, lang,  _WidgetsInTemplateMixin, template, DurationPresentation, NumberSpinner) {

    return declare([DurationPresentation, _WidgetsInTemplateMixin], {
	templateString: template,

	postCreate: function() {
		this.inherited("postCreate", arguments);
		this.yearsSpinner.onChange = lang.hitch(this, function () {this.onChange();});
		this.monthsSpinner.onChange = lang.hitch(this, function () {this.onChange();});
		this.daysSpinner.onChange = lang.hitch(this, function () {this.onChange();});
		this.minutesSpinner.onChange = lang.hitch(this, function () {this.onChange();});
	},
	
	onChange: function() {
	},
	
	_getValueAttr: function() {
		this.attr("years");
		this.attr("months");
		this.attr("days");
		this.attr("hours");
		this.attr("minutes");
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
		this.yearsSpinner.attr("value", value);
		this.years = value;
	},
	_setMonthsAttr: function(value) {
		this.monthsSpinner.attr("value", value);
		this.months = value;
	},
	_setDaysAttr: function(value) {
		this.daysSpinner.attr("value", value);
		this.days = value;
	},
	_setHoursAttr: function(value) {
		this.hoursSpinner.attr("value", value);
		this.hours = value;
	},
	_setMinutesAttr: function(value) {
		this.minutesSpinner.attr("value", value);
		this.minutes = value;
	},
	_getYearsAttr: function() {
		this.years = this.yearsSpinner.attr("value");
		return this.years;
	},
	_getMonthsAttr: function() {
		this.months = this.monthsSpinner.attr("value");
		return this.months;
	},
	_getDaysAttr: function() {
		this.days = this.daysSpinner.attr("value");
		return this.days;
	},
	_getHoursAttr: function() {
		this.hours = this.hoursSpinner.attr("value");
		return this.hours;
	},
	_getMinutesAttr: function() {
		this.minutes = this.minutesSpinner.attr("value");
		return this.minutes;
	}
    });
});