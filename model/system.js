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


    /**
     * This method is a default implementation, feel free to override with specific construction of matched choices.
     * Returns a choice object containing a value and a label.
     * Override this function to provide specific loading of a choice.
     * If you need to do this asynchonously provide a "load" method on the returned choice object.
     * To indicate that a matched value is not acceptable anymore, set the flag mismatch to true in the returned choice object.
     *
     * @param item the RDForms template item matched against.
     * @param value the value to match
     * @param seeAlso if provided the value is a URI and a rdfs:seeAlso property has been found in the graph
     * @param graph the RDF graph where the value was matched
     * @returns {Object} an object containing a value, a label (object with language codes as attributes), an optional load callback method and an optional mismatch flag.
     * @see openChoiceSelector
     */
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

    /**
     * This method is a fake implementation for launching a dialog for choosing system choices.
     * The method MUST be overridden if the template you use depends on system choices.
     * (System choices in a RDForm template choice items means that there are neither inline choices
     * or an ontology URL given in combination with provided cached choices for the given ontology URL).
     *
     * @param {rdforms.model.Binding} binding the binding where the choice will be given
     * @param {Function} callback a method to call with a choice object when the user has selected an appropriate choice.
     */
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