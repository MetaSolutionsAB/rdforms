import Graph from './Graph';

const _ns = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
};
const _terms = {
  rdftype: `${_ns.rdf}type`,
  rdfssco: `${_ns.rdfs}subClassOf`,
  rdfsdomain: `${_ns.rdfs}domain`,
  rdfsrange: `${_ns.rdfs}range`,
  rdfsspo: `${_ns.rdfs}subPropertyOf`,
  rdfsClass: `${_ns.rdfs}Class`,
  owlClass: `${_ns.owl}Class`,
  owlObjectProperty: `${_ns.owl}ObjectProperty`,
  owlDatatypeProperty: `${_ns.owl}DatatypeProperty`,
  rdfProperty: `${_ns.rdf}Property`,
};

// noinspection FunctionWithInconsistentReturnsJS
/**
 *
 * @param graph
 * @param subj
 * @param prop
 * @returns {Object|undefined}
 */
const extractLiterals = (graph, subj, prop) => {
  const hash = {};
  let foundSomething = false;
  const stmts = graph.find(subj, prop);
  for (let i = 0; i < stmts.length; i++) {
    const stmt = stmts[i];
    if (stmt.getType() === 'literal') {
      hash[stmt.getLanguage() || ''] = stmt.getValue() || '';
      foundSomething = true;
    }
  }
  if (foundSomething) {
    if (hash.en == null && hash[''] != null) {
      hash.en = hash[''];
      delete hash[''];
    }
    return hash;
  }
  return undefined;
};

const toSet = (arr) => {
  const narr = [];
  const idx = {};
  for (let i = 0; i < arr.length; i++) {
    const m = arr[i];
    if (!idx[m]) {
      narr.push(m);
      idx[m] = true;
    }
  }
  return narr;
};

const Cls = class {
  constructor(uri, graph) {
    this._uri = uri;
    this._parents = [];
    this._children = [];
    this._graph = graph;
  }

  getURI() {
    return this._uri;
  }

  getLabel() {
    const labels = this.getLabels();
    if (labels.en != null) {
      return labels.en;
    }

    const lbls = Object.objects(labels);
    return lbls.length > 0 ? lbls[0] : '';
  }

  getLabels() {
    if (this._labels == null) {
      // Checking for only rdfs:label
      this._labels = extractLiterals(this._graph, this._uri, `${_ns.rdfs}label`);
      if (this._labels == null) {
        this._labels = { en: this._uri.substr(this._uri.lastIndexOf('/') + 1) };
      }
    }
    return this._labels;
  }

  getComment() {
    const comments = this.getComments();
    if (comments != null) {
      if (comments.en != null) {
        return comments.en;
      }
      return Object.objects(comments)[0];
    }
    return '';
  }

  getComments() {
    if (this._comments == null) {
      // Checking for only rdfs:comment
      this._comments = extractLiterals(this._graph, this._uri, `${_ns.rdfs}comment`);
    }
    return this._comments;
  }

  addParent(cls) {
    this._parents.push(cls);
    cls._children.push(this);
  }

  getDirectParents() {
    return this._parents;
  }

  getParents() {
    // Avoid infinite recursion if loops.
    if (this._parentLock) {
      return [];
    }
    this._parentLock = true;
    if (this._allParents == null) {
      this._allParents = [];
      for (let i = 0; i < this._parents.length; i++) {
        this._allParents = this._allParents.concat(this._parents[i].getParents());
        this._allParents.push(this._parents[i]);
      }
    }
    delete this._parentLock;
    return this._allParents;
  }

  getChildren() {
    // Avoid infinite recursion if loops.
    if (this._childLock) {
      return [];
    }
    this._childLock = true;
    if (this._allChildren == null) {
      this._allChildren = [];
      for (let i = 0; i < this._children.length; i++) {
        this._allChildren = this._allChildren.concat(this._children[i].getChildren());
        this._allChildren.push(this._children[i]);
      }
    }
    delete this._childLock;
    return this._allChildren;
  }

  setRange(r) {
    if (this._range == null) {
      this._range = [];
    }
    this._range.push(r);
  }

  setDomain(cls) {
    if (this._domain == null) {
      this._domain = [];
    }
    this._domain.push(cls);
    cls.setDomainOf(this);
  }

  getRange() {
    if (this._allRange == null) {
      this._allRange = this._range || [];
      for (let i = 0; i < this._parents.length; i++) {
        this._allRange = this._allRange.concat(this._parents[i].getRange());
      }
      this._allRange = toSet(this._allRange);
    }
    return this._allRange;
  }

  getDomain() {
    if (this._allDomain == null) {
      this._allDomain = this._domain || [];
      for (let i = 0; i < this._parents.length; i++) {
        this._allDomain = this._allDomain.concat(this._parents[i].getDomain());
      }
      this._allDomain = toSet(this._allDomain);
    }
    return this._allDomain;
  }

  setDomainOf(prop) {
    if (this._domainOf == null) {
      this._domainOf = [];
    }
    this._domainOf.push(prop);
  }

  getDomainOf() {
    return this._domainOf;
  }

  getAllDomainOf() {
    // Avoid infinite recursion if loops.
    if (this._domainOfLock) {
      return [];
    }
    this._domainOfLock = true;
    if (this._allDomainOf == null) {
      const childDomainOf = this._domainOf || [];
      this._allDomainOf = this._domainOf || [];
      for (let j = 0; j < childDomainOf.length; j++) {
        this._allDomainOf = this._allDomainOf.concat(childDomainOf[j].getChildren());
      }
      for (let i = 0; i < this._parents.length; i++) {
        this._allDomainOf = this._allDomainOf.concat(this._parents[i].getAllDomainOf());
      }
    }
    delete this._domainOfLock;
    return this._allDomainOf;
  }
};

