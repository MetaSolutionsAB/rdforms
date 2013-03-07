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

    var normalizeConf = function(conf) {
	var major = {};
	for (var co=0;co<conf.major.length;co++) {
	    major[conf.ns+conf.major[co]] = true;
	}
	conf._major = major;
	
	var ignore = {};
	for (var ig=0;ig<conf.ignore.length;ig++) {
	    ignore[conf.ns+conf.ignore[ig]] = true;
	}
	conf._ignore = ignore;

	var order = [];
	var arr = [];
	if (conf.order) {
	    for (var i=0;i<conf.order.length;i++) {
		arr.push(conf.ns+conf.order[i]);
	    }
	}
	order.push({properties: arr});
	
	if (conf.categories) {
	    for (var c=0;c<conf.categories.length;c++) {
		var cat = conf.categories[c];
		var arr = [];
		for (var p=0;p<cat.properties.length;p++) {
		    arr.push(conf.ns+cat.properties[p]);
		}
		order.push({properties: arr, name: cat.name});
	    }
	}
	conf._order = order;
    };

    var removeIgnored = function(arr, conf) {
	var ret = [];
	for (var i=0;i<arr.length;i++) {
	    if (!conf._ignore[arr[i].getURI()]) {
		ret.push(arr[i]);
	    }
	}
	return ret;
    };
    var groupIntoCategories = function(properties, conf) {	
	var cats = [];
	var propIdx = {};
	for (var j=0;j<properties.length;j++) {
	    propIdx[properties[j].getURI()] = properties[j];
	}

	for (var c=0;c<conf._order.length;c++) {
	    var catarr = conf._order[c].properties;
	    var arr = [];
	    cats.push(arr);
	    for (var p=0;p<catarr.length;p++) {
		var prop = catarr[p];
		if (propIdx[prop] != null) {
		    arr.push(propIdx[prop]);
		    propIdx[prop] = null;
		}
	    }
	}
	//Add those that have not been included
	var lastCat = cats[cats.length-1];
	for (var k=0;k<properties.length;k++) {
	    if (propIdx[properties[k].getURI()] != null) {
		lastCat.push(properties[k]);
	    }
	}
	return cats;
    };
	
    var convert = function(graph, conf) {
	var rdfs = new Rdfs();
	rdfs.addGraph(graph);
	
	var auxP = [];
	var auxC = [];
	normalizeConf(conf);

	var props = rdfs.getProperties();
	for (var p=0;p<props.length;p++) {
	    var prop = props[p];
	    if (conf._ignore[prop.getURI()]) {
		continue;
	    }
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
		if (ranges.length === 1 && conf._major[ranges[0]]){
		    source["type"] = "choice";
		    source["nodetype"] = "RESOURCE";
		} else {
		    var propsFC = getPropertiesFromClasses(rdfs, ranges);
		    var propArr = [];
		    for (var pf=0;pf<propsFC.length;pf++) {
			if (conf._ignore[propsFC[pf].getURI()]) {
			    continue;
			}
			propArr.push({"id": getAbbrevId(propsFC[pf].getURI(), conf)});
		    }
		    source["type"] = "group";
		    source.automatic = true;
		    source.content = propArr;
		}
	    }
	    auxP.push(source);
	}
	
	var clss = removeIgnored(rdfs.getClasses(), conf);
	for (var c=0;c<clss.length;c++) {
	    var cls = clss[c];
	    var source = {
		id: getAbbrevId(cls.getURI(), conf), 
		label: cls.getLabels(),
		constraints: {"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": cls.getURI()}
	    };
	    var desc = 	cls.getComments();
	    if (desc != null) {
		source.description = desc;
	    }
	    
	    var props = removeIgnored(getPropertiesFromClasses(rdfs, [cls.getURI()]), conf);
	    var cats = groupIntoCategories(props, conf); //Order and organize into categories.
	    var propArr = [];
	    
	    //All properties that should not be organized into categories.
	    for (var p=0;p<cats[0].length;p++) {
		propArr.push({"id": getAbbrevId(cats[0][p].getURI(), conf)});
	    }
	    
	    //Category-divided properties.    
	    if (cats[0].length !== props.length) {
		for (var q=1;q<cats.length;q++) {
		    var cat = cats[q];
		    if (cat.length > 0) {
			var group = {
			    cardinality: {"min": 1, "pref": 1, "max": 1},
			    type: "group",
                            cls: ["rformsexpandable"],
                            label: conf.categories[q-1].label,
			    content: []
			};
			propArr.push(group);
			
			for (var s=0;s<cat.length;s++) {
			    group.content.push({"id": getAbbrevId(cat[s].getURI(), conf)});
			}
		    }
		}
	    }
	    source["type"] = "group";
	    source.content = propArr;
	    auxC.push(source);
	}
	if (conf.root) {
	    return {auxilliary: auxP.concat(auxC), scope: conf.abbrev, namespace: conf.ns, root: {id: conf.root}};
	} else {
	    return {auxilliary: auxP.concat(auxC), scope: conf.abbrev, namespace: conf.ns};
	}
    };
    
    return {convert: convert};
});