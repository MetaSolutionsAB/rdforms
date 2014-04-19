define(["util", "fs", "xml2js"], function(util, fs, xml2js) {
		
	var isArray = function(v) {
		return Object.prototype.toString.call(v) === "[object Array]";
	}
	
	var occurence = function(template) {
		var card = {min: 0};
		if (template["@"]) {
			if (template["@"].minOccurs != null) {
				card.min = parseInt(template["@"].minOccurs);
			}
			if (template["@"].maxOccurs != null) {
				card.max = parseInt(template["@"].maxOccurs);
			}
		}
		return card;
	};
	var mixinPrefs = function(template, prefs, result) {
		var id;
		if (template["@"]) {
			id = template["@"].ID;
		}
		if (!id) {
			id = template.Property || template.SubPropertyOf;
		}

		if (id && prefs[id]) {
			var card = result.cardinality;
			if (prefs[id].max != null) {
				card.max = prefs[id].max;
			}
			if (prefs[id].pref != null) {
				card.pref = prefs[id].pref;
			}
			if (prefs[id].min != null) {
				card.min = prefs[id].min;
			}
			if (prefs[id].cls) {
				result.cls = (result.cls || []).concat(prefs[id].cls);
			}
		}
	};
	
	var buildDT = function(dt) {
		var children = [];
		var sts = dt.StatementTemplate;
		for(var i=0;i<sts.length;i++) {
			children.push({id: sts[i].id});
		}
		var id = dt["@"].ID;
		return {id: id, type: "group", label: {en: id}, items: children, cardinality: occurence(dt)};
	};
	
	var buildST = function(rforms, prefs, schema, st) {
		var result = {cardinality: occurence(st), id: getId(st)};
		if (st.LiteralConstraint || (st["@"] && st["@"].type === "literal")) {
			result.type = "text";
			var litConstr = st.LiteralConstraint; 
			if (!litConstr) {
				result.nodetype = "LITERAL";
			} else if (litConstr.LanguageOccurrence) {
				switch(litConstr.LanguageOccurrence) {
				case "mandatory":
					result.nodetype = "LANGUAGE_LITERAL";
					break;
				case "optional":
					result.nodetype = "LITERAL";
					break;
				case "disallowed":
					result.nodetype = "ONLY_LITERAL";
					break;
				}
			} else if (litConstr.SyntaxEncodingScheme) {
				result.nodetype = "DATATYPED_LITERAL";
				result.datatype = litConstr.SyntaxEncodingScheme;
			}
		} else { //NonLiteralConstraint
			
			//CASE NonLiteralConstraint
			var nonLit = st.NonLiteralConstraint;
			if (!nonLit) {
				result.type = "text";
				result.nodetype = "URI";
			} else if (nonLit["@"] && nonLit["@"].descriptionTemplateRef) {
				result["extends"] = nonLit["@"].descriptionTemplateRef;
				//TODO catch the case when ValueURIOccurrence is mandatory, if so, do a type=choice with 
				//constraints from the ResourceClass of the referenced DescriptionTemplate instead.
			} else {
				if (nonLit.ValueClass) {
					result.constraints = {"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": nonLit.ValueClass};
				}
				var ves = nonLit.VocabularyEncodingScheme;
				//If single VocabularyEncodingScheme, then add as a constraint.
				if (ves && !isArray(ves)) {
					if (!result.constraints) {
						result.constraints = {};
					}
					result.constraints["http://purl.org/dc/dcam/memberOf"] = ves;
				}
				if (!nonLit.ValueStringConstraint || (nonLit.ValueStringConstraint["@"] && nonLit.ValueStringConstraint["@"].maxOccurs === "0")) {
					//Multiple VocabularyEncodingScheme is not supported in this case.
					if (nonLit.ValueClass || nonLit.VocabularyEncodingScheme) {
						result.nodetype = "URI";
						result.type = "choice";
					} else {
						result.nodetype = "URI";
						result.type = "text";
					}
				} else {
					result.items = [];
					result.nodetype = "BLANK";
					result.type = "group";
					result.cardinality.pref = 1;
					if (ves && isArray(ves)) {
						var choice = {type: "choice", nodetype: "URI", property: "http://purl.org/dc/dcam/memberOf", cardinality: {min: 1, max: 1, pref: 1}};
						choice.label = {en: "Vocabulary encoding scheme"};
						choice.choices = [];
						for (var v=0;v<ves.length;v++) {
							choice.choices[v] = {value: ves[v], label: schema.getLabel(ves[v])};
						}
						result.items.push(choice);
					}

					var literal = {type: "text", 
							nodetype: "LITERAL", 
							property: "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
							label: {en: "Value"},
							cardinality: {}
					};
					mixinPrefs(st, prefs, literal);
					literal.cardinality = occurence(nonLit.ValueStringConstraint);
					
					if (nonLit.ValueStringConstraint.SyntaxEncodingScheme) {
						literal.nodetype = "DATATYPE_LITERAL";
						literal.datatype = nonLit.ValueStringConstraint.SyntaxEncodingScheme;
					}
					result.items.push(literal);
				}
			}
		}
		
		mixinPrefs(st, prefs, result);
		if (st.Property) {
			result.property = st.Property;
			result.label = schema.getLabel(st.Property);
			var desc = schema.getDescription(st.Property);
			if (desc) {
				result.description = desc;
			}
		} else { //subPropertyOf
			for (var ontologyUrl in rforms.cachedChoices) {
				if (rforms.cachedChoices.hasOwnProperty(ontologyUrl)) {
					break;
				}
			}
			var choice = {type: "choice", 
					label: {"en": "Choose predicate"}, 
					constraints: {"http://www.w3.org/2000/01/rdf-schema#subPropertyOf": st.SubPropertyOf},
					ontologyUrl: ontologyUrl
				};
			var id = result.id;
			delete result.id;
			result = {id: id, type: "propertygroup", "items": [choice, result], label: schema.getLabel(st.SubPropertyOf)}
			var desc = schema.getDescription(st.SubPropertyOf);
			if (desc) {
				result.description = desc;
			}
		}
		rforms.templates.push(result);
	};
	
	var getId = (function() {
		var ids = {};	
		return function(st) {
			if (st.id) {
				return st.id;
			}
			var id = st.Property || st.SubPropertyOf;
			if (ids[id] == null) {
				ids[id] = 1;
				st.id = id;
			} else {
				ids[id]++;
				st.id = id+ids[id];
			}
			return st.id;
		}
	})();
	
	var buildRForms = function(dsps, schema, stub, prefs) {
		stub.templates = stub.templates || [];
		stub.cachedChoices = stub.cachedChoices || {};
		//Generate all StatementTemplate ids
		for (var key in dsps) {
			var dsp = dsps[key];
			var sts = dsp.StatementTemplate;
			for(var i=0;i<sts.length;i++) {
				getId(sts[i]);
			}
		}
		//Generate all DescriptionTemplates, as they may be extended they must be defined first.
		//Since they lazy load all children there will be no problem initializing these first,
		//although the identifiers to the children must be correct, i.e. thats why the code above.
		for (var key in dsps) {
			var dsp = dsps[key];
			stub.templates.push(buildDT(dsp));
		}
		//Generate all StatementTemplates, that extend DescriptionTemplates when there are DescriptionTemplateRefs	
		for (var key in dsps) {
			var dsp = dsps[key];
			var sts = dsp.StatementTemplate;
			for(var i=0;i<sts.length;i++) {
				buildST(stub, prefs, schema, sts[i]);
			}
		}
		return stub;
	};
	
	/**
	 * @param params must contain infile, outfile, a stub and a schema.
	 */
	return {convert: function(params) {
		fs.readFile(params.infile, function(err, data) {
			var parser = new xml2js.Parser({attrkey: "@", explicitArray: false});
			parser.parseString(data, function(err, src) {
				var dsparr = src.DescriptionSetTemplate.DescriptionTemplate;
				var dsps = {};
				for (var i=0;i<dsparr.length;i++) {
					dsps[dsparr[i]["@"].ID] = dsparr[i];
				}
				var rforms = buildRForms(dsps, params.schema, params.stub, params.prefs);
				//Throw away labels not used:
				var fd = fs.openSync(params.outfile, "w");
				fs.writeSync(fd, JSON.stringify(rforms, true, 1), 0, "utf8");
	
			});
		});
	}};
});