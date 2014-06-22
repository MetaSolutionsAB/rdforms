define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./Chooser",
    "./ChoicesTreeModel",
    "dijit/Tree"
], function (declare, lang, Chooser, ChoicesTreeModel, Tree) {

    return declare(Chooser, {
        //===================================================
        // Inherited methods
        //===================================================
        postCreate: function () {
            this.inherited("postCreate", arguments);
            this.tree = new Tree({
                model: new ChoicesTreeModel(this.binding.getItem().getChoices() || []),
                showRoot: false,
                onClick: lang.hitch(this, this._selectChoice),
                getLabelClass: lang.hitch(this, function (item) {
                    if (item == null) {
                        return "";
                    }
                    var choice = this.binding.getChoice();
                    if (item.selectable === false) {
                        return "notselectable";
                    }
                    if (choice != null && choice.value === item.value) {
                        return "currentselection";
                    }
                    return "default";
                })}, this.selectionNode);
        }
    });
});