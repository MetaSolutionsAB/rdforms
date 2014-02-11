define([ "fs" ], function(fs) {
	var label = "http://www.w3.org/2000/01/rdf-schema#label";
	var comment = "http://www.w3.org/2000/01/rdf-schema#comment";
	var description = "http://purl.org/dc/terms/description";
	
	var isArray = function(v) {
		return Object.prototype.toString.call(v) === "[object Array]";
	}
	
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
	
	var getFallbackValue = function(uri) {
		var slashIndex = uri.lastIndexOf("/");
		var hashIndex = uri.lastIndexOf("#");
		if (hashIndex > slashIndex) {
			return {en: uri.substring(hashIndex+1)};
		} else {
			return {en: uri.substring(slashIndex+1)};
		}	
	};
	
	var load = function(infile, callback) {
		fs.readFile(infile, function(err, data) {
			var schema = JSON.parse(data);
			callback({
				getLabel: function(uri, fallback) {
					var obj = getValue(schema[uri], [label]);
					if (obj) {
						return obj;
					}
					if (fallback !== false) {
						return getFallbackValue(uri);
					}
				},
				getDescription: function(uri) {
					var obj = getValue(schema[uri], [comment, description]);
					if (obj) {
						return obj;
					}
				},
				getCachedChoices: function(constraints) {
					//TODO, first have to port rdfjson to nodejs friendly format.
				}
			});
		});
	};
	
	return {load: function(infile, callback) {
		if (isArray(infile)) {
			schemaArr = [];
			count = infile.length;
			var schemaAgg = {
				getLabel: function(uri) {
					var label;
					for (var s=0;s<schemaArr.length;s++) {
						label = schemaArr[s].getLabel(uri, false);
						if (label) {
							return label;
						}
					}
					return getFallbackValue(uri);
				},
				getDescription: function(uri) {
					var desc;
					for (var s=0;s<schemaArr.length;s++) {
						desc = schemaArr[s].getDescription(uri);
						if (desc) {
							return desc;
						}
					}
				}
			};
			var f = function(index) {
				load(infile[index], function(schema) {
					schemaArr[index] = schema;
					count--;
					if (count === 0) {
						callback(schemaAgg);
					}
				});
			};
			
			for (var i=0;i<infile.length;i++) {
				f(i);
			}
		} else {
			load(infile, callback);
		}
	}};
});