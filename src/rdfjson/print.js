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

    exports.nsify = function(uri) {
        for (var ns in nss) {
            if (uri.indexOf(nss[ns]) === 0) {
                return _nsify(ns, nss[ns], uri.substring(nss[ns].length));
            }
        }
        var slash = uri.lastIndexOf("/");
        var hash = uri.lastIndexOf("#");
        if (hash> slash) {
            slash = hash;
        }
        nscounter++;
        return _nsify("ns"+nscounter, uri.substring(0,slash+1),uri.substring(slash+1));
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
                pretty[exports.nsify(stmt.getPredicate()).pretty] = stmt.getValue();
            }
        }
        return pretty;
    };

    exports.statementTree = function(graph, subject, visited) {
        visited = visited || {};
        var stmts = graph ? graph.find(subject) : [];
        var arr = [];
        for (var i=0;i<stmts.length;i++) {
            var stmt = stmts[i];
            if (stmt.getType() === "literal") {
                arr.push({stmt: stmt});
            } else {
                var row = {stmt: stmt};
                var obj = stmt.getValue();
                if (!visited[obj]) {
                    visited[obj] = true;
                    row.children = exports.statementTree(graph, obj, visited);
                }
            }
        }
        return arr;
    };

    exports.statementList = function(graph, subject) {
        var tree = exports.statementTree(graph, subject);
        var arr = [];
        var f = function(stmts, level) {
            for (var i = 0;i<stmts.length;i++) {
                var stmt = stmts[i];
                stmt.indent = level;
                arr.push(stmt);
                if (stmt.children) {
                    f(stmt.children, level +1);
                    delete stmt.children;
                }
            }
        };
        f(tree, 1);
        return arr;
    };

    exports.prettyTree = function(graph, subject) {
        var delegates = exports.statementList(graph, subject);
        for (var i=0;i<delegates.length;i++) {
            var delegate = delegates[i], stmt = delegate.stmt;
            if (stmt.isSubjectBlank()) {
                delegate.s = stmt.getSubject();
            } else {
                delegate.s = exports.nsify(stmt.getSubject()).pretty;
            }
            delegate.p = exports.nsify(stmt.getPredicate()).pretty;
            var t = stmt.getType();
            if (t === "uri") {
                delegate.o = exports.nsify(stmt.getValue()).pretty;
                var lang = stmt.getLanguage(), dt = stmt.getDatatype();
                if (lang != null) {
                    delegate.o += "@@"+lang;
                } else if (dt != null) {
                    delegate.o += "^^"+dt;
                }
            } else if (t === "literal") {
                delegate.o = "\""+stmt.getValue()+"\"";
            } else {
                delegate.o = "\""+stmt.getValue()+"\"";
            }
        }
        return delegates;
    };
    return exports;
});