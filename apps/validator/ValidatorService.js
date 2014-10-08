/*global define*/
define([
    "dojo/json",
    'rdforms/apps/components/RDFDetect',
    "rdforms/apps/validator/validate",
    "rdforms/apps/components/Config",
    "dojo/node!http"
], function(json, RDFDetect, validate, Config, http) {

    var configPath = process.argv[2];
    var port = parseInt(process.argv[3]);
    Config.init(configPath, function(config) {
        for (var cls in config.type2template) if (config.type2template.hasOwnProperty(cls)) {
            config.type2template[cls] = config.itemStore.getTemplate(config.type2template[cls]);
        }

        http.createServer(function(req, res) {
            if (req.method !== "POST") {
                res.writeHead(405, { 'Content-Type': 'text/html'});
                res.write('<html><body><h1>Error - status code 405</h1><p>Method not allowed, only POST supported!</p></body></html>');
                res.statusCode = 405;
                res.end();
            } else {
                var body = "";
                req.on("data", function(data){ body += data; });
                req.on("end", function(){
                    console.log("Serving a POST");
                    var rreport = RDFDetect(body);
                    if (rreport.error) {
                        res.writeHead(400, { 'Content-Type': 'application/json'});
                        res.write('{"errors": true, "rdfError": "'+rreport.error+'"}');
                        res.statusCode = 400;
                    } else {
                        var report = validate.generateReport(rreport.graph, config.type2template, config.mandatoryTypes);
                        res.writeHead(200, { 'Content-Type': 'application/json'});
                        res.statusCode = 200;
                        res.write(json.stringify(report, null, "  "));
                    }
                    res.end();
                });
            }
            req.resume();
        }).listen(port);
        console.log('node-static running at http://localhost:%d', port);
    });
});