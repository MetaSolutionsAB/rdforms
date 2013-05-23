define(["./uri"], function(URI) {

	// These are the classes corresponding to the RDF and N3 data models
	//
	// Designed to look like rdflib and cwm designs.
	//
	// Issues: Should the names start with RDF to make them
	//      unique as program-wide symbols?
	//
	// W3C open source licence 2005.
	//

	var RDFTracking = 0;
    // Are we requiring reasons for statements?

	//takes in an object and makes it an object if it's a literal
	var makeTerm = function(val) {
	    //  fyi("Making term from " + val)
	    if (typeof val == 'object') return val;
	    if (typeof val == 'string') return new RDFLiteral(val);
	    if (typeof val == 'undefined') return undefined;
	    alert("Can't make term from " + val + " of type " + typeof val); // @@ add numbers
	};



	//	Symbol

	var RDFEmpty = function () {
        return this;
    };

	RDFEmpty.prototype.termType = 'empty';

	RDFEmpty.prototype.toString = function () {
        return ""
    };

	RDFEmpty.prototype.toNT = function () {
        return ""
    };


    /**
     * @return {string}
     */
    var RDFSymbol_toNT = function (x) {
        return ("<" + x.uri + ">");
    };


	var toNT = function () {
        return RDFSymbol_toNT(this);
    };


	var RDFSymbol = function(uri) {
    	this.uri = uri;
	    return this;
	};
	
	RDFSymbol.prototype.termType = 'symbol';

	RDFSymbol.prototype.toString = toNT;

	RDFSymbol.prototype.toNT = toNT;


	//	Blank Node

	var RDFNextId = 0;  // Gobal genid
	var NTAnonymousNodePrefix = "_:n";

	var RDFBlankNode = function() {
    	this.id = RDFNextId++;
	    return this;
	};

	RDFBlankNode.prototype.termType = 'bnode';

	RDFBlankNode.prototype.toNT = function() {
    	return NTAnonymousNodePrefix + this.id;
	};
	RDFBlankNode.prototype.toString = RDFBlankNode.prototype.toNT;  

	//	Literal

	var RDFLiteral = function(value, /*String=*/ lang, /*String=*/datatype) {
    	this.value = value;
    	this.lang=lang;	  // string
    	this.datatype=datatype;  // term
	    return this;
	};

	RDFLiteral.prototype.termType = 'literal';

    RDFLiteral.prototype.toNT = function() {
    	var str = this.value;
	    if (typeof str != 'string') {
			throw Error("Value of RDF literal is not string: "+str);
	    }
    	str = str.replace(/\\/g, '\\\\');  // escape
	    str = str.replace(/"/g, '\\"');
    	str = '"' + str + '"';

	    if (this.datatype){
    		//alert(this.datatype.termType+"   "+typeof this.datatype)
			str = str + '^^' + this.datatype;//.toNT()
    	}
    	if (this.lang) {
			str = str + "@" + this.lang;
    	}
    	return str;
	};

    RDFLiteral.prototype.toString = function () {
        return this.value;
    };

	var RDFCollection = function() {
    	this.id = RDFNextId++;
    	this.elements = [];
	    this.closed = false;
	};

	RDFCollection.prototype.termType = 'collection';

	RDFCollection.prototype.toNT = function() {
    	return NTAnonymousNodePrefix + this.id;
	};
	RDFCollection.prototype.toString = RDFCollection.prototype.toNT;

	RDFCollection.prototype.append = function (el) {
    	this.elements.push(el);
	};

	RDFCollection.prototype.close = function () {
    	this.closed = true;
	};

	//	Statement
	//
	//  This is a triple with an optional reason.
	//
	//   The reason can point to provenece or inference
	//
    /**
     * @return {string}
     */
    var RDFStatement_toNT = function() {
    	return (this.subject.toNT() + " "
	    	+ this.predicate.toNT() + " "
	    	+  this.object.toNT() +" .");
	};

	var RDFStatement = function(subject, predicate, object, why) {
    	this.subject = makeTerm(subject);
    	this.predicate = makeTerm(predicate);
    	this.object = makeTerm(object);
	    if (typeof why !='undefined') {
			this.why = why;
    	} else if (RDFTracking) {
			console.log("WARNING: No reason on "+subject+" "+predicate+" "+object);
	    }
    	return this;
	};

	RDFStatement.prototype.toNT = RDFStatement_toNT;
	RDFStatement.prototype.toString = RDFStatement_toNT;
	

	//	Formula
	//
	//	Set of statements.

	var RDFFormula = function() {
    	this.statements = [];
    	this.constraints = [];
    	this.initBindings = [];
    	this.optional = [];
    	return this;
	};

	/*function RDFQueryFormula() {
		this.statements = []
		this.constraints = []
		this.initBindings = []
		this.optional = []
		return this
	}*/

    /**
     * @return {string}
     */
    var RDFFormula_toNT = function() {
	    return "{\n" + this.statements.join('\n') + "}";
	};

	//RDFQueryFormula.prototype = new RDFFormula()
	//RDFQueryFormula.termType = 'queryFormula'
	RDFFormula.prototype.termType = 'formula';
	RDFFormula.prototype.toNT = RDFFormula_toNT;
	RDFFormula.prototype.toString = RDFFormula_toNT;   

	RDFFormula.prototype.add = function(subj, pred, obj, why) {
	    this.statements.push(new RDFStatement(subj, pred, obj, why));
	};

	// Convenience methods on a formula allow the creation of new RDF terms:

	RDFFormula.prototype.sym = function(uri,name) {
    	if (name != null) {
			uri = this.namespaces[uri] + name;
	    }
    	return new RDFSymbol(uri);
	};

	RDFFormula.prototype.literal = function(val, lang, dt) {
	    return new RDFLiteral(val.toString(), lang, dt);
	};

	RDFFormula.prototype.bnode = function() {
    	return new RDFBlankNode();
	};

	RDFFormula.prototype.formula = function () {
        return new RDFFormula();
    };

	RDFFormula.prototype.collection = function () {
    	return new RDFCollection();
	};


	/*RDFFormula.prototype.queryFormula = function() {
		return new RDFQueryFormula()
	}*/

	var RDFVariableBase = "varid:"; // We deem variabe x to be the symbol varid:x 

	//An RDFVariable is a type of s/p/o that's not literal. All it holds is it's URI.
	//It has type 'variable', and a function toNT that turns it into NTriple form
	var RDFVariable = function(rel) {
    	this.uri = URI.join(rel, RDFVariableBase);
    	return this;
	};

	RDFVariable.prototype.termType = 'variable';
	RDFVariable.prototype.toNT = function() {
    	if (this.uri.slice(0, RDFVariableBase.length) == RDFVariableBase) {
			return '?'+ this.uri.slice(RDFVariableBase.length);
		} // @@ poor man's refTo
		return '?' + this.uri;
	};

	RDFVariable.prototype.toString = RDFVariable.prototype.toNT;
	RDFVariable.prototype.classOrder = 7;

	RDFFormula.prototype.variable = function(name) {
    	return new RDFVariable(name);
	};

	RDFVariable.prototype.hashString = RDFVariable.prototype.toNT;

	// Parse a single token
	//
	// The bnode bit should not be used on program-external values; designed
	// for internal work such as storing a bnode id in an HTML attribute.
	// Not coded for literals.

	RDFFormula.prototype.fromNT = function(str) {
	    var len = str.length;
    	var ch = str.slice(0, 1);
    	if (ch == '<') return this.sym(str.slice(1,len-1));
    	if (ch == '_') {
			var x = new RDFBlankNode();
			x.id = parseInt(str.slice(3));
			RDFNextId--;
			return x
    	}
	    alert("Can't yet convert from NT: '"+str+"', "+str[0]);
	};
	
	return {RDFSymbol: RDFSymbol,
			RDFFormula: RDFFormula,
			RDFBlankNode: RDFBlankNode,
			RDFLiteral: RDFLiteral}
});