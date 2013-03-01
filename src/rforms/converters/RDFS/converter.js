define(["util", "fs", 'rdfjson/Graph', 'rdfjson/Rdfs'], function(util, fs, Graph, Rdfs) {
    
    var getPropertiesFromClasses = function(rdfs, classes)  {
	var props = [];
	for (var c=0;c<classes.length;c++) {
	    var cls = classes[c];
	    var c = rdfs.getClass(cls);
	    if (c != null) {
		props = props.concat(c.getAllDomainOf());
	    }
	}
	return props;
    };
    
    var getAbbrevId = function(uri, conf) {
	if (uri.indexOf(conf.ns) === 0) {
	    return conf.abbrev+":"+uri.substr(conf.ns.length);
	}
	return uri;
    };

	
    var convert = function(graph, conf) {
	var rdfs = new Rdfs();
	rdfs.addGraph(graph);
	
	var auxP = [];
	var auxC = [];
	
	var major = {};
	for (var co=0;co<conf.major.length;co++) {
	    major[conf.ns+conf.major[co]] = true;
	}

	var props = rdfs.getProperties();
	for (var p=0;p<props.length;p++) {
	    var prop = props[p];
	    var source = {
		id: getAbbrevId(prop.getURI(), conf), 
		property: prop.getURI(), 
		label: prop.getLabels()};
	    var desc = 	prop.getComments();
	    if (desc != null) {
		source.description = desc;
	    }
	    
	    var ranges = prop.getRange();
	    if (ranges == null || ranges.indexOf("http://www.w3.org/2000/01/rdf-schema#Literal") !== -1) {
		source["type"] = "text";
		source["nodetype"] = "LANGUAGE_LITERAL"
	    } else if (ranges.length === 1 && ranges[0] === "http://www.w3.org/2002/07/owl#Thing") {
		source["type"] = "text";
		source["nodetype"] = "URI"
	    } else {
		if (ranges.length > 0) {
		    var constraints = {};
		    for (var cr=0;cr<ranges.length;cr++) {
			constraints["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] = ranges[cr];
		    }
		    source["constraints"] = constraints;
		}
		if (ranges.length === 1 && major[ranges[0]]){
		    source["type"] = "choice";
		    source["nodetype"] = "RESOURCE";
		} else {
		    var propsFC = getPropertiesFromClasses(rdfs, ranges);
		    var propArr = [];
		    for (var pf=0;pf<propsFC.length;pf++) {
			propArr.push({"id": getAbbrevId(propsFC[pf].getURI(), conf)});
		    }
		    source["type"] = "group";
		    source.automatic = true;
		    source.content = propArr;
		}
	    }
	    auxP.push(source);
	}
	
	var clss = rdfs.getClasses();
	for (var c=0;c<clss.length;c++) {
	    var cls = clss[c];
	    var source = {
		id: getAbbrevId(cls.getURI(), conf), 
		label: cls.getLabels()
	    };
	    var desc = 	cls.getComments();
	    if (desc != null) {
		source.description = desc;
	    }
	    
	    var props = getPropertiesFromClasses(rdfs, [cls.getURI()]);
	    var propArr = [];
	    for (var p=0;p<props.length;p++) {
		propArr.push({"id": getAbbrevId(props[p].getURI(), conf)});
	    }
	    if (propArr.length > 0) {
		source["type"] = "group";
		source.content = propArr;
		source.automatic = true;
		auxC.push(source);
	    }
	}
	return {auxilliary: auxP.concat(auxC), scope: conf.abbrev, namespace: conf.ns};
    };
    
    
    return {convert: convert};
});