const indexf = function (idx, arr, stmts, parentObject) {
  for (let i = 0; i < stmts.length; i++) {
    const stmt = stmts[i];
    const suri = stmt.getSubject();
    let s = idx[suri];
    if (!s) {
      s = new Cls(suri, stmt.getGraph());
      idx[suri] = s;
      arr.push(s);
    }
    if (parentObject) {
      const ouri = stmt.getValue(); // Assume a resource as object.
      let o = idx[ouri];
      if (!o) {
        o = new Cls(ouri, stmt.getGraph());
        idx[ouri] = o;
        arr.push(o);
      }
      s.addParent(o);
    }
  }
};
const rangeDomain = function (graph, pIdx, cIdx) {
  let subj;
  let obj;
  let stmt;
  let stmts = graph.find(null, _terms.rdfsdomain, null);
  for (let d = 0; d < stmts.length; d++) {
    stmt = stmts[d];
    subj = pIdx[stmt.getSubject()];
    obj = cIdx[stmt.getValue()];
    if (subj != null && obj != null) {
      subj.setDomain(obj);
    }
  }
  stmts = graph.find(null, _terms.rdfsrange, null);
  for (let r = 0; r < stmts.length; r++) {
    stmt = stmts[r];
    subj = pIdx[stmt.getSubject()];
    obj = stmt.getValue();
    if (subj != null && obj != null) {
      subj.setRange(obj);
    }
  }
};

const Rdfs = class {
  constructor() {
    this._cidx = {};
    this._carr = [];
    this._pidx = {};
    this._parr = [];
  }

  addGraph(graph) {
    indexf(this._cidx, this._carr, graph.find(null, _terms.rdftype, _terms.rdfsClass));
    indexf(this._cidx, this._carr, graph.find(null, _terms.rdftype, _terms.owlClass));
    indexf(this._cidx, this._carr, graph.find(null, _terms.rdfssco, null), true);
    indexf(this._pidx, this._parr, graph.find(null, _terms.rdftype, _terms.rdfProperty));
    indexf(this._pidx, this._parr, graph.find(null, _terms.rdfsspo, null), true);
    indexf(this._pidx, this._parr, graph.find(null, _terms.rdftype, _terms.owlDatatypeProperty));
    indexf(this._pidx, this._parr, graph.find(null, _terms.rdftype, _terms.owlObjectProperty));
    rangeDomain(graph, this._pidx, this._cidx);
  }

  addThing() {
    const turi = 'http://www.w3.org/2002/07/owl#Thing';
    let thing = this._cidx[turi];
    let thingIsNew = false;
    if (!thing) {
      thing = new Cls(turi, new Graph());
      this._cidx[turi] = thing;
      this._carr.push(thing);
      thingIsNew = true;
    }

    for (let c = 0; c < this._carr.length; c++) {
      const cls = this._carr[c];
      if (thingIsNew && cls !== thing) {
        cls.addParent(thing);
      } else if (cls.getParents().indexOf(thing) === -1 && cls !== thing) {
        cls.addParent(thing);
      }
    }
  }

  getClasses() {
    return this._carr;
  }

  getProperties() {
    return this._parr;
  }

  isClass(uri) {
    return this._cidx[uri] != null;
  }

  isProperty(uri) {
    return this._pidx[uri] != null;
  }

  getClass(uri) {
    return this._cidx[uri];
  }

  getProperty(uri) {
    return this._pidx[uri];
  }

  static getInstances(cls) {
    const instances = [];
    const clss = [cls].concat(cls.getChildren());
    for (let ci = 0; ci < clss.length; ci++) {
      const c = clss[ci];
      const stmts = c.getGraph.find(null, _terms.rdftype, c.getURI());
      for (let s = 0; s < stmts.length; s++) {
        instances.push(stmts[s].getSubject());
      }
    }
    return instances;
  }
};

Rdfs.prototype.ns = _ns;
Rdfs.prototype.terms = _terms;
Rdfs.global = new Rdfs();
export default Rdfs;
