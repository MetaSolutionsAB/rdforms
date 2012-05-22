var sys = require("util");
var fs = require("fs");

var label = "http://www.w3.org/2000/01/rdf-schema#label";
var comment = "http://www.w3.org/2000/01/rdf-schema#comment";
var description = "http://purl.org/dc/terms/description";

var getValue = function(subject, propArr) {
	var value = {};
	var nonEmpty = false;
	for(var i=0;i<propArr.length;i++) {
		var property = propArr[i];
		if (subject) {
			var labels = subject[property];
			if (labels && labels.length > 0) {
				for (var j=0;j<labels.length;j++) {
					nonEmpty = true;
					var lang = labels[j].lang || "en";
					if (value[lang]) {
						value[lang] = value[lang] + "\n" + labels[j].value;
					} else {
						value[lang] = labels[j].value;
					}
				}
			}
		}
	}
	if (nonEmpty) {
		return value;
	} 
};

exports.load = function(infile, callback) {
	fs.readFile(infile, function(err, data) {
		var schema = JSON.parse(data);
		callback({
			getLabel: function(uri) {
				var obj = getValue(schema[uri], [label]);
				if (obj) {
					return obj;
				}
				var slashIndex = uri.lastIndexOf("/");
				var hashIndex = uri.lastIndexOf("#");
				if (hashIndex > slashIndex) {
					return {en: uri.substring(hashIndex+1)};
				} else {
					return {en: uri.substring(slashIndex+1)};
				}
			},
			getDescription: function(uri) {
				var obj = getValue(schema[uri], [comment, description]);
				if (obj) {
					return obj;
				}
			}
		});
	});
};