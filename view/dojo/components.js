define([
    "rdforms/view/renderingContext",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/dom-attr",
    "rdforms/view/dojo/labels",
    "rdforms/view/dojo/text",
    "rdforms/view/dojo/choice",
    "rdforms/view/dojo/buttons",
    "rdforms/view/dojo/table",
    "dojo/i18n!rdforms/view/nls/rdforms"
], function(renderingContext, domClass, domConstruct, query, domAttr) {

    renderingContext.domQuery = function(selector, node) {
        return query(selector, node)[0];
    };
    renderingContext.domCreate = function(nodeStr, parent) {
        return domConstruct.create(nodeStr, null, parent);
    };
    renderingContext.domCreateAfter = function(nodeStr, parent) {
        return domConstruct.create(nodeStr, null, parent, "after");
    };
    renderingContext.domSetAttr = function(node, attr, value) {
        domAttr.set(node, attr, value);
    };
    renderingContext.domText = function(node, text) {
        domAttr.set(node, "innerHTML", text);
    };

    renderingContext.domClassToggle = domClass.toggle;


    renderingContext.preEditorRenderer =function (fieldDiv, binding, context) {
        var it = binding.getItem().getType();
        if (it === "group") {
            domClass.add(fieldDiv, "rdformsGroup");
        } else {
            domClass.add(fieldDiv, "rdformsField");
        }
        context.controlDiv = domConstruct.create("div", {"class": "rdformsFieldControl"}, fieldDiv);
    };

    renderingContext.postEditorRenderer = function (fieldDiv, binding, context) {
        if (context.noCardinalityButtons !== true) {
            renderingContext.addRemoveButton(fieldDiv, binding, context, function () {
                binding.setGist("");
                var nodeType = binding.getItem().getNodetype();
                if (nodeType === "LANGUAGE_LITERAL" || nodeType === "PLAIN_LITERAL") {
                    binding.setLanguage("");
                }
            });
        }
    };
});