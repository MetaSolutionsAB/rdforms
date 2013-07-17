var static = require('node-static'),
    http = require('http'),
    fs = require('fs');
    url    = require('url'),
    util = require('util');
var webroot = '../',
    port = 8181;
var file = new(static.Server)(webroot, {
    cache: 600,
    headers: { 'X-Powered-By': 'node-static' }
});
http.createServer(function(req, res) {
    var pathname = decodeURI(url.parse(req.url).pathname);
    console.log("Serving : " +pathname);
    if (pathname === "/templates" || pathname === "/templates/") {
        req.on("end", function(){
            fnames = fs.readdirSync("../templates/");
            str = "<html><body>"
            for (var i=0;i<fnames.length;i++) {
                var fname = fnames[i];
                var ind = fname.indexOf(".json");
                if (ind !== -1) {
                    fname = fname.substr(0, ind);
                    str += "<a href=\" ../apps/formulator.html?templates=../templates/"+fname+".json&rdf=../templates/"+fname+".rdf\">"+fname+"</a><br/>";
                }
            }
            str += "</body></html>"
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.write(str);
            res.end();
        });
    } else if (pathname.indexOf("/templates/") === 0 && req.method==="PUT") {
        var body = "";
        req.on("data", function(data){ body += data; });
        req.on("end", function(){
            console.log("Writing data to : "+pathname);
            console.log("Data : "+ body);
            var fd = fs.openSync(".."+pathname, "w");
            fs.writeSync(fd, body, 0, "utf8");
            res.statusCode = 200;
            res.end();
        });
    } else {
        //Static serve files.
        req.addListener('end', function() {
            file.serve(req, res, function(err, result) {
                if (err) {
//                console.error('Error serving %s - %s', req.url, err.message);
                } else {
//                console.log('%s - %s', req.url, res.message);
                }
            });
        });
    }
}).listen(port);
console.log('node-static running at http://localhost:%d', port);