/*global define*/
define([
    "exports",
    "dojo/_base/lang",
    "dojo/_base/kernel",
    "rdforms/model/system"
], function(exports, lang, kernel, system) {
    exports.getLocalizedValue = function(hash) {
        if (hash == null) {
            return {precision: "none"};
        } else if (lang.isString(hash)) {
            return {value: hash, precision: "nolang", lang: ""};
        } else if (hash.hasOwnProperty(kernel.locale)) {
            return {value: hash[kernel.locale], precision: "exact", lang: kernel.locale};
        } else {
            var pos = kernel.locale.indexOf("_");
            if (pos > -1 && hash.hasOwnProperty(kernel.locale.substr(0,2))) {
            return {value: hash[kernel.locale.substr(0,2)], precision: "coarsen", lang: kernel.locale.substr(0,2)};
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

    var f = function(graph, subject, prop) {
        var stmts = graph.find(subject, prop);
        if (stmts.length > 0) {
            var obj = {};
            for (var s=0;s<stmts.length;s++) {
                obj[stmts[s].getLanguage() || ""] = stmts[s].getValue();
            }
            return obj;
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
            var props = propArr[i];
            if (lang.isArray(props)) {
                var valueArr = [];
                for (var j = 0;j< props.length;j++) {
                    var value = f(graph, subject, props[j]);
                    if (value) {
                        valueArr.push(exports.getLocalizedValue(value).value);
                    }
                }
                if (valueArr.length > 0) {
                    return {"": valueArr.join(" ")};
                }
            } else {
                return f(graph, subject, props);
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