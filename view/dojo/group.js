define([
    "exports",
    "rdforms/view/renderingContext",
    "rdforms/view/Presenter",
    "rdforms/view/Editor",
    "rdforms/view/ValidationPresenter"
], function(exports, renderingContext, Presenter, Editor, ValidationPresenter) {
    var editors = renderingContext.editorRegistry;
    var presenters = renderingContext.presenterRegistry;
    var validators = renderingContext.validatorRegistry;

    presenters.itemtype("group").register(function(fieldDiv, binding, context) {
        new Presenter({messages: context.view.messages, binding: binding, topLevel: false}, fieldDiv);
    });

    validators.itemtype("group").register(function(fieldDiv, binding, context) {
        new ValidationPresenter({messages: context.view.messages,
            binding: binding,
            topLevel: false,
            includeLevel: this.includeLevel}, fieldDiv);
    });

    editors.itemtype("group").register(function(fieldDiv, binding, context) {
        var subView = new Editor({messages: context.view.messages,
                languages: context.view.languages,
                binding: binding,
                topLevel: false,
                includeLevel: context.view.includeLevel}, fieldDiv);
        context.view._subEditors.push(subView);
    });
});