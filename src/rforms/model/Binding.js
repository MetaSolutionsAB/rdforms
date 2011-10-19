/*global dojo, rforms, rdfjson*/
dojo.provide("rforms.model.Binding");
dojo.require("rforms.model.CardinalityTracker");
dojo.require("rforms.template.Template");
dojo.require("rforms.template.Item");
dojo.require("rdfjson.Graph");
dojo.require("rdfjson.Statement");

/**
 * A binding is a pairing between an item and various RDF statement 
 * (a single statement unless the binding is a group with constraints).
 * It keeps track of cardinality and validity.
 * If a binding is valid and all parent bindings are valid, 
 * the statement is asserted, that is, inserted into the RDF graph.
 */
dojo.declare("rforms.model.Binding", null, {
	//===================================================
	// Private attributes
	//===================================================
	_item: null,
	_statement: null,
	_ancestorValid: true,
	_cardinalityTracker: null,

	//===================================================
	// Public API
	//===================================================
	getGraph: function() {
		if (!this._graph) {
			if (this._statement) {
				this._graph = this._statement.getGraph();			
			} else if (this._parent) {
				this._graph = this._parent.getGraph();
			}
		}
		return this._graph;
	},
	remove: function() {
	},
	getCardinalityTracker: function() {
		return this._cardinalityTracker;
	},
	setCardinalityTracker: function(cardTracker) {
		this._cardinalityTracker = cardTracker;
	},
	getItem: function() {
		return this._item;
	},
	getStatement: function() {
		return this._statement;
	},
	getParent: function() {
		return this._parent;
	},
	setParent: function(parent) {
		this._parent = parent;
	},	
	
	/**
	 * A binding is valid if:
	 * <ol><li> it is a leaf and the corresponding statement is valid, </li>
	 * <li>if it is a group and at least one of its children is valid, or</li>
	 * <li>if it is a predicategroup and both the predicate and the object binding are valid.</ol>   
	 */
	isValid: function() {
		//Override
	},
	
	/**
	 * stores the validity of ancestors.
	 */
	setAncestorValid: function(valid) {
		this._ancestorValid = valid;
		this.updateAssertions();
	},
	/**
	 * 
	 */
	updateAssertions: function() {
		//Override
	},

	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(args) {
		this._item = args.item;
		this._statement = args.statement;
		if (args.graph) {
			this._graph = args.graph;
		}
	},

	//===================================================
	// Private methods
	//===================================================	
	_isValidValue: function(value) {
		return value !== undefined && value !== null && value !== "";
	}
});