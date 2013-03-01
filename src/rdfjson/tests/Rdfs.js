define(['nodeunit', '../Graph', '../converters', '../Rdfs', 'fs', 'when'], function(nodeunitNode, Graph, converters, Rdfs, fs, when) {
    //browsers have the global nodeunit already available
    var nu = nodeunitNode || nodeunit;	
    
    var defer = when.defer();
    var graph;
    var rdfs = new Rdfs();
    
    fs.readFile("./dcterms.rdf", 'utf8', function(err, data) {
	graph = converters.rdfxml2graph(data);
	rdfs.addGraph(graph);
	defer.resolve();
    });
    
    return nu.testCase({
	setUp: function(callback) {
	    defer.promise.then(callback);
	},
  	rdfsClasses: function(test) {
  	    test.ok(rdfs.getClasses().length > 0, "Found no classes!");
  	    test.done();
  	},
  	rdfsProperties: function(test) {
  	    test.ok(rdfs.getProperties().length > 0, "Found no properties!");
  	    test.done();
  	},
  	rdfsClass: function(test) {
  	    var cls = rdfs.getClass("http://purl.org/dc/terms/MediaTypeOrExtent");
  	    test.ok(cls != null, "No class found.");
 	    test.ok(cls.getLabel().length > 0, "No label found.");
  	    test.ok(cls.getComment().length > 0, "No comment found");
  	    test.ok(cls.getChildren().length > 0, "No Children found");
  	    test.done();
  	},
  	rdfsProperty: function(test) {
  	    var prop = rdfs.getProperty("http://purl.org/dc/terms/relation");
  	    test.ok(prop != null, "No property found.");
 	    test.ok(prop.getLabel().length > 0, "No label found.");
  	    test.ok(prop.getComment().length > 0, "No comment found");
  	    test.ok(prop.getChildren().length > 0, "No Children found");
  	    test.done();
  	}
    });
});