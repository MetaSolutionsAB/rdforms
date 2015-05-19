define([
    "rdforms/view/renderingContext",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/_base/lang",
    "dijit/focus",
    "dijit/TooltipDialog",
    "dijit/popup"
], function(renderingContext, on, domClass, domConstruct, domAttr, lang, focus, TooltipDialog, popup) {

    renderingContext.renderPresenterLabel = function (rowNode, binding, item, context, labelRow) {
        var labelDiv = domConstruct.create("div", null, rowNode);
        var isGroup = item.getType() === "group";
        var label = item.getLabel();
        if (label != null && label != "") {
            label = label.charAt(0).toUpperCase() + label.slice(1);
        } else {
            label = "";
        }

        domAttr.set(labelDiv, "innerHTML", label);
        domClass.add(labelDiv, "rdformsLabel");
        if (labelRow) {
            domClass.add(labelDiv, "rdformsLabelRow");
        }
        renderingContext.attachItemInfo(item, labelDiv, context);
    };

    renderingContext.renderEditorLabel = function (rowNode, binding, item, context) {
        if (item.hasStyle("nonEditable") || item.hasStyle("heading")) {
            return renderingContext.renderPresenterLabel(rowNode, binding, item, context, true);
        }
        var labelDiv = domConstruct.create("div", null, rowNode);

        var isGroup = item.getType() === "group";
        var l = item.getLabel();
        if (l != null && l != "") {
            l = l.charAt(0).toUpperCase() + l.slice(1);
        } else {
            l = "";
        }

        var label = domConstruct.create("span", {"innerHTML": l}, labelDiv);
        domClass.add(labelDiv, "rdformsLabelRow");
        domClass.add(label, "rdformsLabel");
        renderingContext.attachItemInfo(item, label, context);

        if (binding == null) {
            renderingContext.addExpandButton(rowNode, labelDiv, item, context);
            return;
        }
        //If table, no add or remove buttons.
        if (context.view.showAsTable(item)) {
            return;
        }
        var card = item.getCardinality();
        if (card.max != null && (card.max == card.min || card.max === 1)) {
            return;
        }
        if (isGroup) {
            renderingContext.addGroupButtons(rowNode, labelDiv, binding, context);
        } else {
            renderingContext.addCreateChildButton(rowNode, labelDiv, binding, context);
        }
    };

    var __currentDomNode;
    renderingContext.attachItemInfo = function (item, aroundNode, context) {
        if (item == null || (item.getProperty() == null && item.getDescription() == null)) {
            return;
        }
        on(aroundNode, "click", lang.hitch(null, showInfo, item, aroundNode, context));
        domClass.add(aroundNode, "rdformsHasInfo");
    };


    var showInfo = function(item, aroundNode, context) {
        if (__currentDomNode === aroundNode) {
            return;
        }
        __currentDomNode = aroundNode;

        //Prepare the TooltipDialog.
        var tooltipDialog = new TooltipDialog({});

        tooltipDialog.onBlur = function() {
            popup.close(tooltipDialog);
        };

        tooltipDialog.openPopup = function() {
            popup.open({
                popup: tooltipDialog,
                around: aroundNode,
                onClose: function() {
                    tooltipDialog.destroy();
                    setTimeout(function() {
                        if (aroundNode === __currentDomNode) {__currentDomNode = null;}}, 500);
                }
            });
        };

        //Now init the content of the dialog
        var property = item.getProperty();
        var description = item.getDescription();
        var message = "<div class='rdforms itemInfo'><div class='itemInfoTable'>";
        var label = item.getLabel() || "";
        if (label !== "") {
            message += "<div><label class='propertyLabel'>"+context.view.messages.info_label+":&nbsp;</label><span class='propertyValue'>"+label+"</span></div>";
        }
        if (property != null) {
            var ptemp = item.getProperty();
            message += "<div><label class='propertyLabel'>"+context.view.messages.info_property+":&nbsp;</label><a class='propertyValue' target='_blank' href='"+ptemp+"'>"+ptemp+"</a></div>";
        }
        if (description != null) {
            message += "<div><label class='descriptionLabel'>"+context.view.messages.info_description+":&nbsp;</label><span class='descriptionValue'>"+description.replace(/(\r\n|\r|\n)/g, "<br/>")+"</span></div>";
        }
        message +="</div></div>";
        tooltipDialog.setContent(message);
        setTimeout(function() {
            focus.focus(tooltipDialog.domNode);
        }, 1);

        //Launch the dialog.
        tooltipDialog.openPopup();
    };
});