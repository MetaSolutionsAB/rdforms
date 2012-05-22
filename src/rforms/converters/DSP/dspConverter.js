var sys = require("util");
var fs = require("fs");

var xml2js = require('xml2js');

var isArray = function(v) {
	return Object.prototype.toString.call(v) === "[object Array]";
}

var occurence = function(template) {
	var card = {min: template.minOccurs};
	if (template.maxOccurs != null) {
		card.max = template.maxOccurs;
	}
	return card;
};

var buildDT = function(dt) {
	var children = [];
	var sts = dt.StatementTemplate;
	for(var i=0;i<sts.length;i++) {
		children.push({id: sts[i].id});
	}
	var id = dt["@"].ID;
	return {id: id, type: "group", label: {en: id}, content: children, cardinality: occurence(dt)};
};

var buildST = function(rforms, schema, st) {
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
		var nonLit = st.NonLiteralConstraint;
		if (!nonLit) {
			result.type = "text";
			result.nodetype = "URI";
		} else if (nonLit["@"] && nonLit["@"].descriptionTemplateRef) {
			result["extends"] = nonLit["@"].descriptionTemplateRef;
		} else {
			if (nonLit.ValueClass) {
				result.nodeType = "URI";
				result.type = "choice";
				result.constraint = {"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": nonLit.ValueClass};
			} else {
				result.nodeType = "BLANK";
				result.type = "group";
				if (nonLit.VocabularyEncodingScheme) {
					var ves = nonLit.VocabularyEncodingScheme;
					if (isArray(ves)) {
						ves = ves[0];
					}
					result.constraint = {"http://www.w3.org/1999/02/22-rdf-syntax-ns#type": ves};
				}
				var blank = {type: "text", nodetype: "LITERAL", cardinality: {min: 1, max: 1, pref: 1}};
				result.cardinality.pref = 1;
				if (nonLit.ValueStringConstraint && nonLit.ValueStringConstraint.SyntaxEncodingScheme) {
					blank.nodetype = "DATATYPE_LITERAL";
					blank.datatype = nonLit.ValueStringConstraint.SyntaxEncodingScheme;
				}
				result.content = [blank];
			}
		}
	}
	
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
		result = {id: id, type: "propertygroup", "content": [choice, result], label: schema.getLabel(st.SubPropertyOf)}
		var desc = schema.getDescription(st.SubPropertyOf);
		if (desc) {
			result.description = desc;
		}
	}
	rforms.auxilliary.push(result);
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

var buildRForms = function(dsps, schema, stub) {
	stub.auxilliary = stub.auxilliary || [];
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
		stub.auxilliary.push(buildDT(dsp));
	}
	//Generate all StatementTemplates, that extend DescriptionTemplates when there are DescriptionTemplateRefs	
	for (var key in dsps) {
		var dsp = dsps[key];
		var sts = dsp.StatementTemplate;
		for(var i=0;i<sts.length;i++) {
			buildST(stub, schema, sts[i]);
		}
	}
	return stub;
};

/**
 * @param params must contain infile, outfile, a stub and a schema.
 */
exports.convert = function(params) {
	fs.readFile(params.infile, function(err, data) {
		var parser = new xml2js.Parser();
		parser.parseString(data, function(err, src) {
			var dsparr = src.DescriptionTemplate;
			var dsps = {};
			for (var i=0;i<dsparr.length;i++) {
				dsps[dsparr[i]["@"].ID] = dsparr[i];
			}
			var rforms = buildRForms(dsps, params.schema, params.stub);
			//Throw away labels not used:
			var fd = fs.openSync(params.outfile, "w");
			fs.writeSync(fd, JSON.stringify(rforms, true, 1), 0, "utf8");

		});
	});
};