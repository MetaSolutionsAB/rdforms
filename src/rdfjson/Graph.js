/*global define*/
define(["./rdfjson", "./Statement"], function(rdfjson, Statement) {


var zeroOrOne = function(arr) {
	if (arr.length === 0) {
		return arr;
	} else {
		return [arr[0]];
	}
};

var perStatement = function(graph, statements, perSubject) {
	return {
		object: function(predicate) {
			for (var i=0;i<statements.length;i++) {
				var subj;
				if (perSubject) {
					subj = statements[i].getSubject();
				} else {
					var t = statements[i].getType();
					if (t === 'uri' || t === 'bnode') {
						continue;
					}
					subj = statements[i].getValue();
				}
				var stmts = graph.find(subj, predicate);
				if (stmts.length > 0) {
					perStatement(graph, [stmts[0]]);
				}
			}
			return perStatement(graph, []);
		},
		objects: function(predicate) {
			var nstats = [];
			if (perSubject === true) {
				for (var i=0;i<statements.length;i++) {
					nstats = nstats.concat(graph.find(statements[i].getSubject(), predicate));
				}
			} else {
				for (var i=0;i<statements.length;i++) {
					var t = statements[i].getType();
					if (t === 'uri' || t === 'bnode') {
						nstats = nstats.concat(graph.find(statements[i].getValue(), predicate));
					}
				}
			}
			return perStatement(graph, nstats);
		},
		constr: function(predicate, object) {
			if (rdfjson.isString(object)) {
				object = {type: 'uri', value: object};
			}
			var nstats = [];
			for (var i=0;i<statements.length;i++) {
				var subj = perSubject ? statements[i].getSubject() : statements[i].getValue();
				if (graph.find(subj, predicate, object).length > 0) {
					nstats.push(statements[i]);
				}
			}
			return perStatement(graph, nstats, perSubject);
		},
		/**
		 * For each match the callback will be called with a focused iterator.
		 */
		each: function(callback, type) {
			if (perSubject === true) {
				for (var i=0;i<statements.length;i++) {
					var subj = statements[i].getSubject();
					var t = subj.substring(0, 2) === "_:" ? 'bnode' : 'uri';
					if (type == null || type === t) {
						callback(perStatement(graph, statement[i], perSubject));
					}
				}
			} else {
				for (var i=0;i<statements.length;i++) {
					callback(perStatement(graph, statements[i], perSubject));
				}
			}
		},
		nodes: function(type) {
			var res = [];
			if (perSubject === true) {
				for (var i=0;i<statements.length;i++) {
					var subj = statements[i].getSubject();
					var t = subj.substring(0, 2) === "_:" ? 'bnode' : 'uri';
					if (type == null || type === t) {
						res.push({type: t, value: statements[i].getSubject()});
					}
				}
			} else {
				for (var i=0;i<statements.length;i++) {
					if (type == null || type === statements[i].getType()) {
						res.push(statements[i].getObject());
					}
				}
			}
			return res;
		},
		values: function(type) {
			var res = [];
			if (perSubject === true) {
				for (var i=0;i<statements.length;i++) {
					var subj = statements[i].getSubject();
					var t = subj.substring(0, 2) === "_:" ? 'bnode' : 'uri';
					if (type == null || type === t) {
						res.push(statements[i].getSubject());
					}
				}
			} else {
				for (var i=0;i<statements.length;i++) {
					if (type == null || type === statements[i].getType()) {
						res.push(statements[i].getValue());
					}
				}
			}
			return res;
		},
		firstValue: function(type) {
			if (perSubject === true) {
				for (var i=0;i<statements.length;i++) {
					var subj = statements[i].getSubject();
					var t = subj.substring(0, 2) === "_:" ? 'bnode' : 'uri';
					if (type == null || type === t) {
						return statements[i].getSubject();
					}
				}
			} else {
				for (var i=0;i<statements.length;i++) {
					if (type == null || type === statements[i].getType()) {
						return statements[i].getValue();
					}
				}
			}
		}
	}
};


/**
 * Graph wraps a pure RDF JSON object to make it easy to access and manipulate on the level of rdfjson.Statements.
 * Note that for efficiency reasons the RDF JSON object will be extended, hence it will contain attributes 
 * that goes beyond the specification. Hence, note that the pure RDF JSON object:
 * <ul><li>can still be inspected independently, it will contain the correct RDF expression.</li>
 *  <li>cannot be modified directly since it will conflict with manipulations via this class, 
 *      the exception is the statement object attributes which can be updated.</li>
 *  <li>is now unsuitable to be communicated for instance back to a server storage 
 *      due to the extra attributes. Use the exportRDFJSON function to get a clean RDF JSON object.</li></ul>
 * 
 * TODO: Graph level operations (set operations), 
 * e.g. joining two graphs, requires careful renaming of bnodes.
 */

/**
 * The constructor is sheep, no indexes or additional statements
 * are created until strictly needed.
 * 
 * @param {Object} graph a pure RDF JSON object according to the specification that will be manipulated internally.
 */
var Graph = function(graph, validate) {
		this._graph = graph || {};
		/**
		 * Internal index of bnodes, will never shrink after creation of this graph instance.
	 	 * New bnodes will be added but bnodes contained in removed statements will be kept
	 	 * in case the statement is only temporarily unasserted.
	 	 */
		this._bnodes = {};
		/**
	 	 * If true the graph has been iterated through and all found bnodes have been added to index.
		 */
		this._bnodesIndexed = false;

		if (validate !== false) {
			this.validate();			
		}
};
	
	//===================================================
	// Public API
	//===================================================	
	/**
	 * Adds the provided statement to the graph.
	 * The statement may originate from another graph, although potential bnodes are not renamed.
	 *  
	 * @param {Object} statement
	 * @see rdfjson.Statement
	 */
	Graph.prototype.add = function(statement) {
		this._trackBNodes(statement._s, statement._p, statement._o);
		return this._get(statement._s, statement._p,
						 rdfjson.add(this._graph, statement._s, statement._p, 
									 this._graphObject(statement._o)), 
						 true);
	};
	
	/**
	 * Convenience function that combines the find and remove functions.
	 */
	Graph.prototype.findAndRemove = function(s, p, o) {
		var stmts = this.find(s, p, o);
		for (var i=0;i<stmts.length;i++) {
			this.remove(stmts[i]);
		}
	};
	
	/**
	 * Removes the given statement from the graph.
	 * If you plan to keep the statement around and assert it later, 
	 * it is recommended to only use the rdfjson.Statement#setAsserted method instead.
	 *  
	 * @param {Object} statement the statement to remove from the graph.
	 */
	Graph.prototype.remove = function(statement) {
		this._trackBNodes(statement._s, statement._p, statement._o);
		return this._get(statement._s, statement._p, 
						 rdfjson.remove(this._graph, statement._s, statement._p, statement._o),
						 false);
	};
	
	/**
	 * Finds all statements that fulfills the given pattern. Any combination of the arguments may be left out.
	 *   
	 * @param {String} s the subject in the statements to be returned, undefined indicates that any subject is ok.
	 * @param {String} p the predicate in the statements to be returned, undefined indicates that any predicate is ok.
	 * @param {Object} o the object in the statements to be returned, undefined indicates that any object is ok.
	 * @return {Array} of Statements, may be empty, not undefined.
	 */
	Graph.prototype.find = function(s, p, o) {
		// none, s, p, s&p 
		if (o == null) {
			// none, s
			if (p == null) {
				if (s == null) {
					return this._find();
				} else {
					return this._findS(s);
				}
			// p, s&p
			} else {
				// p
				if (s == null) {
					return this._findP(p);
				// s&p
				} else {
					return this._findSP(s, p);
				}
			}
		}
		// o, s&o
		if (p == null) {
			if (s == null) {
				return this._findO(o);				
			} else {
				return this._findSO(s,o);
			}
		}

		// p&o 
		if (s == null) {
			return this._findPO(p, o);
		}
		
		//s&p&o
		var stmt = this._get(s, p, rdfjson.contains(this._graph, s, p, o), true);
		if (stmt == null) {
			return [];
		} else {
			return [stmt];
		}
	};
	
	/**
	 * Convenience method that returns the value of the first matching statement
	 * for the given subject and predicate.
	 * 
	 * @param {Object} s the subject
	 * @param {Object} p the predicate
	 * @return {String} the value, may be a literal or a URI, if undefined no matching statement (and value) could be found.
	 * @see find
	 */
	Graph.prototype.findFirstValue = function(s, p) {
		var arr = this.find(s, p);
		if (arr.length > 0) {
			return arr[0].getValue();
		}
	};
	
	Graph.prototype.subjects = function(p, o) {
		return perStatement(this, this.find(null, p, o), true);
	};
	Graph.prototype.subject = function(p, o) {
		return perStatement(this, zeroOrOne(this.find(null, p, o)), true);
	};

	Graph.prototype.objects = function(s, p) {
		return perStatement(this, this.find(s, p, null));
	};	

	Graph.prototype.object = function(s, p) {
		return perStatement(this, zeroOrOne(this.find(s, p, null)));
	};	
		
	/**
	 * Creates a new statement and adds it to the graph unless explicitly specified not to via the assert flag. 
	 * 
	 * @param {String} s the subject in the form of a uri, if undefined a new blank node is created.
	 * @param {String} p the predicate in the form of a uri, if undefined a new blank node is created.
	 * @param {Object} o the object in the form of an object containing 
	 *  the attributes: 'type', 'value', 'lang', and 'datatype'. If undefined a new blank node is created. 
	 * @param {Boolean} assert indicated if the statement should be added to the graph directly. If not specified true is assumed. 
	 */
	Graph.prototype.create = function(s, p, o, assert) {
		if (s == null) {
			s = this._newBNode();
		}
		if (p == null) {
			p = this._newBNode();
		}
		if (o == null) {
			o = {type: 'bnode', value: this._newBNode()};
		} else {
			//The object is copied to avoid reuse of same object in multiple places of the graph
			//leading to strange updates.
			o = {type: o.type, value: o.value, lang: o.lang, datatype: o.datatype};
		}
		if (assert !== false) {
			return this._get(s, p, rdfjson.add(this._graph, s, p, o), true);			
		} else {
			return new Statement(this, s, p, o, false);	
		}
	};

	Graph.prototype.registerBNode = function(bNodeId) {
		this._bnodes[bNodeId] = true;
	};

	/**
	 * @return a plain RDF JSON object without the additional artifacts created by this graph class.
	 * The returned object is suitable for serilazation and communicated with other systems.
	 */
	Graph.prototype.exportRDFJSON = function() {
		var s, p, oindex, graph = this._graph, ngraph = {}, objArr, nObjArr, o, no;
		for (s in graph) {
			if (graph.hasOwnProperty(s)) {
				ngraph[s] = {};
				for (p in graph[s]) {
					if (graph[s].hasOwnProperty(p)) {
						objArr = graph[s][p];
						nObjArr = ngraph[s][p] = [];
						for (oindex = objArr.length-1;oindex>=0;oindex--) {
							o = objArr[oindex];
							no = {type: o.type, value: o.value};
							if (o.lang != null) {
								no.lang = o.lang;
							}
							if (o.datatype != null) {
								no.datatype = o.datatype;
							}
							nObjArr.push(no);
						}
					}
				}
			}
		}
		return ngraph;
	};
	Graph.prototype.clone = function() {
		return new Graph(this.exportRDFJSON());
	};
	
	/**
	 * Finds all properties for a given subject.
	 * Note: Optimal.
	 * @param {String} s
	 * @return {Array} of strings
	 */
	Graph.prototype.findProperties = function(s) {
		if (this._graph[s] == null) {
			return [];
		}
		var p, graph = this._graph, predicates = [];
		for (p in graph[s]) {
			if (graph[s].hasOwnProperty(p)) {
				predicates.push(p);
			}
		}
		return predicates;
	};
	
	/**
	 * Validates the graph, if errors are detected an exception is thrown.
	 */
	Graph.prototype.validate = function() {
		this.report = this._validate();
		if (!this.report.valid) {
			throw(this.report);
		}
	};


	//===================================================
	// Private methods
	//===================================================
	/**
	 * If the object already contains a statement that is returned, otherwise a new is created.
	 * @return {Object} a statement that belongs to this graph.
	 */
	Graph.prototype._get = function(s, p, o, asserted) {
		if (o == null) {
			return;
		}
		if (o._statement == null) {
			new Statement(this, s, p, o, asserted);
		}
		return o._statement;
	};
	
	/**
	 * @return {Object} if the object originates from another graph a copy is made.
	 */
	Graph.prototype._graphObject = function(o) {
		if (o._statement == null ||
			o._statement._graph === this) {
			return o;
		}
		return {type: o.type, value: o.value, lang: o.lang, datatype: o.datatype};
	};

	/**
	 * Finds all statements with a given subject and object.
	 * @param {Object} s
	 * @param {Object} p
	 */
	Graph.prototype._findSP = function(s,p) {
		if (this._graph[s] == null || this._graph[s][p] == null) {
			return [];
		}
		var arr = [], objs = this._graph[s][p];
		for (var i=0;i<objs.length;i++) {
			arr[i] = this._get(s, p, objs[i], true);
		}
		return arr;
	};

	/**
	 * Finds all statements with a given subject.
	 * Note: Optimal.
	 * @param {Object} s
	 */
	Graph.prototype._findS = function(s) {
		if (this._graph[s] == null) {
			return [];
		}
		var p, oindex, graph = this._graph, sArr = [], spArrs = [];
		for (p in graph[s]) {
			if (graph[s].hasOwnProperty(p)) {
				spArrs.push(this._findSP(s, p));
			}
		}
		return Array.prototype.concat.apply([], spArrs);
	};

	/**
	 * Generates statements for the entire graph.
	 * Note: Optimal.
	 */
	Graph.prototype._find = function() {
		var arr = [], that = this;
		this._map(function(s1, p1, o1) {
			arr.push(that._get(s1, p1, o1, true));
		});
		return arr;
	};
	
	/**
	 * Finds all statements with a given predicate.
	 * Note: Close to optimal without further indexing, to many checks due to iteration via _map. 
	 * @param {Object} p
	 */
	Graph.prototype._findP = function(p) {
		var arr = [], that=this;
		this._map(function(s1, p1, o1) {
			if (p===p1) {
				arr.push(that._get(s1, p1, o1, true));				
			}
		});
		return arr;		
	};
	
	/**
	 * Iterates through all statements to find those with specified object.
	 * Note: Optimal without additional indexing.
	 * @param {Object} o
	 */
	Graph.prototype._findO = function(o) {
		var arr = [], that = this;
		this._map(function(s1, p1, o1) {
			if (rdfjson.objectEquals(o, o1)) {
				arr.push(that._get(s1, p1, o1, true));				
			}
		});
		return arr;		
	};

	/**
	 * Finds all statements with a given subject and object.
	 * Note: Close to optimal without further indexing, to many checks due to iteration via _map.
	 */
	Graph.prototype._findSO = function(s, o) {
		var arr = [], that = this;
		this._map(function(s1, p1, o1) {
			if (s===s1 && rdfjson.objectEquals(o, o1)) {
				arr.push(that._get(s1, p1, o1, true));				
			}
		});
		return arr;		
	};

	/**
	 * Finds all statements with a given predicate and object.
	 * Note: Close to optimal without further indexing, to many checks due to iteration via _map.
	 */
	Graph.prototype._findPO = function(p, o) {
		var arr = [], that = this;
		this._map(function(s1, p1, o1) {
			if (p===p1 && rdfjson.objectEquals(o, o1)) {
				arr.push(that._get(s1, p1, o1, true));				
			}
		});
		return arr;
	};
	
	/**
	 * Iterates through all statements of the graph and calls the provided function on them.
	 * 
	 * @param {Function} f are called for each statement with the three arguments 
	 *  (in order) subject, predicate, and object. 
	 */
	Graph.prototype._map = function(f) {
		var s, p, oindex, graph = this._graph, objArr;
		for (s in graph) {
			if (graph.hasOwnProperty(s)) {
				for (p in graph[s]) {
					if (graph[s].hasOwnProperty(p)) {
						objArr = graph[s][p];
						for (oindex = objArr.length-1;oindex>=0;oindex--) {
							f(s, p, objArr[oindex]);
						}
					}
				}
			}
		}
	};
	
	Graph.prototype._validate = function() {
		var s, p, oindex, graph = this._graph, objArr, report = {valid: true, errors: [], nr: 0};
		for (s in graph) {
			if (graph.hasOwnProperty(s)) {
				if (!rdfjson.isObject(graph[s])) {
					report.errors.push({s: s, message: "Subject must point to an object."});
					report.valid = false;
					continue;
				}
				for (p in graph[s]) {
					if (graph[s].hasOwnProperty(p)) {
						objArr = graph[s][p];
						if (!rdfjson.isArray(objArr)) {
							report.errors.push({s: s, p: p, message: "Predicate must point to an array of objects."});
							report.valid = false;
							continue;
						}
						
						for (oindex = objArr.length-1;oindex>=0;oindex--) {
							var o = objArr[oindex];
							if (!rdfjson.isObject(o)) {
								report.errors.push({s: s, p: p, oindex: (oindex+1), message: "Element "+(oindex+1)+" in object array is not an object."});
								report.valid = false;
								continue;
							}
							if (o.type == null) {
								report.errors.push({s: s, p: p, oindex: (oindex+1), message: "Object "+(oindex+1)+" in object array lacks the attribute type, must be either 'literal', 'resource' or 'bnode'."});
								report.valid = false;
								continue;
							}
							if (!rdfjson.isString(o.value)) {
								report.errors.push({s: s, p: p, oindex: (oindex+1), message: "Object "+(oindex+1)+" in object array must have the 'value' attribute pointing to a string."});
								report.valid = false;
								continue;
							}
							report.nr++;
						}
					}
				}
			}
		}
		return report;
	};
	
	/**
	 * Creates a new bnode that is unique in the current graph.
	 * Bnodes in temporarily unasserted statements (currently removed from the graph)
	 * are avoided as well.   
	 */
	Graph.prototype._newBNode = function() {
		this._indexBNodes();
		var p, n, bnode;
		for (p=1;p<10;p++) {
			for (n=1;n<=p;n++) {
				bnode = "_:" + Math.floor(Math.random()*(Math.pow(10, p)+1));
				if (this._bnodes[bnode] !== true) {
					this._bnodes[bnode] = true;
					return bnode;
				}
			}
		}
	};
	
	/**
	 * Adds the bnodes in the graph to the bnode index.
	 * The index can be calculated late, just before the first call to create.
	 * (Bnodes in statements that are removed are added in advance to the index as 
	 * they may be only temporarily unasserted and when they are asserted again 
	 * they should not overlap with newly created bnodes.)
	 * After the index is created all statemnts added update the index.
	 */
	Graph.prototype._indexBNodes = function() {
		if (this._bnodesIndexed) {
			return;
		}
		var s, p, oindex, graph = this._graph, objArr;
		for (s in graph) {
			if (graph.hasOwnProperty(s)) {
				if (s.indexOf("_:") === 0) {
					this._bnodes[s] = true;
				}				
				for (p in graph[s]) {
					if (graph[s].hasOwnProperty(p)) {
						if (p.indexOf("_:") === 0) {
							this._bnodes[p] = true;
						}
						objArr = graph[s][p];
						for (oindex = objArr.length-1;oindex>=0;oindex--) {
							if (objArr[oindex].type === "bnode") {
								this._bnodes[objArr[oindex].value] = true;
							}
						}
					}
				}
			}
		}
		this._bnodesIndexed = true;
	};
	
	/**
	 * Adds any bnodes in the given parameters to the index (the index may still be incomplete).
	 * @param {Object} s the subject in a statement.
	 * @param {Object} p the predicate in a statement.
	 * @param {Object} o the object in a statement.
	 */
	Graph.prototype._trackBNodes = function(s, p, o) {
		if (s.indexOf("_:") === 0) {
			this._bnodes[s] = true;
		}
		if (p.indexOf("_:") === 0) {
			this._bnodes[p] = true;
		}
		if (o.type === "bnode") {
			this._bnodes[o.value] = true;
		}
	};
	return Graph;
});