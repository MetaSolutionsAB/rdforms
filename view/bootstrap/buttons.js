define([
    "rdforms/view/renderingContext",
    "dojo/aspect",
    "rdforms/model/engine",
    "jquery"
], function(renderingContext, aspect, engine, jquery) {

    renderingContext.addRemoveButton = function (fieldDiv, binding, context) {
        var $remove = jquery('<span class="fa fa-remove action">')
            .attr("title", context.view.messages.edit_remove)
            .appendTo(context.controlDiv);
        var cardTr = binding.getCardinalityTracker();
        var con = aspect.after(cardTr, "cardinalityChanged", function () {
            $remove.toggleClass("disabled", cardTr.isMin());
        });

        $remove.click(function () {
            if (!cardTr.isMin()) {
                if (cardTr.getCardinality() === 1) {
                    if (binding.getItem().getType() === "choice") {
                        binding.setChoice(null);
                    } else {
                        binding.setValue("");
                    }
                    var nodeType = binding.getItem().getNodetype();
                    if (nodeType === "LANGUAGE_LITERAL" || nodeType === "PLAIN_LITERAL") {
                        binding.setLanguage("");
                    }
                    if (context.clear) {
                        context.clear();
                    } else {
                        jquery(fieldDiv).find("input").val("");
                    }
                } else {
                    con.remove();
                    $remove.unbind("click");
                    binding.remove();
                    jquery(fieldDiv).remove();
                }
            }
        });
    };

    renderingContext.addExpandButton = function (rowDiv, labelDiv, item, context) {
        var $expand = jquery('<span class="fa fa-plus action">')
            .attr("title", context.view.messages.edit_expand)
            .appendTo(labelDiv)
            .click(function () {
                var nBinding = engine.create(context.view.binding, item);
                if (context.view.showAsTable(item)) {
                    var table = context.view.addTable(rowDiv, nBinding, item);
                    context.view.fillTable(table, [nBinding]);
                } else {
                    context.view.addRow(rowDiv, nBinding, false); //Label is already added.
                    renderingContext.addGroupButtons(rowDiv, labelDiv, nBinding, context);
                }
                $expand.unbind("click").remove();
            });
    };

    renderingContext.addGroupButtons = function (rowDiv, labelDiv, binding, context) {
        var parentBinding = binding.getParent(), item = binding.getItem();
        var cardTr = binding.getCardinalityTracker();
        var card = item.getCardinality();
        var $add;
        if (card.max !== 1) {
            $add = jquery('<span class="action fa fa-plus ">')
                .attr("title", context.view.messages.edit_add)
                .appendTo(labelDiv);
            $add.click(function () {
                if (!cardTr.isMax()) {
                    var nBinding = engine.create(parentBinding, item);
                    context.view.addRow(rowDiv, nBinding); //not the first binding...
                }
            });
        }
        var $remove = jquery('<span class="action fa fa-remove">')
            .attr("title", context.view.messages.edit_remove)
            .appendTo(labelDiv);

        if (card.max === 1) {
            $remove.addClass("indentRemove")
        }

        var con = aspect.after(cardTr, "cardinalityChanged", function () {
            $add && $add.toggleClass("disabled", cardTr.isMax());
            $remove.toggleClass("disabled", cardTr.isMin());
        });


        $remove.click(function () {
            if (!cardTr.isMin()) {
                if (cardTr.getCardinality() === 1) {
                    var parentBinding = binding.getParent(), item = binding.getItem();
                    con.remove();
                    $add && $add.unbind("click");
                    $remove.unbind("click");
                    binding.remove();
                    var card = item.getCardinality();
                    if (context.view.showNow(item, [])) {
                        // If we are removing a single row, prepareBindings will only create a
                        // maximum of one row.
                        var nBindings = context.view.prepareBindings(item, []);
                        // The bindings may be of length 0, e.g. if the view is currently showing
                        // only mandatory fields and the row is optional.
                        if (nBindings.length > 0) {
                          context.view.addRow(rowDiv, nBindings[0]);
                        }
                    }
                    jquery(rowDiv).remove();
                } else {
                    con.remove();
                    $add.unbind("click");
                    $remove.unbind("click");
                    binding.remove();
                    jquery(rowDiv).remove();
                }
            }
        });
    };

    renderingContext.addCreateChildButton = function (rowDiv, labelDiv, binding, context) {
        var parentBinding = binding.getParent(), item = binding.getItem(),
            cardTr = binding.getCardinalityTracker();
        var $add = jquery('<span class="action fa fa-plus">')
            .attr("title", context.view.messages.edit_add)
            .appendTo(labelDiv)
            .click(function () {
                if (!cardTr.isMax()) {
                    var nBinding = engine.create(parentBinding, item);
                    context.view.addRow(rowDiv, nBinding); //not the first binding...
                }
            });
        aspect.after(cardTr, "cardinalityChanged", function () {
            $add.toggleClass("disabled", cardTr.isMax());
        });
    };
});