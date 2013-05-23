/*global define*/
define(["./Graph"], function (Graph) {
    var exports = {};

    var nss = {
        ical: "http://www.w3.org/2002/12/cal/ical#",
        role: "http://purl.org/role/terms/",
        dcterms: "http://purl.org/dc/terms/",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        owl: "http://www.w3.org/2002/07/owl#",
        vs: "http://www.w3.org/2003/06/sw-vocab-status/ns#",
        foaf: "http://xmlns.com/foaf/0.1/",
        wot: "http://xmlns.com/wot/0.1/",
        dc: "http://purl.org/dc/elements/1.1/"
    };
    var nscounter = 0;
    var _nsify = function(ns, expanded, localname) {
        if (!nss[ns]) {
            nss[ns] = expanded;
        }
        return {abbrev: ns, ns: expanded, localname: localname, full: expanded+localname, pretty: ns+":"+localname};
    }
    var nsify = function(prop) {
        for (var ns in nss) {
            if (prop.indexOf(nss[ns]) === 0) {
                return _nsify(ns, nss[ns], prop.substring(nss[ns].length));
            }
        }
        var slash = prop.lastIndexOf("/");
        var hash = prop.lastIndexOf("#");
        if (hash> slash) {
            slash = hash;
        }
        nscounter++;
        return _nsify("ns"+nscounter, prop.substring(0,slash+1),prop.substring(slash+1));
    };


    exports.getNamespaces = function() {
        return nss;
    };

    /**
     * @param {rdfjson.Graph} graph
     * @param {String} subject a URI for the subject to focus on
     */
    exports.pretty = function(graph, subject) {
        var pretty = {};
        var stmts = graph.find(subject);
        for (var i=0;i<stmts.length;i++) {
            var stmt = stmts[i];
            if (stmt.getType() != "bnode") {
                pretty[nsify(stmt.getPredicate()).pretty] = stmt.getValue();
            }
        }
        return pretty;
    };
    return exports;
});