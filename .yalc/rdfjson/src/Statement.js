import ns from './namespaces';

/**
 * rdfjson.Statement Represents a statement in a graph.
 * Never create directly, use the methods in rdfjson.Graph.
 * Constructs a statement from the provided parts, the object is assumed to be the same
 * actual javascript object as is used in the graph.
 *
 * @exports rdfjson/Statment
 */
export default class Statement {
  /**
   * @param {rdfjson/Graph} graph the rdfjson.Graph we will manipulate.
   * @param {String} s the subject in the statement
   * @param {String} p the predicate in the statement.
   * @param {Object} o the object in the statement.
   * @param {Boolean} asserted indicates if the statement is asserted in the accompanied graph.
   * @constructor
   */
  constructor(graph, s, p, o, asserted) {
    this._graph = graph;
    this._s = s;
    this._p = p;
    this._o = o;
    this._o._statement = this;
    this._asserted = asserted;
  }

  /**
   * The Graph this Statement is associated with.
   * @returns {rdfjson.Graph}
   */
  getGraph() {
    return this._graph;
  }

  /**
   * An asserted statement is present in its associated Graph
   * @param {Boolean} asserted
   */
  setAsserted(asserted) {
    if (asserted !== this._asserted) {
      if (asserted) {
        this._graph.add(this, undefined, undefined, this._silentValue);
      } else {
        this._graph.remove(this, this._silentValue);
      }
      this._asserted = asserted;
    }
  }

  /**
   * True if the Statement is asserted in the Graph.
   * @returns {Boolean}
   */
  isAsserted() {
    return this._asserted;
  }

  /**
   * The subject of this statement.
   * @returns {String}
   */
  getSubject() {
    return this._s;
  }

  isSubjectBlank() {
    if (this._sIsBlank !== true && this._sIsBlank !== false) {
      this._sIsBlank = this._s.indexOf('_:') === 0;
      // this._sIsBlank = this._graph._bnodes[this._s] === true;
    }
    return this._sIsBlank;
  }

  isObjectBlank() {
    return this.getType() === 'bnode';
  }

  /**
   * Sets the subject of this statement, other Statements with this resource as subject or object
   * is not affected.
   * @param {String} s must be a valid URI.
   */
  setSubject(s) {
    this._silentValue = false;
    const _s = ns.expand(s);
    if (this._asserted) {
      this._graph.remove(this);
      this._s = _s;
      this._graph.add(this);
      delete this._sIsBlank;
    } else {
      this._s = _s;
    }
  }

  /**
   * The predicate of this Statement.
   * @returns {String}
   */
  getPredicate() {
    return this._p;
  }

  /**
   * Sets the predicate of this statement.
   * @param {String} p must be a valid URI.
   */
  setPredicate(p) {
    this._silentValue = false;
    const _p = ns.expand(p);
    if (this._asserted) {
      this._graph.remove(this);
      this._p = _p;
      this._graph.add(this);
    } else {
      this._p = _p;
    }
  }

  /**
   * @returns {String|undefined}
   */
  getNamedGraph() {
    return this._o.ng;
  }

  /**
   * @param ng
   */
  setNamedGraph(ng) {
    this._o.ng = ng;
  }

  /**
   * The object of the Statement.
   *
   * @returns {Object}
   */
  getObject() {
    return this._o;
  }



  /**
   * The object of the Statement.
   *
   * @returns {Object}
   */
  getCleanObject() {
    const _o = this._o;
    const o = {
      value: _o.value,
      type: _o.type,
    };
    if (this._o.ng) {
      o.ng = _o.ng;
    }
    if (_o.lang) {
      o.lang = _o.lang;
    }
    if (this._o.datatype) {
      o.datatype = _o.datatype;
    }
    return o;
  }

  /**
   * @returns {String} one of uri, bnode and literal
   */
  getType() {
    return this._o.type;
  }

  /**
   * @param {String} type must be one of uri, bnode and literal.
   */
// eslint-disable-next-line no-unused-vars,class-methods-use-this
  setType(type) {
    throw new Error('Changing the type of an object is not supported, create a new' +
      ' statement instead.');
  }

  /**
   * If type is uri it is a URI, if type is a literal it is the literal string.
   * If type is a bnode the value is a internal bnode identity, should only be used for
   * references within the current graph.
   * @returns {String}
   */
  getValue() {
    return this._o.value;
  }

  /**
   * Sets the uri, literal or bnode of the current Statement depending on the type.
   * @param {String} value must be a uri if the type so indicates.
   * @param {boolean} [silent=false] the graph is not marked as "changed" if set to true
   */
  setValue(value, silent = false) {
    this._silentValue = silent === true;
    if (value !== this._o.value) {
      this._o.value = value;
      if (this.isAsserted() && silent !== true) {
        this._graph.setChanged();
      }
    }
  }

  /**
   * @returns {String} a language expressed using RFC-3066
   */
  getLanguage() {
    return this._o.lang;
  }

  /**
   * Sets the language of the object, only acceptable if the type is literal.
   * @param {String} lang the language expressed using RFC-30-66
   */
  setLanguage(lang, silent) {
    this._silentValue = silent === true;
    if (this._o.type !== 'literal') {
      throw new Error('Cannot set the language for a resource, has to be a literal');
    }
    if (this._o.lang !== lang) {
      this._o.lang = lang;
      if (this.isAsserted() && silent !== true) {
        this._graph.setChanged();
      }
    }
  }

  /**
   * The datatype of this object, only acceptable if the type is literal.
   * @returns {String} the datatype is always represented via a URI.
   */
  getDatatype() {
    return this._o.datatype;
  }

  /**
   * Set the datatype, only acceptable if the type is literal and no language is set.
   * @param {String} datatype the datatype expressed as a URI.
   */
  setDatatype(datatype, silent) {
    this._silentValue = silent === true;
    if (this._o.type !== 'literal' || this._o.lang != null) {
      throw new Error('Cannot set the datatype for a resource, has to be a literal');
    }
    if (this._o.datatype !== datatype) {
      this._o.datatype = datatype;
      if (this.isAsserted() && silent !== true) {
        this._graph.setChanged();
      }
    }
  }
};
