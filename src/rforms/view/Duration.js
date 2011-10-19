dojo.provide("rforms.view.Duration");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.layout.ContentPane");

dojo.declare("rforms.view.DurationPresentation", [dijit._Widget, dijit._Templated], {	
	templatePath: dojo.moduleUrl("rforms.view", "DurationPresentationTemplate.html"),
	widgetsInTemplate: true,
	attributeMap: dojo.mixin(dojo.clone(dijit.layout.ContentPane.prototype.attributeMap), {
		yearsLabel: {node: "yearsLabelNode", type: "innerHTML"},
		monthsLabel: {node: "monthsLabelNode", type: "innerHTML"},
		daysLabel: {node: "daysLabelNode", type: "innerHTML"},
		hoursLabel: {node: "hoursLabelNode", type: "innerHTML"},
		minutesLabel: {node: "minutesLabelNode", type: "innerHTML"},
		years: {node: "yearsNode", type: "innerHTML"},
		months: {node: "monthsNode", type: "innerHTML"},
		days: {node: "daysNode", type: "innerHTML"},
		hours: {node: "hoursNode", type: "innerHTML"},
		minutes: {node: "minutesNode", type: "innerHTML"}		
	}),
	yearsLabel: "",
	monthsLabel: "",
	daysLabel: "",
	hoursLabel: "",
	minutesLabel: "",
	years: 0,
	months: 0,
	days: 0,
	hours: 0,
	minutes: 0,
	
	_setValueAttr: function(value) {
		var f = function(value) {
			return value && value.length > 1 ? parseInt(value[0], 10) : 0;
		}
		this.attr("years", f(value.match(/([0-9])*Y/)));
		this.attr("days", f(value.match(/([0-9])*D/)));
		this.attr("hours", f(value.match(/([0-9])*H/)));
		if (value.indexOf("T") == -1) {
			this.attr("months", f(value.match(/([0-9])*M/)));
		} else {
			var arr = value.split("T");
			this.attr("months", f(arr[0].match(/([0-9])*M/)));
			this.attr("minutes", f(arr[1].match(/([0-9])*M/)));
		}
	}
});

dojo.declare("rforms.view.Duration", rforms.view.DurationPresentation, {	
	templatePath: dojo.moduleUrl("rforms.view", "DurationTemplate.html"),
	attributeMap: dojo.mixin(dojo.clone(dijit.layout.ContentPane.prototype.attributeMap), {
		yearsLabel: {node: "yearsLabelNode", type: "innerHTML"},
		monthsLabel: {node: "monthsLabelNode", type: "innerHTML"},
		daysLabel: {node: "daysLabelNode", type: "innerHTML"},
		hoursLabel: {node: "hoursLabelNode", type: "innerHTML"},
		minutesLabel: {node: "minutesLabelNode", type: "innerHTML"}
	}),
	
	postCreate: function() {
		this.inherited("postCreate", arguments);
		this.yearsSpinner.onChange = dojo.hitch(this, function () {this.onChange();});
		this.monthsSpinner.onChange = dojo.hitch(this, function () {this.onChange();});
		this.daysSpinner.onChange = dojo.hitch(this, function () {this.onChange();});
		this.minutesSpinner.onChange = dojo.hitch(this, function () {this.onChange();});
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