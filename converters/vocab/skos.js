define(["rdforms/converters/vocab/utils"], function (utils) {
    var skosNS = "http://www.w3.org/2004/02/skos/core#";
    var rdfsNS = "http://www.w3.org/2000/01/rdf-schema#";

    return {extractChoices: function(graph, conf) {
        conf = conf || {};
        if (!conf.labelPredicates) {
            conf.labelPredicates = [skosNS+"prefLabel"];
        }
        if (!conf.descriptionPredicates) {
            conf.descriptionPredicates = [rdfsNS+"comment"];
        }

        if (!conf.instancesOfClass) {
            conf.instancesOfClass = skosNS+"Concept";
        }
        return utils.extractChoices(graph, conf);
    }};
});