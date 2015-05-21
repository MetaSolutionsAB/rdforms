define([
    "rdforms/view/Registry",
    "rdforms/model/system",
    "dojo/i18n"
], function(Registry, system, i18n) {

    system.getChoice = function(item, value) {
        var chooser = rc.chooserRegistry.getComponent(item);
        if (chooser == null) {
            throw("Error, no chooser available to retrieve a choice for item: "+item.getId());
        }
        return chooser.getChoice(item, value);
    };
    var messages;

    var rc = {
        domQuery: function(selector, node) {},
        domCreate: function(domStr, node) {},
        domCreateAfter: function(domStr, node) {},
        domClassToggle: function(node, classStr, addOrRemove) {},
        domSetAttr: function(node, attr, value) {},
        presenterRegistry: new Registry(),
        editorRegistry: new Registry(),
        /**
         * Provides a registry of choosers. Each chooser have with the following attributes:
         * getChoice - function(item, value) -> choice
         *  (i.e. a function that takes the arguments item and value and returns a choice.
         *   If the choice cannot be provided in full directly it is possible to include a
         *   load method in the object with a onSuccess and onError methods as parameters.)
         * getPriority - function(item) -> integer
         *   (I.e. a function that provides a priority for the chooser given an item,
         *   use the priorities specified in this module.)
         * show - function(binding, onSelect)
         *   (I.e. a function that given a binding launches the chooser dialog, when the user is finished
         *   and has made his selection the onSelect method will be called with the selected choice.)
         * registerDefaults: function()
         *   (I.e. a function that registers the choosers own default priorities when it is to be used.)
         *
         */
        chooserRegistry: new Registry(),
        renderPresenter: function (node, binding, context) {
            var renderer = rc.presenterRegistry.getComponent(binding.getItem());
            if (renderer) {
                rc.prePresenterRenderer(node, binding, context);
                renderer(node, binding, context);
                rc.postPresenterRenderer(node, binding, context);
            }
        },
        renderEditor: function (node, binding, context) {
            var renderer = rc.editorRegistry.getComponent(binding.getItem());
            if (renderer) {
                rc.preEditorRenderer(node, binding, context);
                renderer(node, binding, context);
                rc.postEditorRenderer(node, binding, context);
            }
        },
        getChoice: system.getChoice,
        openChoiceSelector: function(binding, callback) {
            var chooser = rc.chooserRegistry.getComponent(binding.getItem());
            if (chooser == null) {
                var item = binding.getItem();
                alert("Error, no chooser available to open a choice selector for: "+item);
                return;
            }
            chooser.show(binding, callback);
        },

        setMessages: function(msgs) {
            messages = msgs;
        },
        getMessages: function(callback) {
            if (messages) {
                callback(messages);
            } else {
                callback(i18n.getLocalization("rdforms/view", "rdforms"));
            }
        },


    //Override the following methods
        preEditorRenderer: function() {},
        postEditorRenderer: function() {},
        prePresenterRenderer: function() {},
        postPresenterRenderer: function() {},
        renderEditorLabel: function (rowNode, binding, item, context) {},
        renderPresenterLabel: function (rowNode, binding, item, context) {},
        attachItemInfo: function (item, aroundNode, context) {},
        addCreateChildButton: function (rowDiv, labelDiv, binding, context) {},
        addGroupButtons: function (rowDiv, labelDiv, binding, context) {},
        addExpandButton: function (rowDiv, labelDiv, item, context) {},
        addRemoveButton: function (fieldDiv, binding, context, onReset) {},
        addPresenterTable: function (lastRow, firstBinding, context) {},
        fillPresenterTable: function (table, bindings, context) {},
        addEditorTable: function (lastRow, firstBinding, context) {},
        fillEditorTable: function (table, bindings, context) {}
    };


    rc.presenterRegistry.itemtype("group").register(function(fieldDiv, binding, context) {
        var cls = context.view.constructor;
        new cls({
            messages: context.view.messages,
            binding: binding,
            topLevel: false,
            includeLevel: this.includeLevel}, fieldDiv);
    });

    rc.editorRegistry.itemtype("group").register(function(fieldDiv, binding, context) {
        var cls = context.view.constructor;
        var subView = new cls({messages: context.view.messages,
            languages: context.view.languages,
            binding: binding,
            topLevel: false,
            includeLevel: context.view.includeLevel}, fieldDiv);
        context.view._subEditors.push(subView);
    });

    return rc;
});