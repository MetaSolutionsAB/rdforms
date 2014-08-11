define(["rdforms/converters/vocab/utils", "rdfjson/Rdfs"], function (utils, Rdfs) {
    var rdfsNS = "http://www.w3.org/2000/01/rdf-schema#";

    return {
        /**
         * Requires a Class to calculate the instances from, i.e. a conf with a instancesOfClass attribute.
         */
        extractChoices: function(graph, conf) {
            if (!conf.labelPredicates) {
                conf.labelPredicates = [rdfsNS+"label"];
            }
            if (!conf.descriptionPredicates) {
                conf.descriptionPredicates = [rdfsNS+"comment"];
            }

            var choices = [];
            var rdfs = new Rdfs();
            rdfs.addGraph(graph);
            if (rdfs.isClass(conf.instancesOfClass)) {
                var cls = rdfs.getClass(conf.instancesOfClass);
                var res = rdfs.getInstances(cls);
                for (var i=0;i<res.length;i++) {
                    var c = utils.extractChoice(graph, res[i], conf);
                    if (c != null) {
                        choices.push(c);
                    }
                }
            } else {
                return utils.extractChoices(graph, conf);
            }
            return choices;
    }};
});