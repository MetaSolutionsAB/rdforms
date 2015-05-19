define([
    "rdforms/view/renderingContext",
    "jquery",
    "sizzle",
    "rdforms/view/bootstrap/labels",
    "rdforms/view/bootstrap/text",
    "rdforms/view/bootstrap/choice",
    "rdforms/view/bootstrap/buttons",
    "rdforms/view/bootstrap/table"
], function(renderingContext, jquery) {

    renderingContext.domQuery = function(selector, node) {
        return jquery(selector, node)[0];
    };
    renderingContext.domCreate = function(nodeStr, parent) {
        return jquery("<"+nodeStr+">").appendTo(parent)[0];
    };
    renderingContext.domCreateAfter = function(nodeStr, sibling) {
        var node = jquery("<"+nodeStr+">");
        jquery(sibling).after(node);
        return node;
    };
    renderingContext.domSetAttr = function(node, attr, value) {
        jquery(node).attr(attr, value);
    };

    renderingContext.domClassToggle = function(node, classStr, addOrRemove) {
        jquery(node).toggleClass(classStr, addOrRemove);
    };

    renderingContext.preEditorRenderer =function (fieldDiv, binding, context) {
        var it = binding.getItem().getType();
        if (it === "group") {
            jquery(fieldDiv).addClass("rdformsGroup");
        } else {
            jquery(fieldDiv).addClass("rdformsField");
        }

        context.controlDiv = jquery('<div class="rdformsFieldControl">').appendTo(fieldDiv)[0];
        if (it !== "group" && context.noCardinalityButtons !== true) {
            renderingContext.addRemoveButton(fieldDiv, binding, context);
        }
    };

    renderingContext.postEditorRenderer = function (fieldDiv, binding, context) {
    };
});