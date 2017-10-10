define([
    "rdforms/view/renderingContext",
    "rdforms/utils",
    "dojo/on",
    "dojo/aspect",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/_base/array",
    "rdforms/model/engine",
    "dijit/focus",
    "dijit/TooltipDialog",
    "dijit/popup"
], function(renderingContext, utils, on, aspect, domClass, domConstruct, lang, array, engine, focus, TooltipDialog, popup) {

    renderingContext.addPresenterTable = function(newRow, firstBinding, context) {
        var item = firstBinding.getItem(), childItems = item.getChildren();
        var table = domConstruct.create("table", {"class": "rdformsGroup"}, newRow);
        var tHead = domConstruct.create("thead", null, table);
        var tHeadRow = domConstruct.create("tr", null, table);
        for (var colInd = 0;colInd < childItems.length;colInd++) {
            var th = domConstruct.create("th", null, tHeadRow);
            renderingContext.attachItemInfo(item, domConstruct.create("span", {innerHTML: childItems[colInd].getLabel()}, th), context);
        }
        return table;
    };

    renderingContext.fillPresenterTable = function(table, bindings, context) {
        if (bindings.length === 0) {
            return;
        }
        var item = bindings[0].getItem();
        var rowInd, colInd, childBindingsGroups, trEl;

        var tl = context.view.topLevel;
        context.view.topLevel = false; //Table-cells are never toplevel, hence intermediate override.
        for (rowInd = 0; rowInd < bindings.length;rowInd++) {
            childBindingsGroups = bindings[rowInd].getItemGroupedChildBindings();
            trEl = domConstruct.create("tr", null, table);

            for (colInd = 0; colInd< childBindingsGroups.length;colInd++) {
                if (childBindingsGroups[colInd].length > 0) {
                    renderingContext.renderPresenter(domConstruct.create("td", null, trEl), childBindingsGroups[colInd][0], {view: context.view, noCardinalityButtons: true});
                } else {
                    domConstruct.create("td", null, trEl);
                }
            }
        }
        context.view.topLevel = tl;
    };

    renderingContext.addEditorTable = function (newRow, firstBinding, context) {
        var item = firstBinding.getItem(), childItems = item.getChildren();
        var table = domConstruct.create("table", null, newRow);
        domClass.add(table, "rdformsGroup");

        var tHead = domConstruct.create("thead", null, table);
        var tBody = domConstruct.create("tbody", null, table);
        var tHeadRow = domConstruct.create("tr", null, tHead);
        for (colInd = 0; colInd < childItems.length; colInd++) {
            var th = domConstruct.create("th", null, tHeadRow);
            domClass.add(th, "rdformsColumnHeader" + colInd);
            renderingContext.attachItemInfo(item, domConstruct.create("span", {innerHTML: childItems[colInd].getLabel()}, th), context);
        }
        if (!firstBinding.getItem().hasStyle("firstcolumnfixedtable")) {
            var addTh = domConstruct.create("th", {"class": "rdformsTableControl"}, tHeadRow);
            var parentBinding = firstBinding.getParent();

            var add = domConstruct.create("span", {"class": "action editAdd", "title": context.view.messages.edit_add}, addTh);
            var cardTr = firstBinding.getCardinalityTracker();
            on(add, "click", function () {
                if (!cardTr.isMax()) {
                    var nBinding = engine.create(parentBinding, item);
                    addTableRow(tBody, nBinding, context);
                }
            });
            aspect.after(cardTr, "cardinalityChanged", function () {
                domClass.toggle(add, "disabled", cardTr.isMax());
            });
        }
        return tBody;
    };
    renderingContext.fillEditorTable = function (table, bindings, context) {
        if (bindings.length === 0) {
            return;
        }
        var item = bindings[0].getItem();
        if (item.hasStyle("nonEditable")) {
            return renderingContext.renderEditor(table, bindings, context);
        }

        if (item.hasStyle("firstcolumnfixedtable")) {
            bindings = createChildBindingsForFirstFixedColumn(bindings, context);
        }

        array.forEach(bindings, function(binding) {
            addTableRow(table, binding, context);
        });
    };

    var addTableRow = function (table, binding, context) {
        var childItems = binding.getItem().getChildren();
        var groupedBindings = binding.getItemGroupedChildBindings();
        var trEl = domConstruct.create("tr", null, table);

        array.forEach(groupedBindings, function (bindings, index) {
            //Create those columns that are missing:
            if (bindings.length === 0 && !childItems[index].hasStyle("nonEditable")) {
                engine.create(binding, childItems[index]);
            }
        });
        array.forEach(groupedBindings, function (bindings, index) {
            renderingContext.renderEditor(domConstruct.create("td", null, trEl), bindings[0],
                {view: context.view, noCardinalityButtons: true});
        });

        if (!binding.getItem().hasStyle("firstcolumnfixedtable")) {
            var lastTd = domConstruct.create("td", {"class": "rdformsTableControl"}, trEl);
            var remove = domConstruct.create("span", {"class": "action editDelete",
                "title": context.view.messages.edit_remove}, lastTd);
            var cardTr = binding.getCardinalityTracker();
            var cardConnect1 = aspect.after(cardTr, "cardinalityChanged", function () {
                domClass.toggle(remove, "disabled", cardTr.isMin());
            });
            var removeConnect = on(remove, "click", function () {
                if (!cardTr.isMin()) {
                    if (cardTr.getCardinality() === 1) {
                        var parentBinding = binding.getParent(), item = binding.getItem();
                        var nBinding = engine.create(parentBinding, item);
                        addTableRow(table, nBinding, context);
                    }
                    cardConnect1.remove();
                    removeConnect.remove();
                    binding.remove();
                    domConstruct.destroy(trEl);
                }
            });
        }
    };

    var createChildBindingsForFirstFixedColumn = function (bindings, context) {
        //Find choice column
        //flesh out bindings from choices
        //mark each fleshed out binding via .setExcludeFromTreeValidityCheck(true);
        var nb = [];
        var item = bindings[0].getItem();
        var firstColumnItem = item.getChildren()[0]; //Must be a choice.
        var choices = firstColumnItem.getChoices();
        choices = utils.cloneArrayWithLabels(choices);
        choices.sort(function (a, b) { //Sort the choices goddamit!
            //This assumes that there is always an "n" to be found (which is correct)
            if (a.label > b.label) {
                return 1;
            } else if (a.label < b.label) {
                return -1;
            } else {
                return 0;
            }
        });


        //index the existing bindings
        var ebi = {};
        array.forEach(bindings, function (binding) {
            var igcb = binding.getItemGroupedChildBindings();
            if (igcb.length > 0 && igcb[0].length > 0) {
                var rowXcol1 = igcb[0][0];
                ebi[rowXcol1.getValue()] = binding;
            }
        });

        //Create one row for each choice
        var parentBinding = bindings[0].getParent();
        array.forEach(choices, function (choice) {
            if (ebi[choice.value] != null) {
                nb.push(ebi[choice.value]);
            } else {
                var newRowBinding = engine.create(parentBinding, item);
                var firstColumnBinding = engine.create(newRowBinding, firstColumnItem);
                firstColumnBinding.setExcludeFromTreeValidityCheck(true);
                firstColumnBinding.setAncestorValid(false);
                firstColumnBinding.setChoice(choice);
                nb.push(newRowBinding);
            }
        });

        return nb;
    }
});