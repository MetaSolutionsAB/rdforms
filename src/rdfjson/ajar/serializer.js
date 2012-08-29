dojo.provide("rdfjson.ajar");
dojo.provide("rdfjson.ajar.serializer");
dojo.require("rdfjson.Graph");

var nss = {
		ical: "http://www.w3.org/2002/12/cal/ical#",
		role: "http://purl.org/role/terms/",
		dcterms: "http://purl.org/dc/terms/",
		rdfs: "http://www.w3.org/2000/01/rdf-schema#",
		rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		owl: "http://www.w3.org/2002/07/owl#", 
		vs: "http://www.w3.org/2003/06/sw-vocab-status/ns#", 
		foaf: "http://xmlns.com/foaf/0.1/", 
		wot: "http://xmlns.com/wot/0.1/", 
		dc: "http://purl.org/dc/elements/1.1/"
};
var nscounter = 0;
var sp = "  ";
var sp2 = "    ";

rdfjson.ajar.exportRDFXMLString = function(graph) {
	var nsUsed = [], s, p, nsp, nskey, lname, o, props, objs, i, g = graph._graph || graph; //just in case a rdfjson.Graph is provided.
	var nsify = function(prop) {
		for (var ns in nss) {
			if (prop.indexOf(nss[ns]) === 0) {
				nsUsed.push(ns);
				return ns+":"+prop.substring(nss[ns].length);
			}
		}
		var slash = prop.lastIndexOf("/");
		var hash = prop.lastIndexOf("#");
		if (hash> slash) {
			slash = hash;
		}
		nscounter++;
		ns = "ns"+nscounter;
		nss[ns] = prop.substring(0,slash+1);
		nsUsed.push(ns);
		return ns+":"+prop.substring(slash+1); 
	};
	
	
	var strs = [];
	for (s in g) {
		if (g.hasOwnProperty(s)) {
			if (s.substr(0,2) === "_:") {
				strs.push(sp+'<rdf:Description rdf:nodeID="'+s+'">\n');				
			} else {
				strs.push(sp+'<rdf:Description rdf:about="'+s+'">\n');
			}
			props = g[s];
			for (p in props) {
				if (props.hasOwnProperty(p)) {
					objs = props[p];
					nsp = nsify(p);
					for (i=0;i<objs.length;i++) {
						o = objs[i];
						switch (o.type) {
							case "literal":
								if (o.language != null) {
									strs.push(sp2+'<'+nsp+' xml:lang="'+o.language+'">'+o.value+'</'+nsp+'>\n');									
								} else if (o.datatype != null) {
									strs.push(sp2+'<'+nsp+' rdf:datatype="'+o.datatype+'">'+o.value+'</'+nsp+'>\n');
								} else {
									strs.push(sp2+'<'+nsp+'>'+o.value+'</'+nsp+'>\n');
								}
							break;
							case "uri":
								strs.push(sp2+'<'+nsp+' rdf:resource="'+o.value+'"/>\n');
							break;
							case "blank":
								strs.push(sp2+'<'+nsp+' rdf:nodeID="'+o.value+'"/>\n');
							break;
						}
					}
				}
			}
			strs.push(sp+'</rdf:Description>\n');
		}
	}
	var initialStrs = ['<?xml version="1.0"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"'];
	for (var j=0;j<nsUsed.length;j++) {
		initialStrs.push('\n\txmlns:'+nsUsed[j]+'="'+nss[nsUsed[j]]+'"');
	}
	initialStrs.push('>\n');
	strs.unshift(initialStrs.join(""));
	strs.push('</rdf:RDF>');
	return strs.join("");
};