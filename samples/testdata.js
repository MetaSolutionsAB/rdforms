testdata = {};

//A simple template showing a title and an creator in the form of a foaf:Person with a firstname and lastname.
//The person being shown in a table format.
testdata.templateSrc = {
        "root": "test",
	"templates":[{
	        "id": "test", 
		"type":"group",
		"content":[
			{
				"type":"text",
				"nodetype":"LANGUAGE_LITERAL",
				"property":"http://purl.org/dc/terms/title",
				"cardinality": {"min": 2, "pref": "4", "max": 5},
				"label":{"en":"Title"},
				"description":{"en":"A short title of the resource"}
			}, {
				"type":"group",
				"nodetype":"RESOURCE",
				"label":{"en":"Creator"},
				"property":"http://purl.org/dc/terms/creator",
				"cardinality": {"min": 0, "pref": 1, "max": 5},
				"constraints":{"http://www.w3.org/TR/rdf-schema/type":"http://xmlns.com/foaf/0.1/Person"},
				"content":[
					{
						"type":"text",
						"nodetype":"ONLY_LITERAL",
						"property":"http://xmlns.com/foaf/0.1/firstName",
						"cardinality": {"min": 1, "max": 1},
						"label":{"en":"First name"}
					},{
						"type":"text",
						"nodetype":"ONLY_LITERAL",
						"property":"http://xmlns.com/foaf/0.1/surname",
						"cardinality": {"min": 1},
						"label":{"en":"Surname"}
					}
				]
			}
		]
	}]
};

//Simple rdfjson data, all triples are matched into the template.
testdata.rdfSrc = {
	"http://example.org/about" : {
		"http://www.w3.org/TR/rdf-schema/type"	  : [ { "value" : "http://xmlns.com/foaf/0.1/Document", "type" : "uri"}],
        "http://purl.org/dc/terms/title"   : [ { "value" : "Anna's Homepage", "type" : "literal", "lang" : "en" } ] ,
        "http://purl.org/dc/terms/creator" : [ { "value" : "_:person", "type" : "bnode" } ]
    } ,
 
    "_:person" : {
		"http://www.w3.org/TR/rdf-schema/type"	  : [ { "value" : "http://xmlns.com/foaf/0.1/Person", "type" : "uri"}],
        "http://xmlns.com/foaf/0.1/firstName"     : [ { "value" : "Anna", "type" : "literal" } ] ,
        "http://xmlns.com/foaf/0.1/surname"       : [ { "value" : "Wilder", "type" : "literal" } ]
    },
	"http://example.org/about2" : {
		"http://www.w3.org/TR/rdf-schema/type"	  : [ { "value" : "http://xmlns.com/foaf/0.1/Document", "type" : "uri"}]
    }
};
