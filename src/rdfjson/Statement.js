/*global define*/
define([], function() {

	/**
	 * rdfjson.Statement Represents a statement in a graph.
	 * Never create directly, use the methods in rdfjson.Graph.
	 * Constructs a statement from the parts, the object is assumed to be the same instance as in the graph.
	 * 
	 * @param {Object} graph the rdfjson.Graph we will manipulate.
	 * @param {Object} s the subject in the statement
	 * @param {Object} p the predicate in the statement.
	 * @param {Object} o the object in the statement.
	 * @param {Boolean} asserted indicates if the statement is asserted in the accompanied graph.
	 */
	var Statement = function(graph, s, p, o, asserted) {
		this._graph = graph;
		this._s = s;
		this._p = p;
		this._o = o;
		this._o._statement = this;
		this._asserted = asserted;
	};
			
	//===================================================
	// Public API
	//===================================================
	Statement.prototype.getGraph = function() {
		return this._graph;
	};
	Statement.prototype.setAsserted = function(asserted) {
			if (asserted != this._asserted) {
				if (asserted) {
					this._graph.add(this);
				} else {
					this._graph.remove(this);
				}
				this._asserted = asserted;
			}
	};
	Statement.prototype.isAsserted = function() {
			return this._asserted;
	};
	Statement.prototype.getSubject = function() {
			return this._s;
	};
	Statement.prototype.setSubject = function(s) {
			if (this._asserted) {
				this._graph.remove(this);
				this._s = s;
				this._graph.add(this);
			} else {
				this._s = s;			
			}
	};
	Statement.prototype.getPredicate = function() {
			return this._p;
	};
	Statement.prototype.setPredicate = function(p) {
			if (this._asserted) {
				this._graph.remove(this);
				this._p = p;
				this._graph.add(this);
			} else {
				this._p = p;			
			}
	};
	Statement.prototype.getObject = function() {
		return this._o;
	};
	Statement.prototype.setType = function(type) {
			throw "Changing the type of an object is not supported, create a new statement instead.";
	};
	Statement.prototype.getType = function() {
			return this._o.type;
	};
	Statement.prototype.setValue = function(value) {
			this._o.value = value;
	};
	Statement.prototype.getValue = function() {
			return this._o.value;
	};
	Statement.prototype.setLanguage = function(lang) {
			if (this._o.type !== 'literal') {
				throw "Cannot set the language for a resource, has to be a literal";
			}
			this._o.lang = lang;
	};
	Statement.prototype.getLanguage = function() {
			return this._o.lang;
	};
	Statement.prototype.setDatatype = function(datatype) {
			if (this._o.type !== 'literal') {
				throw "Cannot set the datatype for a resource, has to be a literal";
			}
			this._o.datatype = datatype;
	};
	Statement.prototype.getDatatype = function() {
			return this._o.datatype;
	};
	
	return Statement;
});