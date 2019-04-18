import rdfjsonUtil from './formats/rdfjson/util';
import ns from './namespaces';
import Statement from './Statement';
import utils from './utils';

/**
 * @param {Array} arr
 * @returns {*}
 * @private
 */
const zeroOrOne = arr => (arr.length === 0 ? arr : [arr[0]]);

/**
 * @param {rdfjson/Graph} graph
 * @param {rdfjson/Statement[]} statements an array
 * @param {Boolean=} perSubject if true means that all consecutive calls will be focused on
 * all the subjects of the specified statments, otherwise the resource objects of the statements
 * will be the focus. Assumed to be false unless explicitly set to true.
 *
 * @returns {{object: Function, objects: Function, constr: Function, each: Function, nodes:
 * Function, values: Function, firstValue: Function}}
 * @private
 */
const perStatement = (graph, statements, perSubject) => ({
  object(predicate) {
    for (let i = 0; i < statements.length; i++) {
      let subj;
      if (perSubject) {
        subj = statements[i].getSubject();
      } else {
        const t = statements[i].getType();
        if (t === 'uri' || t === 'bnode') {
          // eslint-disable-next-line no-continue
          continue;
        }
        subj = statements[i].getValue();
      }
      const stmts = graph.find(subj, predicate);
      if (stmts.length > 0) {
        perStatement(graph, [stmts[0]]);
      }
    }
    return perStatement(graph, []);
  },
  objects(predicate) {
    let nstats = [];
    let i;
    if (perSubject === true) {
      for (i = 0; i < statements.length; i++) {
        nstats = nstats.concat(graph.find(statements[i].getSubject(), predicate));
      }
    } else {
      for (i = 0; i < statements.length; i++) {
        const t = statements[i].getType();
        if (t === 'uri' || t === 'bnode') {
          nstats = nstats.concat(graph.find(statements[i].getValue(), predicate));
        }
      }
    }
    return perStatement(graph, nstats);
  },
  constr(predicate, object) {
    let _object = object;
    if (rdfjsonUtil.isString(_object)) {
      _object = { type: 'uri', value: _object };
    }
    const nstats = [];
    for (let i = 0; i < statements.length; i++) {
      const subj = perSubject ? statements[i].getSubject() : statements[i].getValue();
      if (graph.find(subj, predicate, _object).length > 0) {
        nstats.push(statements[i]);
      }
    }
    return perStatement(graph, nstats, perSubject);
  },
  /**
   * For each match the callback will be called with a focused iterator.
   */
  each(callback, type) {
    if (perSubject === true) {
      for (let i = 0; i < statements.length; i++) {
        const subj = statements[i].getSubject();
        const t = subj.substring(0, 2) === '_:' ? 'bnode' : 'uri';
        if (type == null || type === t) {
          callback(perStatement(graph, statements[i], perSubject));
        }
      }
    } else {
      for (let j = 0; j < statements.length; j++) {
        callback(perStatement(graph, statements[j], perSubject));
      }
    }
  },
  nodes(type) {
    const res = [];
    if (perSubject === true) {
      for (let i = 0; i < statements.length; i++) {
        const subj = statements[i].getSubject();
        const t = subj.substring(0, 2) === '_:' ? 'bnode' : 'uri';
        if (type == null || type === t) {
          res.push({ type: t, value: statements[i].getSubject() });
        }
      }
    } else {
      for (let j = 0; j < statements.length; j++) {
        if (type == null || type === statements[j].getType()) {
          res.push(statements[j].getObject());
        }
      }
    }
    return res;
  },
  values(type) {
    const res = [];
    if (perSubject === true) {
      for (let i = 0; i < statements.length; i++) {
        const subj = statements[i].getSubject();
        const t = subj.substring(0, 2) === '_:' ? 'bnode' : 'uri';
        if (type == null || type === t) {
          res.push(statements[i].getSubject());
        }
      }
    } else {
      for (let j = 0; j < statements.length; j++) {
        if (type == null || type === statements[j].getType()) {
          res.push(statements[j].getValue());
        }
      }
    }
    return res;
  },
  firstValue(type) {
    if (perSubject === true) {
      for (let i = 0; i < statements.length; i++) {
        const subj = statements[i].getSubject();
        const t = subj.substring(0, 2) === '_:' ? 'bnode' : 'uri';
        if (type == null || type === t) {
          return statements[i].getSubject();
        }
      }
    } else {
      for (let j = 0; j < statements.length; j++) {
        if (type == null || type === statements[j].getType()) {
          return statements[j].getValue();
        }
      }
    }
    return undefined;
  },
});

