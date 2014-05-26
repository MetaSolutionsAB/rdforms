define(['rdfjson/Rdfs'], function (Rdfs) {

    var getPropertiesFromClasses = function (rdfs, classes) {
        var props = [];
        for (var c = 0; c < classes.length; c++) {
            var cls = classes[c];
            var c = rdfs.getClass(cls);
            if (c != null) {
                props = props.concat(c.getAllDomainOf());
            }
        }
        return props;
    };

    var isDatatype = function(range, conf) {
        if (range.indexOf("http://www.w3.org/2001/XMLSchema#") === 0) {
            return true;
        }
        if (conf.datatypeBases != null) {
            for (var i=0;i<conf.datatypeBases.length;i++) {
                if (range.indexOf(conf.datatypeBases[i]) === 0) {
                    return true;
                }
            }
        }
    };
    var getForcedProperties = function (cls, conf, rdfs) {
        var props = [];
        var arr = conf._forced[cls.getURI()];
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                props.push(rdfs.getProperty(arr[i]));
            }
        }
        return props;
    };

    var getAbbrevId = function (uri, conf) {
        if (uri.indexOf(conf.ns) === 0) {
            return conf.abbrev + ":" + uri.substr(conf.ns.length);
        }
        return uri;
    };

    var normalizeConf = function (conf) {
        var major = {};
        conf.major = conf.major || [];
        for (var co = 0; co < conf.major.length; co++) {
            major[conf.ns + conf.major[co]] = true;
        }

        var ignore = {};
        for (var ig = 0; ig < conf.ignore.length; ig++) {
            ignore[conf.ns + conf.ignore[ig]] = true;
        }
        conf._ignore = ignore;

        var order = [];
        var arr = [];
        if (conf.order) {
            for (var i = 0; i < conf.order.length; i++) {
                arr.push(conf.ns + conf.order[i]);
            }
        }
        order.push({properties: arr});

        if (conf.categories) {
            for (var c = 0; c < conf.categories.length; c++) {
                var cat = conf.categories[c];
                var arr = [];
                for (var p = 0; p < cat.properties.length; p++) {
                    arr.push(conf.ns + cat.properties[p]);
                }
                order.push({properties: arr, name: cat.name});
            }
        }
        conf._order = order;
        conf._forced = {};
        if (conf.forced != null) {
            for (var cls in conf.forced) {
                if (conf.forced.hasOwnProperty(cls)) {
                    var arr = conf.forced[cls];
                    conf._forced[conf.ns + cls] = arr;
                    for (var k = 0; k < arr.length; k++) {
                        arr[k] = conf.ns + arr[k];
                    }
                }
            }
        }
        conf._specs = {};
        if (conf.specs != null) {
            for (var r in conf.specs) {
                if (conf.specs.hasOwnProperty(r)) {
                    conf._specs[conf.ns + r] = conf.specs[r];
                }
            }
        }
    };

    var removeIgnored = function (arr, conf) {
        var ret = [];
        for (var i = 0; i < arr.length; i++) {
            if (!conf._ignore[arr[i].getURI()]) {
                ret.push(arr[i]);
            }
        }
        return ret;
    };
    var groupIntoCategories = function (properties, conf) {
        var cats = [];
        var propIdx = {};
        for (var j = 0; j < properties.length; j++) {
            propIdx[properties[j].getURI()] = properties[j];
        }

        for (var c = 0; c < conf._order.length; c++) {
            var catarr = conf._order[c].properties;
            var arr = [];
            cats.push(arr);
            for (var p = 0; p < catarr.length; p++) {
                var prop = catarr[p];
                if (propIdx[prop] != null) {
                    arr.push(propIdx[prop]);
                    propIdx[prop] = null;
                }
            }
        }
        //Add those that have not been included
        var lastCat = cats[cats.length - 1];
        for (var k = 0; k < properties.length; k++) {
            if (propIdx[properties[k].getURI()] != null) {
                lastCat.push(properties[k]);
            }
        }
        return cats;
    };

    var convert = function (graph, conf) {
        var rdfs = new Rdfs();
        rdfs.addGraph(graph);
        rdfs.addThing();

        var auxP = [];
        var auxC = [];
        normalizeConf(conf);

        if (!conf.ignoreAllProperties) {
            var props = rdfs.getProperties();
            for (var p = 0; p < props.length; p++) {
                var prop = props[p];
                if (conf._ignore[prop.getURI()]) {
                    continue;
                }
                var source = {
                    id: getAbbrevId(prop.getURI(), conf),
                    property: prop.getURI(),
                    label: prop.getLabels()};
                var desc = prop.getComments();
                if (desc != null) {
                    source.description = desc;
                }

                var ranges = prop.getRange();
                var r = conf._specs[prop.getURI()];

                if (ranges != null && ranges.indexOf("http://www.w3.org/2001/XMLSchema#string") !== -1) {
                    source["type"] = "text";
                    source["nodetype"] = (r != null ? r.nodetype : null) || "LITERAL";
                } else if ((r != null && (r.nodetype === "LANGUAGE_LITERAL" || r.nodetype === "LITERAL" || r.nodetype === "ONLY_LITERAL"))
                    || ranges == null || ranges.indexOf("http://www.w3.org/2000/01/rdf-schema#Literal") !== -1) {
                    source["type"] = "text";
                    var nt = r != null ? r.nodetype : null;
                    source["nodetype"] = nt || conf.literalNodeTypeDefault || "LANGUAGE_LITERAL";
                } else if ((r != null && r.nodetype === "DATATYPE_LITERAL") || (ranges.length === 1 && isDatatype(ranges[0], conf))) {
                    source["type"] = "text";
                    source["nodetype"] = "DATATYPE_LITERAL";
                    if (ranges.length === 1) {
                        source["datatype"] = ranges[0];
                    }
                } else if (ranges.length === 1 && ranges[0] === "http://www.w3.org/2002/07/owl#Thing" || (r != null && r.type === "text")) {
                    source["type"] = "text";
                    source["nodetype"] = "URI"
                } else {
                    if (ranges.length > 0) {
                        var constraints = {};
                        for (var cr = 0; cr < ranges.length; cr++) {
                            constraints["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] = ranges[cr];
                        }
                        source["constraints"] = constraints;
                    }
                    if (ranges.length === 0 && conf.typeForUnknownRange === "choice") {
                        source["type"] = "choice";
                        source["nodetype"] = "RESOURCE";
                    } else if (ranges.length === 1
                        && (conf.allClassesMajor
                            || conf._major[ranges[0]] && (r == null || r.type === "choice" || r.type == null))) {
                        source["type"] = "choice";
                        source["nodetype"] = "RESOURCE";
                    } else {
                        if (ranges.length === 1 && !conf.ignoreAllClasses) {
                            source.extends = getAbbrevId(ranges[0], conf);
                        } else {
                            var propsFC = getPropertiesFromClasses(rdfs, ranges);
                            var propArr = [];
                            for (var pf = 0; pf < propsFC.length; pf++) {
                                if (conf._ignore[propsFC[pf].getURI()]) {
                                    continue;
                                }
                                propArr.push(getAbbrevId(propsFC[pf].getURI(), conf));
                            }
                            if (propArr.length > 0) {
                                source.items = propArr;
                            }
                        }
                        source["type"] = (r ? r.type : r) || conf.noRangeTypeDefault || "group";
                        source.automatic = true;
                    }
                }
                if (r != null && r.cls != null) {
                    source.cls = r.cls;
                }
                if (r != null && r.styles != null) {
                    source.styles = r.styles;
                }
                if (r != null && r.cardinality != null) {
                    source.cardinality = r.cardinality;
                }
                if (conf.nonGroupCardinalityDefault != null && source.type !== "group") {
                    source.cardinality = conf.nonGroupCardinalityDefault;
                }
                auxP.push(source);
            }
        }

        if (!conf.ignoreAllClasses) {
            var clss = removeIgnored(rdfs.getClasses(), conf);
            for (var c = 0; c < clss.length; c++) {
                var cls = clss[c];
                var source = {
                    id: getAbbrevId(cls.getURI(), conf),
                    label: cls.getLabels(),
                    constraints: {"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": cls.getURI()}
                };
                var desc = cls.getComments();
                if (desc != null) {
                    source.description = desc;
                }
                var forced = getForcedProperties(cls, conf, rdfs);
                var props;
                if (cls.getDirectParents().length === 1) {
                    source.extends = getAbbrevId(cls.getDirectParents()[0].getURI(), conf);
                    props = removeIgnored((cls.getDomainOf() || []).concat(forced), conf);
                } else {
                    props = removeIgnored(getPropertiesFromClasses(rdfs, [cls.getURI()]).concat(forced), conf);
                }
                var cats = groupIntoCategories(props, conf); //Order and organize into categories.
                var propArr = [];

                //All properties that should not be organized into categories.
                for (var p = 0; p < cats[0].length; p++) {
                    propArr.push(getAbbrevId(cats[0][p].getURI(), conf));
                }

                //Category-divided properties.
                if (cats[0].length !== props.length) {
                    for (var q = 1; q < cats.length; q++) {
                        var cat = cats[q];
                        if (cat.length > 0) {
                            var group = {
                                cardinality: {"min": 1, "pref": 1, "max": 1},
                                type: "group",
                                styles: ["expandable"],
                                label: conf.categories[q - 1].label,
                                items: []
                            };
                            propArr.push(group);

                            for (var s = 0; s < cat.length; s++) {
                                group.items.push(getAbbrevId(cat[s].getURI(), conf));
                            }
                        }
                    }
                }
                source["type"] = "group";
                if (propArr.length > 0) {
                    source.items = propArr;
                }
                auxC.push(source);
            }
        }

        if (conf.root) {
            return {templates: auxP.concat(auxC), scope: conf.abbrev, namespace: conf.ns, root: {id: conf.root}};
        } else {
            return {templates: auxP.concat(auxC), scope: conf.abbrev, namespace: conf.ns};
        }
    };

    return {convert: convert};
});