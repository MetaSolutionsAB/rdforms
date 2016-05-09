/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang",
    "dojo/topic",
    "dijit/layout/_LayoutWidget",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "./RDFEdit",
    "dijit/layout/TabContainer"/*NMD:Ignore*/,
    "dijit/layout/ContentPane"/*NMD:Ignore*/,
	"dojo/text!./RDFEditDijitTemplate.html"
], function(declare, lang, topic, _LayoutWidget,  _TemplatedMixin, _WidgetsInTemplateMixin,
            RDFEdit, TabContainer, ContentPane, template) {

    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, RDFEdit], {
        templateString: template,
        startup: function() {
            this.inherited("startup", arguments);
            topic.subscribe(this._tabContainer.id+"-selectChild", lang.hitch(this,
                function(child) {
                    var graph = this.getGraph();
                    if(child === this._rdfxmlTab) {
                        this.subView = "rdf/xml";
                    } else if(child === this._rdfjsonTab) {
                        this.subView = "rdf/json";
                    }
                    this.setGraph(graph);
                }));
        },
        resize: function( ){
            this.inherited("resize", arguments);
            if (this._tabContainer) {
                this._tabContainer.resize();
            }
        }
    });
});