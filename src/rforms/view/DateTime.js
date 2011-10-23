dojo.provide("rforms.view.DateTime");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.DateTextBox");

dojo.declare("rforms.view.DateTime", [dijit._Widget], {
	//===================================================
	// i18n attributes
	//===================================================
	widgetsInTemplate: true,
	yearChoiceLabel: "Year",
	dateChoiceLabel: "Date",
//	dateTimeChoiceLabel: "Date and Time",

	//===================================================
	// Public attributes
	//===================================================
	binding: null,
	item: null,

	//===================================================
	// Private attributes
	//===================================================
	_date: null,
	_valid: false,
	_firstTime: true,

	//===================================================
	// Inherited methods
	//===================================================
	buildRendering: function() {
		this.domNode = this.srcNodeRef || dojo.create("div");
		this.editorNode = dojo.create("span", null, this.domNode);
		this.formatChooserNode = dojo.create("span", null, this.domNode);
		var data = this.binding.getValue();
		this._valid = data != null && data != "";
		if (this._valid) {
			this._date = dojo.date.stamp.fromISOString(data);
			this._valid = this._date != null;
		}
		this._date = this._date || new Date();
		
		if (this._valid) {
			if (/^\d{4}$/.test(data)) {
				this._showYear();
				this._renderFormatChooser("Year");
			} else if (/T/.test(data) && data.indexOf("T00:00:00")=== -1) {
				this._showDateTime();
				this._renderFormatChooser("DateTime");
			} else {
				this._showDate();
				this._renderFormatChooser("Date");
			}
		} else {
			this._showDate();
			this._renderFormatChooser("Date");
		}
	},

	//===================================================
	// Private methods
	//===================================================
	_renderFormatChooser: function(option) {
		if (this._formatChooser) {
			this._formatChooser.destroy();
		}
		var options = [{label: "Year", value: "Year"}, {label: "Date", value: "Date"}, {label: "Date and time", value: "DateTime"}];
		dojo.forEach(options, function(opt) {
			if (opt.value === option) {
				opt.selected = true;
			}
		});
		this._formatChooser = new dijit.form.Select({
//				style: {"font-size": "x-small"},
				options: options,
				onChange: dojo.hitch(this, function(item) {
					this["_show"+item]();
				})}, dojo.create("div", null, this.formatChooserNode));
	},
	_destroyEditors: function() {
		this._firstTime = false;
		var editors = ["cal", "year", "hour", "minute"];
		dojo.forEach(editors, function(e) {
			var a = "_"+e+"Editor";
			if (this[a] != null) {
				this[a].destroy();
				delete this[a];
			}
		}, this);
		dojo.attr(this.editorNode, "innerHTML", "");
	},

	_showDate: function() {
		var d = this._firstTime ? null : new Date();
		this._destroyEditors();
		
		//Set date.
		if (this._valid) {
			d = this._date;
			var str = dojo.date.stamp.toISOString(this._date);
			this.binding.setValue(str.substring(0,str.indexOf('T')));			
		}
		
		this._calEditor = new dijit.form.DateTextBox({
					style: {width: "10em"},
					value: d,
					disabled: !this.item.isEnabled(),
					invalidMessage: "Proper date format is required, value will not be saved",
					onChange: dojo.hitch(this, function(v){
						this._valid = this._calEditor.isValid() && v != null;
						if (this._valid) {
							this._date.setFullYear(v.getFullYear(), v.getMonth(), v.getDate());
							var str = dojo.date.stamp.toISOString(v);
							this.binding.setValue(str.substring(0,str.indexOf('T')));
						} else {
							this.binding.setValue("");
						}
					})
				}, dojo.create("div", null, this.editorNode));
	},
	_showDateTime: function() {
		this._destroyEditors();
		
		var d = new Date();
		//Set datetime.
		if (this._valid) {
			d = this._date;
			this.binding.setValue(dojo.date.stamp.toISOString(this._date));
		}

		var update = dojo.hitch(this, function() {
			var nd = this._calEditor.get("value"), h = this._hourEditor.get("value"), m = this._minuteEditor.get("value");
			this._valid = this._calEditor.isValid() && nd!=null && this._hourEditor.isValid() && !isNaN(h) && this._minuteEditor.isValid() && !isNaN(m);
			
			if (this._valid) {
				var nd = this._calEditor.get("value");
				nd.setHours(this._hourEditor.get("value"), this._minuteEditor.get("value"));
				this.binding.setValue(dojo.date.stamp.toISOString(nd));
				this._date = nd;
			} else {
				this.binding.setValue("");
			}
		});
		this._calEditor = new dijit.form.DateTextBox({
				style: {width: "10em"},
				value: d,
				disabled: !this.item.isEnabled(),
				invalidMessage: "Proper date format is required, value will not be saved",
				onChange: update
			}, dojo.create("div", null, this.editorNode));
		dojo.create("span", {innerHTML: "&nbsp;H:"}, this.editorNode);
		this._hourEditor = new dijit.form.NumberSpinner({
				style: {width: "3em"},
				editOptions: {pattern: "##"},
				constraints: {pattern: "##", min: 0, max: 23, places: 0},
				value: d.getHours(), 
				smallDelta: 1,
				intermediateChanges: true,
				onChange: update
			},dojo.create("div", null, this.editorNode));
		dojo.create("span", {innerHTML: "&nbsp;M:"}, this.editorNode);
		this._minuteEditor = new dijit.form.NumberSpinner({
				style: {width: "3em"},
				editOptions: {pattern: "##"},
				constraints: {pattern: "##", min: 0, max: 59, places: 0},
				value: d.getMinutes(),
				smallDelta: 1,
				intermediateChanges: true,
				onChange: update
			},dojo.create("div", null, this.editorNode));
	},
	_showYear: function() {
		this._destroyEditors();
		
		var d = new Date();
		//Set year.
		if (this._valid) {
			d = this._date;
			this.binding.setValue(""+this._date.getFullYear());			
		}

		this.binding.setValue(""+d.getFullYear());
		this._yearEditor = new dijit.form.NumberSpinner({
				style: {width: "6em"},
				editOptions: {pattern: "####"},
				constraints: {pattern: "####", min: 0, max: 9999, places: 0},
				value: d.getFullYear(),
				smallDelta: 1,
				intermediateChanges: true,
				onChange: dojo.hitch(this, function(v) {
					this._valid = this._yearEditor.isValid();
					if (this._valid) {
						this.binding.setValue(""+dojo.date.stamp.fromISOString(v).getFullYear());
						this._date.setFullYear(v);
					} else {
						this.binding.setValue("");						
					}
				})},
			dojo.create("div", null, this.editorNode));
	},
	_setValueAttr: function(v) {
		this.binding.setValue(v);
	}
});