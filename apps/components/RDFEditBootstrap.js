define(["dojo/_base/declare",
    "dojo/dom-class",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "./RDFEdit",
	"dojo/text!./RDFEditBootstrapTemplate.html"
], function(declare, domClass,  _WidgetBase, _TemplatedMixin,
            RDFEdit, template) {
    return declare([_WidgetBase, _TemplatedMixin, RDFEdit], {
        templateString: template,

        switchTab: function(syntax) {
            if (syntax === "rdf/json") {
                domClass.remove(this.rdfxmlTab, "active");
                domClass.add(this.rdfjsonTab, "active");
                domClass.remove(this.rdfxmlTabContent, "active");
                domClass.add(this.rdfjsonTabContent, "active");
            } else {
                domClass.remove(this.rdfjsonTab, "active");
                domClass.add(this.rdfxmlTab, "active");
                domClass.remove(this.rdfjsonTabContent, "active");
                domClass.add(this.rdfxmlTabContent, "active");
            }
        },

        rdfjsonClicked: function() {
            this.switchState("rdf/json");
        },
        rdfxmlClicked: function() {
            this.switchState("rdf/xml");
        }
    });
});