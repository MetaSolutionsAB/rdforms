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

        switchTo: function(syntax) {
            var graph;
            try {
                graph = this.getGraph();
            } catch (err) {
            }
            this.subView = syntax;
            if (graph) {
                this.setGraph(graph);
            }
        },

        rdfjsonClicked: function() {
            domClass.remove(this.rdfxmlTab, "active");
            domClass.add(this.rdfjsonTab, "active");
            domClass.remove(this.rdfxmlTabContent, "active");
            domClass.add(this.rdfjsonTabContent, "active");
            this.switchTo("rdf/json");
        },
        rdfxmlClicked: function() {
            domClass.remove(this.rdfjsonTab, "active");
            domClass.add(this.rdfxmlTab, "active");
            domClass.remove(this.rdfjsonTabContent, "active");
            domClass.add(this.rdfxmlTabContent, "active");
            this.switchTo("rdf/xml");
        }
    });
});