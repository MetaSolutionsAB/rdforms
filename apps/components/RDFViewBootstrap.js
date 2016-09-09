define(["dojo/_base/declare",
    "dojo/dom-attr",
    "./RDFEditBootstrap",
	"dojo/text!./RDFViewBootstrapTemplate.html"
], function(declare, domAttr, RDFEditBootstrap, template) {

    return declare([RDFEditBootstrap], {
        templateString: template,
        setValueToNode: function(node, value) {
            domAttr.set(node, "innerHTML", value);
        },
        getValueFromNode: function(node) {
            return domAttr.get(node, "innerHTML");
        }
    });
});