define(["exports"], function (exports) {
    var rdfNS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

    var langMap = function(stmts) {
        var lang2value = {}, empty = true;
        for (var i=0;i< stmts.length; i++) {
            lang2value[stmts[i].getLanguage() || ""] = stmts[i].getValue();
            empty = false;
        }
        if (!empty) {
            return lang2value;
        }
    };

    var findStmtsFor = function(graph, resource, preds) {
        var stmts;
        for (var i=0; i<preds.length;i++) {
            stmts = graph.find(resource, preds[i]);
            if (stmts) {
                return stmts;
            }
        }
        return [];
    };

    return exports = {
        findLabels: function(graph, resource, conf) {
            return langMap(findStmtsFor(graph, resource, conf.labelPredicates));
        },
        findDescriptions: function(graph, resource, conf) {
            return langMap(findStmtsFor(graph, resource, conf.descriptionPredicates));
        },
        findValue: function(graph, resource, conf) {
            if (conf.valuePredicates) {
                for (var i = 0; i < conf.valuePredicates.length; i++) {
                    var value = graph.findFirstValue(resource, conf.valuePredicates[i]);
                    if (value != null) {
                        return value;
                    }
                }
            }
            return resource;
        },
        extractChoice: function(graph, res, conf) {
            var c = {
                value: exports.findValue(graph, res, conf),
                label: exports.findLabels(graph, res, conf)
            };
            var d = exports.findDescriptions(graph, res, conf);
            if (d != null) {
                c.description = d;
            }
            if (conf.requireOneOfLanguages == null) {
                return c;
            } else {
                for (var l=0;l<conf.requireOneOfLanguages.length;l++) {
                    if (c.label[conf.requireOneOfLanguages[l]] != null) {
                        return c;
                    }
                }
            }
        },
        extractChoices: function(graph, conf) {
            var choices = [];
            var stmts = graph.find(null, rdfNS+"type", {type: "uri", value: conf.instancesOfClass});
            for (var i=0;i<stmts.length;i++) {
                var c = exports.extractChoice(graph, stmts[i].getSubject(), conf);
                if (c != null) {
                    choices.push(c);
                }
            }

            return choices;
        }
    };
});