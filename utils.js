/*global define*/
define(["exports", "rdforms/model/system"], function(exports, system) {
    exports.getLocalizedValue = function(hash) {
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
    };
    exports.getLocalizedMap = function(graphOrBinding, subject, propArr) {
        var graph;
        if (graphOrBinding.getItem) { //graphOrBinding is a Binding
            graph = graphOrBinding.getGraph();
            subject = graphOrBinding.getValue();
            propArr = graphOrBinding.getItem().getURIValueLabelProperties();
        } else {
            graph = graphOrBinding;
        }
        if (propArr == null || propArr.length == 0) {
            propArr = system.labelProperties;
        }
        var stmts;
        for (var i=0;i<propArr.length;i++) {
            stmts = graph.find(subject, propArr[i]);
            if (stmts.length > 0) {
                var obj = {};
                for (var s=0;s<stmts.length;s++) {
                    obj[stmts[s].getLanguage() || ""] = stmts[s].getValue();
                }
                return obj;
            }
        }
    };

    exports.cloneArrayWithLabels = function (objects) {
        var itemsArray = [];
        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            var currentLabel = exports.getLocalizedValue(o.label);
            var obj = {value: o.value, label: currentLabel.value || o.value || ""};
            if (o.top === true) {
                obj.top = true;
            }
            if (o.children != null) {
                obj.children = lang.clone(o.children);
            }
            if (o.selectable === false) {
                obj.selectable = false;
            } else {
                obj.selectable = true;
            }
            itemsArray.push(obj);
        }
        return itemsArray;
    };
    exports.extractGist = function(str, template) {
        if (template) {
            if (template.indexOf("$1") === -1) {
                template = template+"$1";
            }
            var r = (template+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1").replace("\\$1", "(.*)");
            var e = new RegExp(r).exec(str);
            if (e != null) {
                return e[1];
            }
        }
        return str;
    };
});