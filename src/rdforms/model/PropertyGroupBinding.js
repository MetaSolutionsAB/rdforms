/*global define*/
define([
    "dojo/_base/declare",
    "./GroupBinding",
    "./PropertyChoiceBinding",
    "./ValueBinding",
    "./ChoiceBinding",
    "../template/Group",
    "../template/Choice"
], function(declare, GroupBinding, PropertyChoiceBinding, ValueBinding, ChoiceBinding, Group, Choice) {

    /**
     * This is a syntactical grouping to capture the case when both the predicate and
     * the object is variable. It is achieved by having exactly two children, the first being
     * a binding for the predicate in the form of a PredicateChoiceBinding and the second
     * being a binding for the object. The object binding can be a ValueBinding, ChoiceBinding or
     * a GroupBinding. It is not allowed to be another PropertyGroupBinding though.
     * 
     * @see rforms.template.PropertyGroup
     */
    return declare(GroupBinding, {
	//===================================================
	// Public API
	//===================================================
	getPredicateBinding: function() {
		return this._childBindings[0][0];
	},
	getObjectBinding: function() {
		return this._childBindings[1][0];		
	},

	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(args) {
		this._statement = undefined;
		this._validPredicate = true; //Reset to initial value to ignore check from incorrect given statement in this case.
		this._constraints = [];
		var children = this._item.getChildren();
		var pBinding, oBinding, pItem = children[0], oItem = children[1];
		if (oItem instanceof Group) {
			oBinding = new GroupBinding({item: oItem, statement: args.statement, constraints: args.constraints});
		} else if (oItem instanceof Choice) {
			oBinding = new ChoiceBinding({item: oItem, statement: args.statement});
		} else {
			oBinding = new ValueBinding({item: oItem, statement: args.statement});
		}
		pBinding = new PropertyChoiceBinding({item: children[0], objectBinding: oBinding});
		this.addChildBinding(pBinding);
		this.addChildBinding(oBinding);
	},
	getGraph: function() {
		return this.getObjectBinding().getGraph();
	}
    });
});