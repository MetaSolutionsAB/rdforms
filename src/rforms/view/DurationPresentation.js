/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang", 
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./DurationPresentationTemplate.html"
], function(declare, lang, _WidgetBase, _TemplatedMixin, template) {

    return declare([_WidgetBase, _TemplatedMixin], {
	templateString: template,

	yearsLabel: "", _setYearsLabelAttr: {node: "yearsLabelNode", type: "innerHTML"},
	monthsLabel: "", _setMonthsLabelAttr: {node: "monthsLabelNode", type: "innerHTML"},
	daysLabel: "", _setDaysLabelAttr: {node: "daysLabelNode", type: "innerHTML"},
	hoursLabel: "", _setHoursLabelAttr: {node: "hoursLabelNode", type: "innerHTML"},
	minutesLabel: "", _setMinutesLabelAttr: {node: "minutesLabelNode", type: "innerHTML"},
	years: 0, _setYearsAttr: {node: "yearsNode", type: "innerHTML"},
	months: 0, _setMonthsAttr: {node: "monthsNode", type: "innerHTML"},
	days: 0, _setDaysAttr: {node: "daysNode", type: "innerHTML"},
	hours: 0, _setHoursAttr: {node: "hoursNode", type: "innerHTML"},
	minutes: 0, _setMinutesAttr: {node: "minutesNode", type: "innerHTML"},
	
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
});
    
