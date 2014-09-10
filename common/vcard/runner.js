//#!/usr/bin/env node

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require, baseUrl: '../../../'});

var conf = {
    source: "vcard.jsonrdf",
    destination: "vcard.js",
    ns: "http://www.w3.org/2006/vcard/ns#",
    abbrev: "vc",
    major: ["Individual", "Group", "Organization", "Location"],
    ignoreAllClasses: true,
    ignore: ["BBS", "Car", "Dom", "Email", "ISDN", "Internet", "Intl", "Label", "Modem", "Msg", "PCS", "Parcel",
        "Postal", "Pref", "Tel", "X400", "agent", "class", "extended-address", "label", "lattitude", "longitude",
        "mailer", "post-office-box",
        //The following still exist, but have been mapped to other names, e.g. logo => hasLogo, n => hasName
        "adr", "email", "geo", "key", "logo", "n", "org", "photo", "sound", "tel", "url"],
    specs: {
    },
    forced: {},
    order: [],
    categories: []
};

requirejs(['fs', 'rdfjson/Graph', 'rdforms/converters/RDFS/converter'],
	  function (fs, Graph, converter) {
	      fs.readFile(conf.source, 'utf8', function(err, data) {
		  var graph = new Graph(JSON.parse(data));
		  var out = converter.convert(graph, conf);
		  var fd = fs.openSync(conf.destination, "w");
		  fs.writeSync(fd, "define("+JSON.stringify(out, true, 1)+");", 0, "utf8");
	      });
	  }
);