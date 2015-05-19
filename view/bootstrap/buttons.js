define([
    "rdforms/view/renderingContext",
    "dojo/aspect",
    "rdforms/model/Engine",
    "jquery"
], function(renderingContext, aspect, Engine, jquery) {

    renderingContext.addRemoveButton = function (fieldDiv, binding, context) {
        var $remove = jquery('<span class="glyphicon glyphicon-remove action">')
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
        var $expand = jquery('<span class="glyphicon glyphicon-plus action">')
            .attr("title", context.view.messages.edit_expand)
            .appendTo(labelDiv)
            .click(function () {
                var nBinding = Engine.create(context.view.binding, item);
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
        var $add = jquery('<span class="action glyphicon glyphicon-plus ">')
            .attr("title", context.view.messages.edit_add)
            .appendTo(labelDiv);
        var $remove = jquery('<span class="action glyphicon glyphicon-remove">')
            .attr("title", context.view.messages.edit_remove)
            .appendTo(labelDiv);

        var cardTr = binding.getCardinalityTracker();
        var con = aspect.after(cardTr, "cardinalityChanged", function () {
            $add.toggleClass("disabled", cardTr.isMax());
            $remove.toggleClass("disabled", cardTr.isMin());
        });

        $add.click(function () {
            if (!cardTr.isMax()) {
                var nBinding = Engine.create(parentBinding, item);
                context.view.addRow(rowDiv, nBinding); //not the first binding...
            }
        });

        $remove.click(function () {
            if (!cardTr.isMin()) {
                if (cardTr.getCardinality() === 1) {
                    var parentBinding = binding.getParent(), item = binding.getItem();
                    con.remove();
                    $add.unbind("click");
                    $remove.unbind("click");
                    binding.remove();
                    var card = item.getCardinality();
                    if (card.pref > 0 || card.min > 0) {
                        var nBinding = Engine.create(parentBinding, item);
                        context.view.addRow(rowDiv, nBinding); //not the first binding...
                    } else {
                        context.view.createRowNode(rowDiv, null, item);
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
        var $add = jquery('<span class="action glyphicon glyphicon-plus">')
            .attr("title", context.view.messages.edit_add)
            .appendTo(labelDiv)
            .click(function () {
                if (!cardTr.isMax()) {
                    var nBinding = Engine.create(parentBinding, item);
                    context.view.addRow(rowDiv, nBinding); //not the first binding...
                }
            });
        aspect.after(cardTr, "cardinalityChanged", function () {
            $add.toggleClass("disabled", cardTr.isMax());
        });
    };
});