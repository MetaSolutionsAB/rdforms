/*global define*/
define(["./Graph"], function(Graph) {
    
    var _ns = {
	rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	rdfs: "http://www.w3.org/2000/01/rdf-schema#",
	owl: "http://www.w3.org/2002/07/owl#"
    };
    var _terms = {
	rdftype: _ns.rdf+"type",
	rdfssco: _ns.rdfs+"subClassOf",
	rdfsdomain: _ns.rdfs+"domain",
	rdfsrange: _ns.rdfs+"range",
	rdfsspo: _ns.rdfs+"subPropertyOf",
	rdfsClass: _ns.rdfs+"Class",
	owlClass: _ns.owl+"Class",
	rdfProperty: _ns.rdf+"Property"
    };

    var extractLiterals = function(graph, subj, prop) {
	var hash = {};
	var foundSomething = false;
	var stmts = graph.find(subj, prop);
	for (var i=0;i<stmts.length;i++) {
	    var stmt = stmts[i];
	    if (stmt.getType() === "literal") {
		hash[stmt.getLanguage() || ""] = stmt.getValue() || "";
		foundSomething = true;
	    }
	}
	if (foundSomething) {
	    if (hash.en == null && hash[""] != null) {
		hash.en = hash[""];
		delete hash[""];
	    }
	    return hash;
	}
    };
    
    var toSet = function(arr) {
	var narr = [];
	var idx = {}
	for (var i=0;i<arr.length;i++) {
	    var m = arr[i];
	    if (!idx[m]) {
		narr.push(m);
		idx[m] = true;
	    }
	}
	return narr;
    }
    
    var Cls = function(uri, graph) {
	this._uri = uri;
	this._parents = [];
	this._children = [];
	this._graph = graph;
    };
    Cls.prototype.getURI = function() {
	return this._uri;
    };
    Cls.prototype.getLabel = function() {
	var labels = this.getLabels();
	if (labels.en != null) {
	    return labels.en;
	}
	for (lang in labels) {
	    if (labels.hasOwnProperty(lang)) {
		return labels[lang];
	    }
	}
	return "";
    };
    Cls.prototype.getLabels = function() {
	if (this._labels == null) {
	    //Checking for only rdfs:label
	    this._labels = extractLiterals(this._graph, this._uri, _ns.rdfs+"label");
	    if (this._labels == null) {
		this._labels = {"en": this._uri.substr(this._uri.lastIndexOf("/")+1)};
	    }
	}
	return this._labels;
    };
    Cls.prototype.getComment = function() {
	var comments = this.getComments();
	if (comments != null) {
	    if (comments.en != null) {
		return comments.en;
	    }
	    for (lang in labels) {
		if (labels.hasOwnProperty(lang)) {
		    return labels[lang];
		}
	    }
	}
	return "";
    };
    Cls.prototype.getComments = function() {
	if (this._comments == null) {
	    //Checking for only rdfs:comment
	    this._comments = extractLiterals(this._graph, this._uri, _ns.rdfs+"comment");
	}
	return this._comments;
    };
    
    Cls.prototype.addParent = function(cls) {
	this._parents.push(cls);
	cls._children.push(this);
    };
    Cls.prototype.getParents = function() {
	//Avoid infinite recursion if loops.
	if (this._parentLock) {
	    return [];
	}
	this._parentLock = true;
	if (this._allParents == null) {
	    this._allParents = [];
	    for (var i=0;i<this._parents.length;i++) {
		this._allParents = this._allParents.concat(this._parents[i].getParents());
		this._allParents.push(this._parents[i]);
	    }
	}
	delete this._parentLock;
	return this._allParents;
    };

    Cls.prototype.getChildren = function() {
	//Avoid infinite recursion if loops.
	if (this._childLock) {
	    return [];
	}
	this._childLock = true;
	if (this._allChildren == null) {
	    this._allChildren = [];
	    for (var i=0;i<this._children.length;i++) {
		this._allChildren = this._allChildren.concat(this._children[i].getChildren());
		this._allChildren.push(this._children[i]);
	    }
	}
	delete this._childLock;
	return this._allChildren;
    };

    Cls.prototype.setRange = function(r) {
	if (this._range == null) {
	    this._range = [];
	}
	this._range.push(r);
    };
    
    Cls.prototype.setDomain = function(cls) {
	if (this._domain == null) {
	    this._domain = [];
	}
	this._domain.push(cls);
	cls.setDomainOf(this);
    }	
    
    Cls.prototype.getRange = function() {
	if (this._allRange == null) {
	    this._allRange = this._range || [];
	    for (var i=0;i<this._parents.length;i++) {
		this._allRange = this._allRange.concat(this._parents[i].getRange());
	    }
	    this._allRange = toSet(this._allRange);
	}
	return this._allRange;
    };
    
    Cls.prototype.getDomain = function() {
	if (this._allDomain == null) {
	    this._allDomain = this._domain || [];
	    for (var i=0;i<this._parents.length;i++) {
		this._allDomain = this._allDomain.concat(this._parents[i].getDomain());
	    }
	    this._allDomain = toSet(this._allDomain);
	}
	return this._allDomain;
    };

    Cls.prototype.setDomainOf = function(prop) {
	if (this._domainOf == null) {
	    this._domainOf = [];
	}
	this._domainOf.push(prop);
    };	

    Cls.prototype.getDomainOf = function() {
	return this._domainOf;
    };

    Cls.prototype.getAllDomainOf = function() {
	//Avoid infinite recursion if loops.
	if (this._domainOfLock) {
	    return [];
	}
	this._domainOfLock = true;
	if (this._allDomainOf == null) {
	    var childDomainOf = this._domainOf || [];
	    this._allDomainOf = this._domainOf || [];
	    for (var j=0;j<childDomainOf.length;j++) {
		this._allDomainOf = this._allDomainOf.concat(childDomainOf[j].getChildren());
	    }
	    for (var i=0;i<this._parents.length;i++) {
		this._allDomainOf = this._allDomainOf.concat(this._parents[i].getAllDomainOf());
	    }
	}
	delete this._domainOfLock;
	return this._allDomainOf;
    }
        
    
    var indexf = function(idx, arr, stmts, parentObject) {
	for (var i=0;i<stmts.length;i++) {
	    var stmt = stmts[i];
	    var suri = stmt.getSubject();
	    var s = idx[suri];
	    if (!s) {
		s = new Cls(suri, stmt.getGraph());
		idx[suri] = s;
		arr.push(s);
	    }
	    if (parentObject) {
		var ouri = stmt.getValue(); //Assume a resource as object.
		var o = idx[ouri];
		if (!o) {
		    o = new Cls(ouri, stmt.getGraph());
		    idx[ouri] = o;
		    arr.push(o);
		}
		s.addParent(o);
	    }
	}
    };
    var rangeDomain = function(graph, pIdx, cIdx) {
	var subj, obj, stmt,
	stmts = graph.find(null, _terms.rdfsdomain, null);
	for (var d=0;d<stmts.length;d++) {
	    stmt = stmts[d];
	    subj = pIdx[stmt.getSubject()];
	    obj = cIdx[stmt.getValue()];
	    if (subj != null && obj != null) {
		subj.setDomain(obj);
	    }
	}
	stmts = graph.find(null, _terms.rdfsrange, null);
	for (var r=0;r<stmts.length;r++) {
	    stmt = stmts[r];
	    subj = pIdx[stmt.getSubject()];
	    obj = stmt.getValue();
	    if (subj != null && obj != null) {
		subj.setRange(obj);
	    }
	}
    };

    var Rdfs = function() {
	this._cidx = {};
	this._carr = [];
	this._pidx = {};
	this._parr = [];
    };
    
    Rdfs.prototype.ns = _ns;
    Rdfs.prototype.terms = _terms;
    Rdfs.prototype.addGraph = function(graph) {
	indexf(this._cidx, this._carr, graph.find(null, _terms.rdftype, _terms.rdfsClass));
	indexf(this._cidx, this._carr, graph.find(null, _terms.rdftype, _terms.owlClass));
	indexf(this._cidx, this._carr, graph.find(null, _terms.rdfssco, null), true);
	indexf(this._pidx, this._parr, graph.find(null, _terms.rdftype, _terms.rdfProperty));
	indexf(this._pidx, this._parr, graph.find(null, _terms.rdfsspo, null), true);
	rangeDomain(graph, this._pidx,this._cidx);
    };
    Rdfs.prototype.getClasses = function() {
	return this._carr;
    };
    Rdfs.prototype.getProperties = function() {
	return this._parr;
    };
    Rdfs.prototype.isClass = function(uri) {
	return this._cidx[uri] != null;
    };
    Rdfs.prototype.isProperty = function(uri) {
	return this._pidx[uri] != null;
    };
    Rdfs.prototype.getClass = function(uri) {
	return this._cidx[uri];
    };
    Rdfs.prototype.getProperty = function(uri) {
	return this._pidx[uri];
    };
    Rdfs.prototype.getInstances = function(cls) {
	var instances = [];
	var clss = [cls].concat(cls.getChildren());
	for (var ci=0;ci<clss.length;ci++) {
	    var c = clss[ci];
	    var stmts = c.getGraph.find(null, _terms.rdftype, c.getURI());
	    for (var s = 0;s<stmts.length;s++) {
		instances.push(stmts[s].getSubject());
	    }
	}
	return instances;
    };
    
    Rdfs.global = new Rdfs();
    return Rdfs;
});