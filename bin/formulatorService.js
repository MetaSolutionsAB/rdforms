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
    if (req.method === "PUT") {
        if (pathname.indexOf("/templates/") === 0 || pathname.indexOf("/local_templates/") === 0) {
            console.log("Serving a PUT");
            var body = "";
            req.on("data", function(data){ body += data; });
            req.on("end", function(){
                console.log("Writing data to : "+pathname);
                //console.log("Data : "+ body);
                var fd = fs.openSync(".."+pathname, "w");
                fs.writeSync(fd, body, 0, "utf8");
                res.statusCode = 200;
                res.end();
            });
        }
    }

    if (req.method === "GET") {
        if (/[\/_]templates\/?$/.test(pathname)) {
            req.on("end", function(){
                var formulatorpath = "../html/formulator.html?templates=";
                if (pathname[pathname.length-1] !== "/") {
                    pathname = pathname + "/";
                    formulatorpath = "./html/formulator.html?templates=";
                }
                fnames = fs.readdirSync(".."+pathname);
                str = "<html><body>";
                for (var i=0;i<fnames.length;i++) {
                    var fname = fnames[i];
                    var ind = fname.indexOf(".json");
                    if (ind !== -1) {
                        fname = fname.substr(0, ind);
                    } else {
                        continue;
                    }
                    var t = ".." + pathname+fname+".json";
                    var d = ".." + pathname+fname+".rdf";
                    try {
                        fs.statSync(d); //File exists
                        str += "<a href=\""+formulatorpath+t+"&rdf="+d+"\">"+fname+"</a><br/>";
                    } catch(e) { //Files does not exist
                        str += "<a href=\" ../html/formulator.html?templates="+t+"\">"+fname+"</a><br/>"
                    }
                }
                str += "</body></html>"
                res.writeHead(200, { 'Content-Type': 'text/html'});
                res.write(str);
                res.end();
            });
        } else {
            //Static serve files.
            req.addListener('end', function() {
                if (fs.existsSync(".."+pathname) && !fs.lstatSync(".."+pathname).isDirectory()) {
                    file.serve(req, res, function(err, result) {
                        if (err) {
//                console.error('Error serving %s - %s', req.url, err.message);
                        } else {
//                console.log('%s - %s', req.url, res.message);
                        }
                    });
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json'});
                    res.write("{\"templates\": []}");
                    res.end();
                }
            });
        }
        req.resume();
    }
}).listen(port);
console.log('node-static running at http://localhost:%d', port);