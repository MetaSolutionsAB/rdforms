dojo.provide("rdfjson.ajar.parser");
dojo.require("rdfjson.Graph");
dojo.require("rdfjson.ajar.uri");
dojo.require("rdfjson.ajar.term");
dojo.require("rdfjson.ajar.rdfparser");


rdfjson.ajar.String2XML = function(text){
    if (window.ActiveXObject){
      var doc=new ActiveXObject('Microsoft.XMLDOM');
      doc.async='false';
      doc.loadXML(text);
    } else {
      var parser=new DOMParser();
      var doc=parser.parseFromString(text,'text/xml');
    }
    return doc;
};

rdfjson.ajar.XML2String = function(xml) {
	  if (window.ActiveXObject) {
	    return xml.xml;
	  } else {
	    return (new XMLSerializer()).serializeToString(xml);
	  }
	}

/**
 * Imports RDF/XML into a rdfjson.Graph
 *  
 * @param xmldocument this is the XML document or XML string from where the RDF will be parsed.
 * @param {rdfjson.Graph} graph where all tripples will be added, if null a new graph will be created.
 * @returns {rdfjson.Graph} where all found tripples have been added.
 */
rdfjson.ajar.importRDFXML = function(xml, graph) {
	if (dojo.isString(xml)) {
		xml = rdfjson.converters.String2XML(xml);
	}
	
	var graph = graph || new rdfjson.Graph({});
	var store = new RDFFormula();
	store.add = function(s, p, o) {
		var subj, pred, obj = {};
		//Subject
		if (s instanceof RDFBlankNode) {
			subj = s.toString()
			graph.registerBNode(subj);
		} else {
			subj = s.uri;
		}
		
		//Predicate
		if (p instanceof RDFBlankNode) {
			pred = p.toString()
			graph.registerBNode(pred);
		} else {
			pred = p.uri;
		}
		
		//Object
		if (o instanceof RDFLiteral) {
			obj.type = "literal";
			obj.value = o.value;
			if (o.lang) {
				obj.lang = o.lang;
			}
			if (o.datatype) {
				obj.datatype = o.datatype;
			}
		} else if (o instanceof RDFSymbol) {
			obj.type = "uri";
			obj.value = o.uri;
		} else if (o instanceof RDFBlankNode) {
			obj.value = o.toString();
			graph.registerBNode(obj.value);
			obj.type = "bnode";
		}
		graph.create(subj, pred, obj, true);
	};
	var parser = new RDFParser(store);
	parser.parse(xml, "", "");
	return graph;
};