/**
 * Provides an API for accessing and manipulating an RDF Graph.
 *
 * The Graph API wraps a pure RDF JSON object to make it easy to access and manipulate on the
 * level of rdfjson/Statements.
 * Note that for efficiency reasons the RDF JSON object will be extended, hence it will
 * contain attributes that goes beyond the specification.
 *
 * The pure RDF JSON object:
 * <ul><li>can still be inspected independently, it will contain the correct RDF expression.
 *     </li>
 *     <li>cannot be modified directly since it will conflict with manipulations via this
 *     class, the exception is the statement object attributes which can be updated.</li>
 *     <li>is now unsuitable to be communicated for instance back to a server storage
 *      due to the extra attributes. Use the exportRDFJSON function to get a clean RDF
 *      JSON object.</li></ul>
 *
 * @exports rdfjson/Graph
 */
export default class Graph {
  /**
   * The constructor is sheap, no indexes or additional statements are created until requested
   * or created.
   * @param {Object=} graph a pure RDF JSON object according to the specification that will be
   * manipulated internally.
   * @param {Boolean=} validate indicates wether to validate the graph directly or not.
   */
  constructor(graph = null, validate) {
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
    this._changed = false;
  }

  /**
   * @return {Boolean} true if the graph contains no asserted statements.
   */
  isEmpty() {
    return !Object.keys(this._graph).find((s) => {
      const props = this._graph[s];
      return Object.keys(props).find(p =>
        props[p].find(o => o._statement == null || o._statement.isAsserted()));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onChange() {
  }

  setChanged(changed) {
    this._changed = !!(changed === true || changed == null);
    if (this._changed) {
      this.onChange();
    }
  }

  isChanged() {
    return this._changed;
  }

  /**
   * Adds all statements of a graph to the current graph.
   * Will create new blank nodes ids in the source graph to avoid clashes with target graph.
   *
   * @param graph
   */
  addAll(graph, ng) {
    const bnodeIdx = {};
    let bn;
    const stmts = graph.find();
    for (let i = 0; i < stmts.length; i++) {
      const stmt = stmts[i];
      let s = stmt.getSubject();
      let p = stmt.getPredicate();
      const o = stmt.getCleanObject();
      if (ng) {
        o.ng = ng;
      }

      if (s.indexOf('_:') === 0) {
        bn = bnodeIdx[s] || this._newBNode();
        bnodeIdx[s] = bn;
        s = bn;
      }
      if (p.indexOf('_:') === 0) {
        bn = bnodeIdx[p] || this._newBNode();
        bnodeIdx[p] = bn;
        p = bn;
      }
      if (o.type === 'bnode') {
        bn = bnodeIdx[o.value] || this._newBNode();
        bnodeIdx[o.value] = bn;
        o.value = bn;
      }
      this.add(s, p, o);
    }
  }

  /**
   * Adds a statement to the graph, either an existing statement or creates an new one from the
   * triple pattern. If a statement instance is used it may originate from another graph, although
   * potential bnodes are not renamed.
   *
   * @param {rdfjson/Statement|string} s either the subject in a triple pattern or a Statement
   * instance to add,
   * in the latter case the other parameters must be undefined.
   * @param {string|null} p the predicate of the triple to add.
   * @param {Object|string} o the object where the attributes type, value, lang and datatype are
   * used to describe the object.
   * @param {boolean} [silent=false] silent if the change should mark the graph as changed
   * @returns {rdfjson/Statement}
   */
  add(s, p = null, o = null, silent = false) {
    if (s instanceof Statement) {
      const _p = s.getPredicate();
      const _o = s.getObject();
      const _s = s.getSubject();
      this._trackBNodes(_s, _p, _o);
      const o1 = this._graphObject(_o);
      const o2 = rdfjsonUtil.add(this._graph, _s, _p, o1);
      if (silent !== true) {
        this.setChanged();
      }
      return this._get(_s, _p, o2, true);
    }
    return this.create(s, p, o, true, silent);
  }

  addL(s, p, value, lang) {
    const o = { type: 'literal', value };
    if (typeof lang === 'string') {
      o.lang = lang;
    }
    return this.create(s, p, o, true);
  }

  addD(s, p, value, datatype) {
    const o = { type: 'literal', value };
    if (typeof datatype === 'string') {
      o.datatype = ns.expand(datatype);
    }
    return this.create(s, p, o, true);
  }

  /**
   * Creates a new statement and associates it to the graph, unless assert is explicitly set to
   * false it is also added to the graph.
   *
   * @param {String=} s the subject as a uri, if undefined a new blank node is created.
   * @param {String} p the predicate as a uri, if undefined a new blank node is created.
   * @param {Object} o the object in the form of an object containing the attributes:
   * 'type', 'value', 'lang', and 'datatype'. If undefined a new blank node is created.
   *  If a string is provided it is assumed to be a url, i.e. sending in "the url" is the same as
   *  sending in {type: "uri", value: "the url"}.
   * @param {Boolean} [assert=true] indicated if the statement should be added to the graph directly.
   * If not specified true is assumed.
   * @param {boolean} [silent=false] silent if the change should mark the graph as changed
   * @returns {rdfjson/Statement}
   * @see rdfjson/rdfjson#add
   */
  create(s = null, p = null, o = null, assert = true, silent = false) {
    let _s = s;
    let _p = p;
    let _o = o;
    if (_s == null) {
      _s = this._newBNode();
    } else {
      _s = ns.expand(_s);
    }
    if (_p == null) {
      _p = this._newBNode();
    } else {
      _p = ns.expand(_p);
    }

    if (_o == null) {
      _o = { type: 'bnode', value: this._newBNode() };
    } else if (rdfjsonUtil.isString(_o)) {
      _o = { type: 'uri', value: ns.expand(_o) };
    } else {
      // The object is copied to avoid reuse of same object in multiple places of the graph
      // leading to strange updates.
      _o = { type: _o.type, value: _o.value, lang: _o.lang, datatype: _o.datatype };
      if (_o.type === 'uri' && _o.value != null) {
        _o.value = ns.expand(_o.value);
      }
      if (_o.datatype) {
        _o.datatype = ns.expand(_o.datatype);
      }
    }
    if (assert !== false) {
      const o1 = rdfjsonUtil.add(this._graph, _s, _p, _o);
      if (silent !== true) {
        this.setChanged();
      }
      return this._getOrCreate(_s, _p, o1, true);
    }
    return new Statement(this, _s, _p, _o, false);
  }

  /**
   * Convenience function that combines the find and remove functions.
   * @param {String=} s the subject
   * @param {String=} p the predicate
   * @param {Object=} o the object
   * @param {boolean} [silent=false] silent if the change should mark the graph as changed
   * @see rdfjson/Graph#find
   * @see rdfjson/Graph#remove
   */
  findAndRemove(s, p, o, silent = false) {
    const stmts = this.find(s, p, o);
    for (let i = 0; i < stmts.length; i++) {
      this.remove(stmts[i], silent);
    }
  }

  /**
   * Removes the given statement from the graph.
   * If you plan to keep the statement around and assert it later,
   * it is recommended to only use the rdfjson/Statement#setAsserted method instead.
   *
   * @param {rdfjson/Statement} statement the statement to remove from the graph.
   * @param {boolean} [silent=false] silent if the change should mark the graph as changed
   * @see rdfjson/Statement#setAsserted
   */
  remove(statement, silent = false) {
    const s = statement.getSubject();
    const p = statement.getPredicate();
    const o = statement.getObject();
    this._trackBNodes(s, p, o);
    if (rdfjsonUtil.remove(this._graph, s, p, o) != null) {
      if (silent !== true) {
        this.setChanged();
      }
    }
  }

  /**
   * Finds all statements that fulfills the given pattern. Any combination of the arguments may
   * be left out.
   *
   * @param {String=} s the subject in the statements to be returned, undefined indicates that
   * any subject is ok.
   * @param {String=} p the predicate in the statements to be returned, undefined indicates
   * that any predicate is ok.
   * @param {Object=} o the object in the statements to be returned, undefined indicates that
   * any object is ok.
   * Objets of matching statements have to be equal according to the objectEquals method.
   * @return {rdfjson/Statement[]}
   * @see rdfjson/rdfjson#objectEquals
   */
  find(s, p, o) {
    let _s = s;
    let _p = p;
    let _o = o;
    // none, s, p, s&p
    if (typeof _s === 'string') {
      _s = ns.expand(_s);
    }
    if (typeof _p === 'string') {
      _p = ns.expand(_p);
    }
    if (typeof _o === 'object' && _o !== null && _o.type === 'uri') {
      _o.value = ns.expand(_o.value);
    } else if (typeof _o === 'string') {
      _o = { type: 'uri', value: ns.expand(_o) };
    }
    if (_o == null) {
      // none, s
      if (_p == null) {
        if (_s == null) {
          return this._find();
        }
        return this._findS(_s);

        // p, s&p
      }
      // p
      if (_s == null) {
        return this._findP(_p);
        // s&p
      }
      return this._findSP(_s, _p);
    }
    // o, s&o
    if (_p == null) {
      if (_s == null) {
        return this._findO(_o);
      }
      return this._findSO(_s, _o);
    }

    // p&o
    if (_s == null) {
      return this._findPO(_p, _o);
    }

    // s&p&o
    const stmt = this._get(_s, _p, rdfjsonUtil.contains(this._graph, _s, _p, _o), true);
    if (stmt == null) {
      return [];
    }
    return [stmt];
  }

  /**
   * Convenience method that returns the value of object of the first matching Statement
   * for the given subject and predicate.
   *
   * @param {String=} s the subject
   * @param {String=} p the predicate
   * @return {String} the value, may be a literal or a URI, if undefined no matching statement
   * (and value) could be found.
   * @see rdfjson/Graph#find
   */
  findFirstValue(s, p) {
    const arr = this.find(s, p);
    if (arr.length > 0) {
      return arr[0].getValue();
    }
    return undefined;
  }

  /**
   * Retrieves a projection, a plain object with simple attribute value pairs given a subject
   * and a mapping.
   * The mapping is an object where the same attributes appear but with the predicates are values.
   * Hence, each attribute gives rise to a search for all statements with the given subject and
   * the predicate specified by the attribute.
   * The result object will contain the mapping attributes with values from the the first
   * matched statements object value if there are any.
   * To access additional information like multiple statement or the statements
   * (type, language, datatype) a "*" prepended version of each attribute can be provided that
   * contains a list of matching Statements if so indicated by the multipleValueStyle parameter.
   *
   * @param {String} s the subject to use for the projection.
   * @param {Object} mapping the mapping configuration
   * @param {String} multipleValueStyle if provided an array is provided for that property
   * prefixed with "*", the array should be indicated to be either
   * "statements", "values" or "objects".
   * @returns {Object}
   * @example
   * var proj = graph.projection("http://example.com", {
   *     "title":       "http://purl.org/dc/terms/title",
   *     "description": "http://purl.org/dc/terms/description"
   * });
   * // The object proj now has the attributes title, *title, description, and *description.
   *
   * // Accessing the title of http://example.com
   * console.log(proj.title);
   *
   * // To get hold of additional information available in the statement,
   * // for instance the language of a literal:
   * console.log(proj["*title"][0].getLanguage())
   *
   */
  projection(s, mapping, multipleValueStyle) {
    const mapped = {};
    Object.keys(mapping).forEach((key) => {
      const prop = mapping[key];
      const values = this.find(s, prop);
      if (values.length > 0) {
        if (key[0] === '*') {
          mapped[key.substr(1)] = values.map(val => val.getValue());
        } else {
          mapped[key] = values[0].getValue();
        }
        switch (multipleValueStyle || 'none') {
          case 'statement':
            mapped[`*${key}`] = values;
            break;
          case 'objects':
            mapped[`*${key}`] = values.map(v => v.getCleanObject());
            break;
          case 'values':
            mapped[`*${key}`] = values.map(v => v.getValue());
            break;
          default:
        }
      }
    });
    return mapped;
  }

  subjects(p, o) {
    return perStatement(this, this.find(null, p, o), true);
  }

  subject(p, o) {
    return perStatement(this, zeroOrOne(this.find(null, p, o)), true);
  }

  objects(s, p) {
    return perStatement(this, this.find(s, p, null));
  }

  object(s, p) {
    return perStatement(this, zeroOrOne(this.find(s, p, null)));
  }


  /**
   * Constructs a rdf:List for the provided array.
   * @param {array} list an array of objects, same as the object parameter to the add method.
   * @returns {String} the blank node id, or rdf:nil if the list is empty
   */
  addList(list) {
    return this._addList(list, 'add');
  }

  /**
   * Constructs a rdf:List for the provided array of literals with the common language.
   * @param {array[string]} an array of literals.
   * @param {string} the language common to all the literals in the array
   * (if this is not what you want you have to use the addList method with objects instead).
   * @returns {String} the blank node id, or rdf:nil if the list is empty
   */
  addListL(list, language) {
    return this._addList(list, 'addL', language);
  }

  /**
   * Constructs a rdf:List for the provided array of literals with the common datatype.
   * @param {array[string]} an array of literals.
   * @param {string} the datatype common to all the literals in the array
   * (if this is not what you want you have to use the addList method with objects instead).
   * @returns {String} the blank node id, or rdf:nil if the list is empty
   */
  addListD(list, datatype) {
    return this._addList(list, 'addD', datatype);
  }

  _addList(list, method, langorDatatype) {
    let listnode;
    if (!Array.isArray(list) || list.length === 0) {
      listnode = ns.expand('rdf:nil');
    } else {
      listnode = this._newBNode();
      let cursor = listnode;
      const nilPosition = list.length - 1;
      list.forEach((member, idx) => {
        this[method](cursor, 'rdf:first', member, langorDatatype);
        if (idx !== nilPosition) {
          cursor = this.add(cursor, 'rdf:rest').getValue();
        } else {
          this.add(cursor, 'rdf:rest', 'rdf:nil');
        }
      });
    }
    return listnode;
  }

  /**
   * Removes all tripples that makes up the list starting from the given resource.
   * @param o - the resource from which the list starts.
   * @return {boolean} true if the list was identifed as a valid list and removed.
   */
  removeList(o) {
    let listFound = false;
    let cursor = typeof o === 'object' ? o.value : o;
    try {
      const nil = ns.expand('rdf:nil');
      listFound = cursor === nil;
      while (cursor !== nil && cursor != null) {
        const next = this.findFirstValue(cursor, 'rdf:rest');
        this.findAndRemove(cursor);
        cursor = next;
        listFound = cursor != null;
      }
    } catch (e) {
      console.warn(`Invalid list for object: ${cursor}`);
      return false;
    }
    return listFound;
  }

  /**
   * Extracts the rdf:List instance.
   * @param {String} o - the first resource node of the (linked) list.
   * @returns {Array} of objects (the same as is returned from Statement.getObject())
   */
  getList(o) {
    let cursor = typeof o === 'object' ? o.value : o;
    const list = [];
    try {
      const nil = ns.expand('rdf:nil');
      while (cursor !== nil && cursor != null) {
        list.push(this.find(cursor, 'rdf:first')[0].getObject());
        cursor = this.findFirstValue(cursor, 'rdf:rest');
      }
    } catch (e) {
      console.warn(`Invalid list for object: ${cursor}`);
    }
    return list;
  }

  /**
   * Extracts the first list to be found given a subject and predicate.
   *
   * @param {String} s - the subject
   * @param {String} p - the predicate
   * @returns {String[]} array of strings, assuming the nodetype, datatype or
   * language is either not present or vital.
   */
  findFirstListAsValues(s, p) {
    return this.getList(this.findFirstValue(s, p)).map(obj => obj.value);
  }

  /**
   * Finds and removes all matched lists including the triples pointing to them.
   * @param {string} s - the subject
   * @param {string} p - the predicate
   * @return {boolean} true if at least one list was removed
   */
  findAndRemoveLists(s, p) {
    let removed = false;
    this.find(s, p).forEach((stmt) => {
      if (this.removeList(stmt.getValue())) {
        this.remove(stmt);
        removed = true;
      }
    });
    return removed;
  }


  /**
   * @return {Object} a plain RDF JSON object without the additional artifacts created by this
   * Graph class.
   * The returned object is suitable for serilization and communicated with other systems.
   */
  exportRDFJSON() {
    const graph = this._graph;
    const ngraph = {};
    Object.keys(graph).forEach((s) => {
      const subj = graph[s];
      ngraph[s] = {};
      Object.keys(subj).forEach((p) => {
        const nObjArr = [];
        ngraph[s][p] = nObjArr;
        subj[p].forEach((o) => {
          const no = { type: o.type, value: o.value };
          if (o.ng != null) {
            no.ng = o.ng;
          }
          if (o.lang != null) {
            no.lang = o.lang;
          }
          if (o.datatype != null) {
            no.datatype = o.datatype;
          }
          nObjArr.push(no);
        });
      });
    });
    return ngraph;
  }

  /**
   * Replaces a URI in subject position with another,
   * assuming the target URI does not exist in the graph already.
   *
   * @param sourceURI
   * @param targetURI
   * @returns {Graph}
   * @deprecated Use replaceURI instead.
   */
  replaceSubject(sourceURI, targetURI) {
    return this.replaceURI(sourceURI, targetURI);
  }

  /**
   * Replaces all occurences of a URI in the graph with another URI.
   * Assumes the target URI does not exist in the graph already.
   *
   * @param sourceURI
   * @param targetURI
   * @returns {Graph}
   */
  replaceURI(sourceURI, targetURI) {
    const graph = this._graph;
    if (graph.hasOwnProperty(sourceURI)) {
      if (!graph.hasOwnProperty((targetURI))) {
        graph[targetURI] = graph[sourceURI];
        delete graph[sourceURI];
      } else {
        throw new Error('Cannot replace subject with target URI since it already exists.');
      }

      this.forEach((s, p, o) => {
        if (o.type === 'uri' && o.value === sourceURI) {
          o.value = targetURI;
        }
        if (s === targetURI && o._statement) {
          o._statement._s = targetURI;
        }
      });
    }

    return this;
  }

  replaceBlankWithURI(sourceBlank, targetURI) {
    const graph = this._graph;
    if (graph.hasOwnProperty(sourceBlank)) {
      if (!graph.hasOwnProperty((targetURI))) {
        graph[targetURI] = graph[sourceBlank];
        delete graph[sourceBlank];
      } else {
        throw new Error('Cannot replace subject with target URI since it already exists.');
      }

      this.forEach((s, p, o) => {
        if (o.type === 'bnode' && o.value === sourceBlank) {
          o.value = targetURI;
          o.type = 'uri';
        }
        if (s === targetURI && o._statement) {
          o._statement._s = targetURI;
        }
      });
    }
    delete this._bnodes[sourceBlank];

    return this;
  }

  /**
   * Clones this graph.
   * @returns {rdfjson/Graph}
   */
  clone() {
    return new Graph(this.exportRDFJSON());
  }

  /**
   * Finds all properties for a given subject.
   * Note: Optimal.
   * @param {String} s the subject to find properties for
   * @return {Array[String]} of strings
   */
  findProperties(s) {
    return Object.keys(this._graph[s] || {});
  }

  /**
   * Validates the graph and returns a report.
   * If errors are detected an exception is thrown.
   * The validation report is a object with a valid attribute which is either false or true.
   * If it is false an array of errors are provided where each error is an object containing
   * a message and information regarding which subject,predicate and object index in the
   * rdjson javascript object that caused the error..
   *
   * @returns {undefined} if there where no errors
   * @throws {Object} the validation report.
   */
  validate() {
    this.report = this._validate();
    if (!this.report.valid) {
      throw (this.report);
    }
    return this.report;
  }

  /**
   * You should not use this function unless you are VERY certain of what you are doing.
   *
   * @private
   * @param {String} bNodeId
   */
  registerBNode(bNodeId) {
    this._bnodes[bNodeId] = true;
  }

  /**
   * Iterates through all statements of the graph and calls the provided function on them.
   *
   * @param {Function} f are called for each statement with the three arguments
   *  (in order) subject, predicate, and object.
   */
  forEach(f) {
    const graph = this._graph;
    Object.keys(graph).forEach((s) => {
      const subj = graph[s];
      Object.keys(subj).forEach((p) => {
        subj[p].forEach((o) => {
          f(s, p, o);
        });
      });
    });
  }

  /**
   * Iterates through all statements of the graph and calls the provided function on them and
   * returns an array of the results.
   *
   * @param {Function} f are called for each statement with the three arguments
   *  (in order) subject, predicate, and object, f should return a value that is added to the
   *  array
   * @return {array} an array with the value of the function applied for each statement.
   */
  map(f) {
    const arr = [];
    this.forEach((stmt) => {
      arr.push(f(stmt));
    });
    return arr;
  }

  /**
   * Compares this graph with another, true if they are isomorphic.
   * Comparision is done using the fingerprint mechanism. Hence, this method is not fullproof.
   *
   * @param {rdfjson/Graph} graph to compare to
   * @param {array} excludeProperties an array of properties to exclude in comparision check
   * @return {boolean} true if the graphs are isomorphic disregarding the excluded properties.
   * @see {rdfjson/utils#fingerprint}
   */
  equals(graph, excludeProperties) {
    return utils.fingerprint(this, excludeProperties) === utils.fingerprint(graph, excludeProperties);
  }

  /**
   * Calculates the amounts of triples in the graph.
   * @returns {number}
   */
  size() {
    let size = 0;
    Object.values(this._graph).forEach((subjObj) => {
      Object.values(subjObj).forEach((objects) => {
        size += objects.length;
      });
    });
    return size;
  }

  // ===================================================
  // Private methods
  // ===================================================

  /**
   * If the object already contains a statement that is returned, otherwise a new is created.
   * If the object is not specified undefined is returned.
   * @return {Statement|undefined} a statement that belongs to this graph.
   * @private
   */
  _get(s, p, o, asserted) {
    if (o == null) {
      return undefined;
    }

    return this._getOrCreate(s, p, o, asserted);
  }

  /**
   * If the object already contains a statement that is returned, otherwise a new is created.
   * @return {rdfjson/Statement} a statement that belongs to this graph.
   * @private
   */
  _getOrCreate(s, p, o, asserted) {
    if (o._statement == null) {
      o._statement = new Statement(this, s, p, o, asserted);
    }
    return o._statement;
  }

  /**
   * @return {Object} if the object originates from another graph a copy is made.
   * @private
   */
  _graphObject(o) {
    if (o._statement == null ||
      o._statement._graph === this) {
      return o;
    }
    return { type: o.type, value: o.value, lang: o.lang, datatype: o.datatype };
  }

  /**
   * Finds all statements with a given subject and object.
   * @param {String} s
   * @param {String} p
   * @returns {rdfjson/Statement[]}
   * @private
   */
  _findSP(s, p) {
    if (this._graph[s] == null || this._graph[s][p] == null) {
      return [];
    }
    return this._graph[s][p].map(o => this._get(s, p, o, true));
  }

  /**
   * Finds all statements with a given subject.
   * Note: Optimal.
   * @param {String} s
   * @returns {rdfjson/Statement[]}
   * @private
   */
  _findS(s) {
    const subj = this._graph[s];
    const spArrs = Object.keys(subj || {}).map(p => this._findSP(s, p));
    return Array.prototype.concat.apply([], spArrs);
  }

  /**
   * Generates statements for the entire graph.
   * Note: Optimal.
   * @returns {rdfjson/Statement[]}
   * @private
   */
  _find() {
    const arr = [];
    this.forEach((s1, p1, o1) => {
      arr.push(this._get(s1, p1, o1, true));
    });
    return arr;
  }

  /**
   * Finds all statements with a given predicate.
   * Note: Close to optimal without further indexing, to many checks due to iteration via _map.
   * @param {String} p
   * @returns {rdfjson/Statement[]}
   * @private
   */
  _findP(p) {
    const arr = [];
    this.forEach((s1, p1, o1) => {
      if (p === p1) {
        arr.push(this._get(s1, p1, o1, true));
      }
    });
    return arr;
  }

  /**
   * Iterates through all statements to find those with specified object.
   * Note: Optimal without additional indexing.
   * @param {Object} o
   * @returns {rdfjson/Statement[]}
   * @private
   */
  _findO(o) {
    const arr = [];
    this.forEach((s1, p1, o1) => {
      if (rdfjsonUtil.objectEquals(o, o1)) {
        arr.push(this._get(s1, p1, o1, true));
      }
    });
    return arr;
  }

  /**
   * Finds all statements with a given subject and object.
   * Note: Close to optimal without further indexing, to many checks due to iteration via _map.
   * @returns {rdfjson/Statement[]}
   * @private
   */
  _findSO(s, o) {
    const arr = [];
    this.forEach((s1, p1, o1) => {
      if (s === s1 && rdfjsonUtil.objectEquals(o, o1)) {
        arr.push(this._get(s1, p1, o1, true));
      }
    });
    return arr;
  }

  /**
   * Finds all statements with a given predicate and object.
   * Note: Close to optimal without further indexing, to many checks due to iteration via _map.
   * @returns {rdfjson/Statement[]}
   * @private
   */
  _findPO(p, o) {
    const arr = [];
    this.forEach((s1, p1, o1) => {
      if (p === p1 && rdfjsonUtil.objectEquals(o, o1)) {
        arr.push(this._get(s1, p1, o1, true));
      }
    });
    return arr;
  }

  /**
   * @private
   */
  _validate() {
    const graph = this._graph;
    const report = { valid: true, errors: [], nr: 0 };
    Object.keys(graph).forEach((s) => {
      const subj = graph[s];
      if (rdfjsonUtil.isObject(subj)) {
        Object.keys(subj).forEach((p) => {
          const objArr = subj[p];
          if (Array.isArray(objArr)) {
            objArr.forEach((o, oindex) => {
              if (rdfjsonUtil.isObject(o)) {
                if (o.type != null) {
                  if (rdfjsonUtil.isString(o.value)) {
                    report.nr += 1;
                  } else {
                    report.errors.push({
                      s,
                      p,
                      oindex: (oindex + 1),
                      message: `Object ${oindex + 1} in object array must have the 'value' attribute pointing to a string.`
                    });
                    report.valid = false;
                  }
                } else {
                  report.errors.push({
                    s,
                    p,
                    oindex: (oindex + 1),
                    message: `Object ${oindex + 1} in object array lacks the attribute type, must be either 'literal', 'resource' or 'bnode'.`
                  });
                  report.valid = false;
                }
              } else {
                report.errors.push({
                  s,
                  p,
                  oindex: (oindex + 1),
                  message: `Element ${oindex + 1} in object array is not an object.`
                });
                report.valid = false;
              }
            });
          } else {
            report.errors.push({ s, p, message: 'Predicate must point to an array of objects.' });
            report.valid = false;
          }
        });
      } else {
        report.errors.push({ s, message: 'Subject must point to an object.' });
        report.valid = false;
      }
    });
    return report;
  }

  /**
   * Creates a new bnode that is unique in the current graph.
   * Bnodes in temporarily unasserted statements (currently removed from the graph)
   * are avoided as well.
   * @returns {String}
   * @private
   */
  _newBNode() {
    this._indexBNodes();
    let p;
    let n;
    let bnode;
    for (p = 1; p < 20; p++) {
      for (n = 1; n <= p; n++) {
        bnode = `_:${Math.floor(Math.random() * (Math.pow(10, p) + 1))}`;
        if (this._bnodes[bnode] !== true) {
          this._bnodes[bnode] = true;
          return bnode;
        }
      }
    }
    throw new Error('Failed creating a new blank node, increadible unprobable...');
  }

  /**
   * Adds the bnodes in the graph to the bnode index.
   * The index can be calculated late, just before the first call to create.
   * (Bnodes in statements that are removed are added in advance to the index as
   * they may be only temporarily unasserted and when they are asserted again
   * they should not overlap with newly created bnodes.)
   * After the index is created all statemnts added update the index.
   * @private
   */
  _indexBNodes() {
    if (this._bnodesIndexed) {
      return;
    }
    const graph = this._graph;
    Object.keys(graph).forEach((s) => {
      if (s.indexOf('_:') === 0) {
        this._bnodes[s] = true;
      }
      const subj = graph[s];
      Object.keys(subj).forEach((p) => {
        if (p.indexOf('_:') === 0) {
          this._bnodes[p] = true;
        }
        subj[p].forEach((o) => {
          if (o.type === 'bnode') {
            this._bnodes[o.value] = true;
          }
        });
      });
    });
    this._bnodesIndexed = true;
  }

  /**
   * Adds any bnodes in the given parameters to the index (the index may still be incomplete).
   * @param {String} s the subject in a statement.
   * @param {String} p the predicate in a statement.
   * @param {Object} o the object in a statement.
   * @private
   */
  _trackBNodes(s, p, o) {
    if (s.indexOf('_:') === 0) {
      this._bnodes[s] = true;
    }
    if (p.indexOf('_:') === 0) {
      this._bnodes[p] = true;
    }
    if (o.type === 'bnode') {
      this._bnodes[o.value] = true;
    }
  }
};
