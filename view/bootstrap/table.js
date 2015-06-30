define([
    "rdforms/view/renderingContext",
    "rdforms/utils",
    "dojo/aspect",
    "jquery",
    "dojo/_base/array",
    "rdforms/model/Engine"
], function(renderingContext, utils, aspect, jquery, array, Engine) {

    renderingContext.addPresenterTable = function(newRow, firstBinding, context) {
        var item = firstBinding.getItem(), childItems = item.getChildren();
        var $table = jquery("<table>").addClass("rdformsGroup").appendTo(newRow);
        var $tHead = jquery("<thead>").appendTo($table);
        var $tHeadRow = jquery("<tr>").appendTo($table);
        for (var colInd = 0;colInd < childItems.length;colInd++) {
            var $th = jquery("<th>").appendTo($tHeadRow);
            renderingContext.attachItemInfo(item, jquery("<span>").text(childItems[colInd].getLabel()).appendTo($th), context);
        }
        return $table[0];
    };

    renderingContext.fillPresenterTable = function(table, bindings, context) {
        if (bindings.length === 0) {
            return;
        }
        var item = bindings[0].getItem();
        var rowInd, colInd, childBindingsGroups, $trEl;

        var tl = context.view.topLevel;
        context.view.topLevel = false; //Table-cells are never toplevel, hence intermediate override.
        for (rowInd = 0; rowInd < bindings.length;rowInd++) {
            childBindingsGroups = bindings[rowInd].getItemGroupedChildBindings();
            $trEl = jquery("<tr>").appendTo(table);

            for (colInd = 0; colInd< childBindingsGroups.length;colInd++) {
                if (childBindingsGroups[colInd].length > 0) {
                    renderingContext.renderPresenter(jquery("<td>").appendTo($trEl), childBindingsGroups[colInd][0], {view: context.view, noCardinalityButtons: true});
                } else {
                    jquery("<td>").appendTo($trEl);
                }
            }
        }
        context.view.topLevel = tl;
    };

    renderingContext.addEditorTable = function (newRow, firstBinding, context) {
        var item = firstBinding.getItem(), childItems = item.getChildren();
        var $table = jquery("<table>").appendTo(newRow);
        jquery($table).addClass("rdformsGroup");

        var $tHead = jquery("<thead>").appendTo($table);
        var $tBody = jquery("<tbody>").appendTo($table);
        var $tHeadRow = jquery("<tr>").appendTo($tHead);
        for (colInd = 0; colInd < childItems.length; colInd++) {
            var $th = jquery("<th>").appendTo($tHeadRow);
            jquery($th).addClass("rdformsColumnHeader" + colInd);
            renderingContext.attachItemInfo(item,
                jquery("<span>").text(childItems[colInd].getLabel()).appendTo($th)[0], context);
        }
        if (!firstBinding.getItem().hasStyle("firstcolumnfixedtable")) {
            var $addTh = jquery("<th>").addClass("rdformsTableControl").appendTo($tHeadRow);
            var parentBinding = firstBinding.getParent();

            var $add = jquery("<span>").addClass("action editAdd")
                .attr("title", context.view.messages.edit_add)
                .appendTo($addTh)
                .click(function () {
                    if (!cardTr.isMax()) {
                        var nBinding = Engine.create(parentBinding, item);
                        addTableRow($tBody[0], nBinding, context);
                    }
                });
            var cardTr = firstBinding.getCardinalityTracker();
            aspect.after(cardTr, "cardinalityChanged", function () {
                $add.toggleClass("disabled", cardTr.isMax());
            });
        }
        return $tBody;
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
        var $trEl = jquery("<tr>").appendTo(table);

        array.forEach(groupedBindings, function (bindings, index) {
            //Create those columns that are missing:
            if (bindings.length === 0 && !childItems[index].hasStyle("nonEditable")) {
                Engine.create(binding, childItems[index]);
            }
        });
        array.forEach(groupedBindings, function (bindings, index) {
            renderingContext.renderEditor(jquery("<td>").appendTo($trEl)[0], bindings[0],
                {view: context.view, noCardinalityButtons: true});
        });

        if (!binding.getItem().hasStyle("firstcolumnfixedtable")) {
            var $lastTd = jquery("<td>").addClass("rdformsTableControl").appendTo($trEl);
            var $remove = jquery("<span>").addClass("action editDelete")
                    .attr("title", context.view.messages.edit_remove).appendTo($lastTd);
            var cardTr = binding.getCardinalityTracker();
            var cardConnect1 = aspect.after(cardTr, "cardinalityChanged", function () {
                $remove.toggleClass("disabled", cardTr.isMin());
            });
            $remove.click(function () {
                if (!cardTr.isMin()) {
                    if (cardTr.getCardinality() === 1) {
                        var parentBinding = binding.getParent(), item = binding.getItem();
                        var nBinding = Engine.create(parentBinding, item);
                        addTableRow(table, nBinding, context);
                    }
                    cardConnect1.remove();
                    removeConnect.remove();
                    binding.remove();
                    $trEl.remove();
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
        //Sort the choices goddamit!
        choices = utils.cloneArrayWithLabels(choices);
        choices.sort(function (a, b) {
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
                var newRowBinding = Engine.create(parentBinding, item);
                var firstColumnBinding = Engine.create(newRowBinding, firstColumnItem);
                firstColumnBinding.setExcludeFromTreeValidityCheck(true);
                firstColumnBinding.setAncestorValid(false);
                firstColumnBinding.setChoice(choice);
                nb.push(newRowBinding);
            }
        });

        return nb;
    }
});