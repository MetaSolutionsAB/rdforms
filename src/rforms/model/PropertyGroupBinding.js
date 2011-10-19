/*global dojo, rforms*/
dojo.provide("rforms.model.PropertyGroupBinding");
dojo.require("rforms.model.GroupBinding");
dojo.require("rforms.model.PropertyChoiceBinding");
dojo.require("rforms.model.ValueBinding");
dojo.require("rforms.model.ChoiceBinding");

/**
 * This is a syntactical grouping to capture the case when both the predicate and
 * the object is variable. It is achieved by having exactly two children, the first being
 * a binding for the predicate in the form of a PredicateChoiceBinding and the second
 * being a binding for the object. The object binding can be a ValueBinding, ChoiceBinding or
 * a GroupBinding. It is not allowed to be another PropertyGroupBinding though.
 * 
 * @see rforms.template.PropertyGroup
 */
dojo.declare("rforms.model.PropertyGroupBinding", rforms.model.GroupBinding, {
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
		if (oItem instanceof rforms.template.Group) {
			oBinding = new rforms.model.GroupBinding({item: oItem, statement: args.statement, constraints: args.constraints});
		} else if (oItem instanceof rforms.template.Choice) {
			oBinding = new rforms.model.ChoiceBinding({item: oItem, statement: args.statement});
		} else {
			oBinding = new rforms.model.ValueBinding({item: oItem, statement: args.statement});
		}
		pBinding = new rforms.model.PropertyChoiceBinding({item: children[0], objectBinding: oBinding});
		this.addChildBinding(pBinding);
		this.addChildBinding(oBinding);
	},
	getGraph: function() {
		return this.getObjectBinding().getGraph();
	}
});