define([
    "rdforms/view/renderingContext",
    "dojo/on",
    "dojo/aspect",
    "dojo/dom-class",
    "dojo/dom-construct",
    "rdforms/model/Engine"
], function(renderingContext, on, aspect, domClass, domConstruct, Engine) {

    renderingContext.addRemoveButton = function (fieldDiv, binding, context, onReset) {
        var remove = domConstruct.create("span", {
            "class": "action editDelete",
            "title": context.view.messages.edit_remove
        }, context.controlDiv);
        var cardTr = binding.getCardinalityTracker();
        var con = aspect.after(cardTr, "cardinalityChanged", function () {
            domClass.toggle(remove, "disabled", cardTr.isMin());
        });

        var removeConnect = on(remove, "click", function () {
            if (!cardTr.isMin()) {
                if (cardTr.getCardinality() === 1) {
                    if (binding.getItem() instanceof Choice) {
                        binding.setChoice(null);
                    } else {
                        binding.setValue(null);
                    }
                    onReset();
                } else {
                    con.remove();
                    removeConnect.remove();
                    binding.remove();
                    domConstruct.destroy(fieldDiv);
                }
            }
        });
    };

    renderingContext.addExpandButton = function (rowDiv, labelDiv, item, context) {
        var expand = domConstruct.create("span", {"class": "action editExpand", "title": context.view.messages.edit_expand}, labelDiv);
        var expandCon = on(expand, "click", function () {
            var nBinding = Engine.create(context.view.binding, item);
            if (context.view.showAsTable(item)) {
                var table = context.view.addTable(rowDiv, nBinding, item);
                context.view.fillTable(table, [nBinding]);
            } else {
                context.view.addRow(rowDiv, nBinding, false); //Label is already added.
                renderingContext.addGroupButtons(rowDiv, labelDiv, nBinding, context);
            }

            domConstruct.destroy(expand);

            expandCon.remove();
        });
    };

    renderingContext.addGroupButtons = function (rowDiv, labelDiv, binding, context) {
        var parentBinding = binding.getParent(), item = binding.getItem();
        var add = domConstruct.create("span", {"class": "action editAdd", "title": context.view.messages.edit_add}, labelDiv);
        var remove = domConstruct.create("span", {"class": "action editDelete", "title": context.view.messages.edit_remove}, labelDiv);

        var cardTr = binding.getCardinalityTracker();
        var con = aspect.after(cardTr, "cardinalityChanged", function () {
            domClass.toggle(add, "disabled", cardTr.isMax());
            domClass.toggle(remove, "disabled", cardTr.isMin());
        });

        var addCon = on(add, "click", function () {
            if (!cardTr.isMax()) {
                var nBinding = Engine.create(parentBinding, item);
                context.view.addRow(rowDiv, nBinding); //not the first binding...
            }
        });

        var removeCon = on(remove, "click", function () {
            if (!cardTr.isMin()) {
                if (cardTr.getCardinality() === 1) {
                    var parentBinding = binding.getParent(), item = binding.getItem();
                    con.remove();
                    addCon.remove();
                    removeCon.remove();
                    binding.remove();
                    var card = item.getCardinality();
                    if (card.pref > 0 || card.min > 0) {
                        var nBinding = Engine.create(parentBinding, item);
                        context.view.addRow(rowDiv, nBinding); //not the first binding...
                    } else {
                        context.view.createRowNode(rowDiv, null, item);
                    }
                    domConstruct.destroy(rowDiv);
                } else {
                    con.remove();
                    addCon.remove();
                    removeCon.remove();
                    //Remove somehow.
                    binding.remove();
                    domConstruct.destroy(rowDiv);
                }
            }
        });
    };

    renderingContext.addCreateChildButton = function (rowDiv, labelDiv, binding, context) {
        var parentBinding = binding.getParent(), item = binding.getItem(), cardTr = binding.getCardinalityTracker();
        var add = domConstruct.create("span", {"class": "action editAdd", "title": context.view.messages.edit_add}, labelDiv);
        on(add, "click", function () {
            if (!cardTr.isMax()) {
                var nBinding = Engine.create(parentBinding, item);
                context.view.addRow(rowDiv, nBinding); //not the first binding...
            }
        });
        var cardMaxCon = aspect.after(cardTr, "cardinalityChanged", function () {
            domClass.toggle(add, "disabled", cardTr.isMax());
        });
    };
});