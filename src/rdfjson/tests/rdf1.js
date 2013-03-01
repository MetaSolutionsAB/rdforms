define({
	uris: ["http://slashdot.org/", "http://dn.se/"],
	predicates: ["http://purl.org/dc/terms/title", "http://purl.org/dc/terms/maker"],
	graph: {
	    "http://example.org/about" : {
	        "http://purl.org/dc/terms/creator" : [ { "value" : "Anna Wilder", "type" : "literal" } ],
	        "http://purl.org/dc/terms/title"   : [ { "value" : "Anna's Homepage", "type" : "literal", "lang" : "en" } ] ,
	        "http://xmlns.com/foaf/0.1/maker"         : [ { "value" : "_:person", "type" : "bnode" } ],
	        "http://xmlns.com/foaf/0.1/nick"          : [ { "type" : "literal", "value" : "strange, for testing only"} ],
	        "http://purl.org/dc/terms/related" : [ { "value" : "http://example.org/about", "type" : "uri" } ]
	    },
 
	    "_:person" : {
	        "http://xmlns.com/foaf/0.1/homepage"      : [ { "value" : "http://example.org/about", "type" : "uri" } ] ,
	        "http://xmlns.com/foaf/0.1/made"          : [ { "value" : "http://example.org/about", "type" : "uri" } ] ,
	        "http://xmlns.com/foaf/0.1/name"          : [ { "value" : "Anna Wilder", "type" : "literal" } ] ,
	        "http://xmlns.com/foaf/0.1/firstName"     : [ { "value" : "Anna", "type" : "literal" } ] ,
	        "http://xmlns.com/foaf/0.1/surname"       : [ { "value" : "Wilder", "type" : "literal" } ] , 
	        "http://xmlns.com/foaf/0.1/depiction"     : [ { "value" : "http://example.org/pic.jpg", "type" : "uri" } ] ,
	        "http://xmlns.com/foaf/0.1/nick"          : [ 
	                                                      { "type" : "literal", "value" : "wildling"} , 
	                                                      { "type" : "literal", "value" : "wilda" } 
	                                                    ] ,
	        "http://xmlns.com/foaf/0.1/mbox_sha1sum"  : [ {  "value" : "69e31bbcf58d432950127593e292a55975bc66fd", "type" : "literal" } ] 
	    }
	},
	rdfxml: '<?xml version="1.0"?>'+
			'<rdf:RDF'+
			'    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"'+
			'    xmlns:foaf="http://xmlns.com/foaf/0.1/"'+
			'    xmlns:dcterms="http://purl.org/dc/terms/title">'+
			'  <rdf:Description rdf:about="http://example.org/about">'+
			'    <dcterms:creator>Anna Wilder</dcterms:creator>'+
			'    <dcterms:title xml:lang="en">Anna\'s Homepage</dcterms:title>'+
			'    <foaf:maker rdf:nodeID="_:person"/>'+
			'    <foaf:nick>strange, for testing only</foaf:nick>'+
			'    <dcterms:related rdf:resource="http://example.org/about"/>'+
			'  </rdf:Description>'+
			'  <rdf:Description rdf:ID="_:person">'+
			'    <foaf:homepage rdf:resource="http://example.org/about"/>'+
			'    <foaf:made rdf:resource="http://example.org/about"/>'+
			'    <foaf:name>Anna Wilder</foaf:name>'+
			'    <foaf:firstName>Anna</foaf:firstName>'+
			'    <foaf:surname>Wilder</foaf:surname>'+
			'    <foaf:depiction rdf:resource="http://example.org/pic.jpg"/>'+
			'    <foaf:nick>wildling</foaf:nick>'+
			'    <foaf:nick>wilda</foaf:nick>'+
			'    <foaf:mbox_sha1sum>69e31bbcf58d432950127593e292a55975bc66fd</foaf:mbox_sha1sum>'+
			'  </rdf:Description>'+
			' </rdf:RDF>'
});