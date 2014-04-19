/*global define*/
define({
    getLocalizedValue: function(hash) {
        if (hash == null) {
            return {precision: "none"};
        } else if (dojo.isString(hash)) {
            return {value: hash, precision: "nolang", lang: ""};
        } else if (hash.hasOwnProperty(dojo.locale)) {
            return {value: hash[dojo.locale], precision: "exact", lang: dojo.locale};
        } else {
            var pos = dojo.locale.indexOf("_");
            if (pos > -1 && hash.hasOwnProperty(dojo.locale.substr(0,2))) {
            return {value: hash[dojo.locale.substr(0,2)], precision: "coarsen", lang: dojo.locale.substr(0,2)};
            } else if (hash.hasOwnProperty("en")) {
            return {value: hash["en"], precision: "default", lang: "en"};
            } else if (hash.hasOwnProperty("")) {
            return {value: hash[""], precision: "nolang", lang: ""};
            } else {
            for (var prop in hash) {
                return {value: hash[prop], precision: "any", lang: prop};
            }
            return {precision: "none"};
            }
        }
    },
    getLocalizedMap: function(graph, subject, property) {
        var stmts = graph.find(subject, property);
        if (stmts.length > 0) {
            var map = {};
            for (var i=0;i<stmts.length;i++) {
                map[stmts[i].getLanguage() ||  ""] = stmts[i].getValue();
            }
            return map;
        }
    }
});