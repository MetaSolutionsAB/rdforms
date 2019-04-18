// Four helper methods, from dojo.
const isObject = it => it !== undefined &&
  (it === null || typeof it === 'object' || Array.isArray(it) || typeof it === 'function');

const isString = it => (typeof it === 'string' || it instanceof String);

const isFunction = it => Object.prototype.toString.call(it) === '[object Function]';

const statementEquals = (s1, s2) =>
  s1.s === s2.s && s1.p === s2.p && objectEquals(s1.o, s2.o);

/**
 * Adds a statement to a graph object according to the rdf/json specification.
 * Duplicates of the same statement are not allowed in a graph,
 * hence they are not allowed to be added.
 *
 * The object in the statement are represented via an javascript object containing:
 * <ul><li>type - one of 'uri', 'literal' or 'bnode' (<b>required</b> and must be lowercase).</li>
 * <li>value - the lexical value of the object (<b>required</b>, full URIs should be used,
 * not namespaced using abbreviations)</li>
 * <li>lang - the language of a literal value (<b>optional</b>
 * but if supplied it must not be empty)</li>
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
const add = (graph, s, p, o) => {
  checkForWrongArgs([graph, s, p, o]);
  if (graph[s] === undefined) {
    graph[s] = {};
    graph[s][p] = [o];
    return o;
  }
  if (graph[s][p] === undefined) {
    graph[s][p] = [o];
    return o;
  }
  let i;
  const objs = graph[s][p];
  for (i = objs.length - 1; i >= 0; i--) {
    if (objectEquals(o, objs[i])) {
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
 * @return {Object|undefined} the object of the statement removed,
 *  undefined if no matching statement could be removed.
 * @throws {String} an error message if the arguments are not valid.
 * @see exports.add for a longer treatment of the allowed arguments.
 */
const remove = (graph, s, p, o) => {
  checkForWrongArgs([graph, s, p, o]);
  if (graph[s] === undefined || graph[s][p] === undefined) {
    return undefined;
  }
  let i;
  const objs = graph[s][p];
  for (i = objs.length - 1; i >= 0; i--) {
    if (objectEquals(o, objs[i])) {
      const _o = objs[i];
      objs.splice(i, 1);
      cleanup(graph, s, p);
      return _o;
    }
  }
  return undefined;
};

/**
 * Checks if the graph contains the specified statement.
 *
 * @param {Object} graph
 * @param {String} s
 * @param {String} p
 * @param {Object} o
 * @return {Object|undefined} the object of the found statement if the graph contains the
 * specified statement, undefined otherwise.
 * @throws {String} an error message if the arguments are not valid.
 */
const contains = (graph, s, p, o) => {
  checkForWrongArgs([graph, s, p, o]);
  if (graph[s] === undefined || graph[s][p] === undefined) {
    return undefined;
  }
  let i;
  const objs = graph[s][p];
  for (i = objs.length - 1; i >= 0; i--) {
    if (objectEquals(o, objs[i])) {
      return objs[i];
    }
  }
  return undefined;
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
const cleanup = (graph, s, p) => {
  if (graph[s][p].length === 0) {
    delete graph[s][p];
    if (Object.keys(graph[s]).length === 0) {
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
 * @see exports.add
 */
const checkForWrongArgs = (args) => {
  if (!isObject(args[0])) {
    throw new Error('Graph is not a object.');
  } else if (!isString(args[1])) {
    throw new Error('Subject is not a string.');
  } else if (!isString(args[2])) {
    throw new Error('Predicate is not a string.');
  } else if (!isObject(args[3])) {
    throw new Error('Object is not a object.');
  } else if (args[3].type === undefined) {
    throw new Error("Object has no type attribute, must be one of 'uri', 'literal', or" +
      " 'bnode'");
  } else if (args[3].value === undefined) {
    throw new Error('Object has no value attribute corresponding to the lexical value ' +
      'of the object.');
  }
  // TODO check that subject, predicate and object.datatype are uris.
  // TODO Also check that object.value is a URI if the type is uri.
};

/**
 * Compares two statement objects according to the RDF JSON Specification.
 * If both o1 and o2 are strings they are simply compared.
 * If one of o1 and o2 are a string and the other is an object the string is compared with the
 * value of the object ignoring any other attributes of the object.
 * If both o1 and o2 are null or undefined they are considered equal.
 *
 * @param {*} o1
 * @param {*} o2
 * @return {Boolean} true if they have the same type, lexical value, language, and datatype.
 */
const objectEquals = (o1, o2) => {
  if (o1 === o2 || (o1 == null && o1 === o2)) {
    return true;
  }
  // Note, using
  if (isString(o1)) {
    if (isString(o2)) {
      return o1 === o2;
    }
    return o1 === o2.value;
  } else if (isString(o2)) {
    return o1.value === o2;
  }
  return o1.type === o2.type && o1.value === o2.value && o1.lang === o2.lang &&
    o1.datatype === o2.datatype;
};

const findDirectOrRDFValue = (graph, subject, predicate) => {
  const arr = graph.find(subject, predicate);
  if (arr.length > 0) {
    if (arr[0].getType() !== 'bnode') {
      return arr[0].getValue();
    }
    return graph.findFirstValue(arr[0].getValue(), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value');
  }
  return undefined;
};

export default {
  isObject,
  isString,
  isFunction,
  statementEquals,
  add,
  remove,
  contains,
  cleanup,
  checkForWrongArgs,
  objectEquals,
  findDirectOrRDFValue,
}
