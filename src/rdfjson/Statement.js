/*global dojo, rdfjson*/
dojo.provide("rdfjson.Statement");
dojo.require("rdfjson.Graph");

/**
 * Represents a statement in a graph.
 * Never create directly, use the methods in rdfjson.Graph.
 */
dojo.declare("rdfjson.Statement", null, {
	
	//===================================================
	// Internal Attributes
	//===================================================
	/**
	 * This is the rdfjson.Graph we will manipulate.
	 */
	_graph: null,

	/**
	 * Indicates if the statement is asserted in the accompanied graph.
	 */
	_asserted: false,

	/**
	 * The subject in the statement. 
	 */
	_s: "",

	/**
	 * The predicate in the statement.
	 */
	_p: "",

	/**
	 * The object in the statement.
	 */
	_o: null,
	
		
	//===================================================
	// Public API
	//===================================================
	getGraph: function() {
		return this._graph;
	},
	setAsserted: function(asserted) {
		if (asserted != this._asserted) {
			if (asserted) {
				this._graph.add(this);
			} else {
				this._graph.remove(this);
			}
			this._asserted = asserted;
		}
	},
	isAsserted: function() {
		return this._asserted;
	},
	getSubject: function() {
		return this._s;
	},
	setSubject: function(s) {
		if (this._asserted) {
			this._graph.remove(this);
			this._s = s;
			this._graph.add(this);
		} else {
			this._s = s;			
		}
	},
	getPredicate: function() {
		return this._p;
	},
	setPredicate: function(p) {
		if (this._asserted) {
			this._graph.remove(this);
			this._p = p;
			this._graph.add(this);
		} else {
			this._p = p;			
		}
	},
	setType: function(type) {
		throw "Changing the type of an object is not supported, create a new statement instead.";
	},
	getType: function() {
		return this._o.type;
	},
	setValue: function(value) {
		this._o.value = value;
	},
	getValue: function() {
		return this._o.value;
	},
	setLanguage: function(lang) {
		if (this._o.type !== 'literal') {
			throw "Cannot set the language for a resource, has to be a literal";
		}
		this._o.lang = lang;
	},
	getLanguage: function() {
		return this._o.lang;
	},
	setDatatype: function(datatype) {
		if (this._o.type !== 'literal') {
			throw "Cannot set the datatype for a resource, has to be a literal";
		}
		this._o.datatype = datatype;
	},
	getDatatype: function() {
		return this._o.datatype;
	},
	
	
	//===================================================
	// Inherited methods
	//===================================================
	/**
	 * Constructs a statement from the parts, the object is assumed to be the same instance as in the graph.
	 * 
	 * @param {Object} graph
	 * @param {Object} s
	 * @param {Object} p
	 * @param {Object} o
	 */
	constructor: function(graph, s, p, o, asserted) {
		this._graph = graph;
		this._s = s;
		this._p = p;
		this._o = o;
		this._o._statement = this;
		this._asserted = asserted;
	}	
});