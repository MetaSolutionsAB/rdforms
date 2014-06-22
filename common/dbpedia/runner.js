//#!/usr/bin/env node

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require, baseUrl: '../../../'});

var conf = {
    source: "terms.rdf",
    destination: "../../templates/dbpo-properties.json",
    ns: "http://dbpedia.org/ontology/",
    abbrev: "dbpo",
    literalNodeTypeDefault: "ONLY_LITERAL",
    nonGroupCardinalityDefault: {pref: 1},
    datatypeBases: ["http://dbpedia.org/datatype/"],
    typeForUnknownRange: "choice",
    allClassesMajor: true,
    ignore: [],
    ignoreAllClasses: true,
    specs: {
        "abstract": {nodetype: "LANGUAGE_LITERAL", styles: ["multiline"]},
        "wikiPageExternalLink" : {styles: ["externalLink"]},
        "thumbnail" : {styles: ["image"]},
        "isPrimaryTopicOf": {styles: ["externalLink"]}
    },
    order: [],
    label: {en: "Additional information"}
};

requirejs(['fs', 'rdfjson/Graph', 'rdfjson/formats/converters', 'rdforms/converters/RDFS/converter'],
    function (fs, Graph, conv, rdfsconv) {
        fs.readFile(conf.source, 'utf8', function(err, data) {
            var graph = conv.rdfxml2graph(data);
            var sirf = rdfsconv.convert(graph, conf);
            var fd = fs.openSync(conf.destination, "w");
            fs.writeSync(fd, JSON.stringify(sirf, true, 1), 0, "utf8");
        });
    }
);