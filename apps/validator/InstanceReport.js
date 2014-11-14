/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang", 
	"dojo/_base/array",
	"dojo/window",
	"dojo/dom-class",
	"dojo/dom-construct",
    "dojo/dom-style",
    "dojo/query",
    "dojo/NodeList-dom"/*NMD:Ignore*/,
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "dijit/TitlePane"/*NMD:Ignore*/,
    "dijit/Dialog",
	"rdforms/model/Engine",
	"rdforms/view/ValidationPresenter",
	"dojo/text!./InstanceReportTemplate.html"
], function(declare, lang, array, window, domClass, domConstruct, domStyle, query, NodeListDom, _WidgetBase,
            _TemplatedMixin, _WidgetsInTemplateMixin, TitlePane, Dialog, Engine, ValidationPresenter, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
	// Public attributes
	//===================================================
        report: null,
        template: null,
        graph: null,
        messages: null,

	// Inherited attributes
	//===================================================
	templateString: template,
	
	// Inherited methods
	//===================================================
	postCreate: function() {
	    this.inherited("postCreate", arguments);


        //Button in titlebar
        var node = domConstruct.create("button", {innerHTML: "<span class='glyphicon glyphicon-eye-open'></span>&nbsp;"+this.messages.view,
            type: "button", "class": "instanceDetails btn btn-primary btn-sm",
            onclick: lang.hitch(this, this._openView)
        });
        query(".dijitTitlePaneTitle", this._pane.domNode).addContent(node, "before");

        var titleStr = this.report.uri;
        if (this.report.errors.length > 0 || this.report.warnings.length > 0) {
		    var table = domConstruct.create("table", {"class": "report"}, this._reportNode);
		    var head = domConstruct.create("tr", null, table);
		    domConstruct.create("th", {innerHTML: this.messages.severity}, head);
		    domConstruct.create("th", {innerHTML: this.messages.path}, head);
		    domConstruct.create("th", {innerHTML: this.messages.problem}, head);
            var errorM = this.messages.error.split(",");
            var warningM = this.messages.warning.split(",");
		    array.forEach(this.report.errors, function(err) {
                var row = domConstruct.create("tr", {"class": "error"}, table);
                domConstruct.create("td", {innerHTML: errorM[0]}, row);
                domConstruct.create("td", {innerHTML: err.path}, row);
                domConstruct.create("td", {innerHTML: this.messages["report_"+err.code]}, row);
            }, this);
		    array.forEach(this.report.warnings, function(warn) {
                var row = domConstruct.create("tr", {"class": "warning"}, table);
                domConstruct.create("td", {innerHTML: warningM[0]}, row);
                domConstruct.create("td", {innerHTML: warn.path}, row);
                domConstruct.create("td", {innerHTML: this.messages["report_"+warn.code]}, row);
            }, this);
            if (this.report.errors.length > 0) {
                titleStr += " &nbsp;"+this.report.errors.length+" "+(this.report.errors.length > 1 ?  errorM[1]: errorM[0]);
                domClass.add(this.domNode, "error");
            } else if (this.report.warnings.length > 0) {
                titleStr += " &nbsp;"+this.report.warnings.length+" "+(this.report.warnings.length > 1 ? warningM[1] : warningM[0]);
                domClass.add(this.domNode, "warning");
            }
            this._pane.set("title", titleStr);
		} else {
            var val = lang.replace(this.messages.instanceOk, {instance: this.report.uri});
		    domConstruct.create("div", {"class": "instanceHeading", "innerHTML": "<span class='action info'></span>&nbsp;"+val,
					     onclick: lang.hitch(this, this._openView)}, this._reportNode);
            this._pane.set("title", titleStr);
		}
	},
	_openView: function() {
        var binding = Engine.match(this.graph, this.report.uri, this.template);
	    var node = domConstruct.create("div");
	    var dialog = new Dialog({"content": node, title: binding.getChildrenRootUri()});
	    var presenter = new ValidationPresenter({template: template, binding: binding, includeLevel: "recommended", compact: true}, node);
	    var viewport = window.getBox();
	    domStyle.set(presenter.domNode, {
		width: Math.floor(viewport.w * 0.70)+"px",
                height: Math.floor(viewport.h * 0.70)+"px",
                overflow: "auto",
                position: "relative"    // workaround IE bug moving scrollbar or dragging dialog
	    });
	    dialog.show();
	}
    });
});