/*global dojo, rdfjson*/
dojo.provide("rdfjson.base");

rdfjson.statementEquals = function (s1, s2) {
	return s1.s === s2.s && s1.p === s2.p && rdfjson.objectEquals(s1.o, s2.o);
};

/**
 * Adds a statement to a graph object according to the rdf/json specification. 
 * Duplicates of the same statement are not allowed in a graph, 
 * hence they are not allowed to be added.
 * 
 * The object in the statement are represented via an javascript object containing:
 * <ul><li>type - one of 'uri', 'literal' or 'bnode' (<b>required</b> and must be lowercase).</li>
 * <li>value - the lexical value of the object (<b>required</b>, full URIs should be used, not qnames)</li>
 * <li>lang - the language of a literal value (<b>optional</b> but if supplied it must not be empty)</li>
 * <li>datatype - the datatype URI of the literal value (<b>optional</b>)</li>
 * The 'lang' and 'datatype' keys should only be used if the value of the 'type' key is "literal". 
 * 
 * @param {Object} graph according to the rdf/json specification.
 * @param {String} s a URI representing the subject in a statement. 
 * @param {String} p a URI representing the predicate in a statement.
 * @param {Object} o an object representing either a resource or a literal, 
 *  see format described above.
 * @return {Object} the javascript object corresponding to the statements object just added, 
 *  note that it might be a clone of the object given in the parameter o
 * (for instance when the statement already exists in the graph).
 * @throws {String} an error message if the arguments are not valid. 
 * @see The <a href="http://n2.talis.com/wiki/RDF_JSON_Specification">RDF JSON Specification</a>.
 */
rdfjson.add = function(graph, s, p, o) {
	rdfjson.checkForWrongArgs(arguments);
	if (graph[s] === undefined) {
		graph[s] = {};
		graph[s][p] = [o];
		return o;
	}
	if (graph[s][p] === undefined) {
		graph[s][p] = [o];
		return o;
	}
	var i,objs=graph[s][p];
	for(i=objs.length-1;i>=0;i--) {
		if (rdfjson.objectEquals(o, objs[i])) {
			return objs[i];
		}
	}
	objs.push(o);
	return o;
};

/**
 * Tries to remove the specified statement from the given graph. 
 * If it is successful it returns the object of the statment removed. 
 * 
 * @param {Object} graph
 * @param {Object} s
 * @param {Object} p
 * @param {Object} o
 * @return {Object} the object of the statement removed, 
 *  undefined if no matching statement could be removed.
 * @throws {String} an error message if the arguments are not valid. 
 * @see rdfjson.add for a longer treatment of the allowed arguments.
 */
rdfjson.remove = function(graph, s, p, o) {
	rdfjson.checkForWrongArgs(arguments);
	if (graph[s] === undefined || graph[s][p] === undefined) {
		return;
	}
	var i,objs=graph[s][p];
	for(i=objs.length-1;i>=0;i--) {
		if (rdfjson.objectEquals(o, objs[i])) {
			o = objs[i];
			objs.splice(i, 1);
			rdfjson.cleanup(graph, s, p);
			return o;
		}
	}
};

/**
 * Checks if the graph contains the specified statement.
 * 
 * @param {Object} graph
 * @param {Object} s
 * @param {Object} p
 * @param {Object} o
 * @return {Object} the object of the found statement if the graph contains the specified statement, undefined otherwise.
 * @throws {String} an error message if the arguments are not valid. 
 */
rdfjson.contains = function(graph, s, p, o) {
	rdfjson.checkForWrongArgs(arguments);
	if (graph[s] === undefined || graph[s][p] === undefined) {
		return;
	}
	var i,objs=graph[s][p];
	for(i=objs.length-1;i>=0;i--) {
		if (rdfjson.objectEquals(o, objs[i])) {
			return objs[i];
		}
	}
};

/**
 * Removes empty structures in the graph for the given subject and predicate.
 * It checks if there are subjects without outgoing properties or 
 * if there are properties with no objects.
 * 
 * Note that the need for this function is a consequence of the normalized character 
 * of the RDF JSON format.
 *  
 * @param {Object} graph
 * @param {Object} s
 * @param {Object} p
 */
rdfjson.cleanup = function(graph, s, p) {
	if (graph[s][p].length === 0) {
		delete graph[s][p];
		var hasProp = false;
		for(var prop in graph[s]) {
			if (graph[s].hasOwnProperty(prop)) {
				hasProp = true;
				break;
			}
		}
		if (!hasProp) {
			delete graph[s];
		}
	}
};

/**
 * Checks the arguments for the add function are valid 
 * (and all other functions that have the same signature).
 * 
 * @param {Array} args an array of the arguments for the add function.
 * @throws {String} with a message if the arguments are not valid.
 * @see rdfjson.add
 */
rdfjson.checkForWrongArgs = function(args) {
	if (!dojo.isObject(args[0])) {
		throw "Graph is not a object.";
	} else if (!dojo.isString(args[1])) {
		throw "Subject is not a string.";		
	} else if (!dojo.isString(args[2])) {
		throw "Predicate is not a string.";		
	} else if (!dojo.isObject(args[3])) {
		throw "Object is not a object.";		
	} else if (args[3].type === undefined) {
		throw "Object has no type attribute, must be one of 'uri', 'literal', or 'bnode'";		
	} else if (args[3].value === undefined) {
		throw "Object has no value attribute corresponding to the lexical value of the object.";
	}
	//TODO check that subject, predicate and object.datatype are uris. Also check that object.value is a URI if the type is uri.
};

/**
 * Compares two statement objects according to the RDF JSON Specification. 
 * 
 * @param {Object} o1
 * @param {Object} o2
 * @return {boolean} true if they have the same type, lexical value, language, and datatype.
 */
rdfjson.objectEquals =  function(o1, o2) {
	if (dojo.isString(o1)) {
		if (dojo.isString(o2)) {
			return o1 === o2;
		} else {
			return o1 === o2.value;
		}
	} else if (dojo.isString(o2)) {
		return o1.value === o2;
	} else {
		return o1.type === o2.type && o1.value === o2.value && o1.lang === o2.lang && o1.datatype === o2.datatype;		
	}
};

rdfjson.findDirectOrRDFValue = function(graph, subject, predicate) {
	var arr = graph.find(subject, predicate);
	if (arr.length > 0) {
		if (arr[0].getType() != "bnode") {
			return arr[0].getValue();
		} else {
			return rdfjson.findValue(graph, arr[0].getValue(),"http://www.w3.org/1999/02/22-rdf-syntax-ns#value");
		}
	}
};