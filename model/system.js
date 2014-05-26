define(["exports", "rdforms/utils", "dojo/dom-attr"], function(exports, utils, domAttr) {

    exports.getFallbackChoice = function(item, value, seeAlso, graph) {
        if (item.getNodetype() === "URI") {
            var lmap = utils.getLocalizedMap(graph, value, item.getURIValueLabelProperties());
            if (!lmap) {
                var lastHash = value.lastIndexOf("#"), lastSlash = value.lastIndexOf("/");
                lmap = {"": value.substring(1+ (lastHash > lastSlash ? lastHash : lastSlash > lastHash ? lastSlash : 0))};
            }
            return {"value": value, "label": lmap};
        } else {
            return {"value": value, "label": value};
        }
    };


    exports.getChoice = function(item, value, seeAlso, graph) {
        return exports.getFallbackChoice(item, value, seeAlso, graph);
    };
    exports.labelProperties = [
        "http://www.w3.org/2000/01/rdf-schema#label",
        "http://purl.org/dc/terms/title",
        "http://purl.org/dc/elements/1.1/title",
        "http://www.w3.org/2004/02/skos/core#prefLabel",
        "http://xmlns.com/foaf/0.1/name",
        "http://xmlns.com/foaf/name"
    ];
    exports.openChoiceSelector = function(binding, callback) {
        alert("This alert is a placeholder for a search dialog that should be provided as part of the integration of RDForms into a wider system.\n" +
            "Simply require the AMD module 'rdforms/model/system' and override the methods 'getChoices' and 'openChoiceSelector'.");
        callback({"value": "http://example.com/choice1",
            "label": {"en": "First choice", "sv": "Första valet "}});
    };
    exports.attachExternalLinkBehaviour = function(node, binding) {
        domAttr.set(node, "target", "_blank");
    };
    exports.attachLinkBehaviour = function(node, binding) {
        //Deprecated default behaviour, should not be given per choice...
        //remove and let each implementation override this function instead
        //so the behaviour is added for all links.
        if (binding.getItem().getType() === "choice") {
            var choice = binding.getChoice();
            if (choice.onClick) {
                on(node, "click", function (e) {
                    event.stop(e);
                    choice.onClick(e);
                });
            }
            if (choice.target) {
                domAttr.set(node, "target", choice.target);
            }
        }
        //---end deprecated code---
    };
});