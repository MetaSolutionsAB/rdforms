//#!/usr/bin/env node

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require, baseUrl: '../../../'});

var conf = {
    source: "terms.rdf",
    destination: "terms.js",
    ns: "http://xmlns.com/foaf/0.1/",
    abbrev: "foaf",
    root: "foaf:Person",
    major: ["Agent", "Group", "Person", "Organization", "Document", "Image", "PersonalProfileDocument", "OnlineAccount", "OnlineGamingAccount", "OnlineEcommerceAccount", "OnlineChatAccount", "Project"],
    ignore: ["geekcode", "dnaChecksum", "givenname", "surname", "family_name", "fundedBy", "theme", "holdsAccount"],
    order: [
	"name",
	"title",
	"firstName",
	"lastName",
	"img",
	"mbox",
	"phone",
	"weblog",
	"gender",
	"age",
	"birthday",
	"knows",
	"based_near",
	"topic_interest",
	"status",
	"depiction",
	"primaryTopic",
	"topic",
	"accountName",
	"accountServiceHomepage",
	"depicts",
	"focus",
	"maker",
	"member",
	"membershipClass",
	"thumbnail"
    ],
    categories: [{
	label: {en: "Online accounts"},
	properties: [
	    "account",
	    "skypeID",
	    "aimChatID",
	    "icqChatID",
	    "msnChatID",
	    "yahooChatID",
	    "jabberID",
	    "openid",
	    "tipjar"
	]
    },{
	label: {en: "Additional information"},
	properties: [
	    "page",
	    "plan",
	    "myersBriggs",
	    "familyName",
	    "givenName",
	    "homepage",
	    "nick",
	    "interest",
	    "mbox_sha1sum",
	    "made",
	    "pastProject",
	    "currentProject",
	    "publications",
	    "isPrimaryTopicOf",
	    "logo",
	    "schoolHomepage",
	    "workInfoHomepage",
	    "workplaceHomepage",
	    "sha1"
	]
    }]
};

requirejs(['fs', 'rdfjson/Graph', 'rdfjson/converters', 'rforms/converters/RDFS/converter'], 
	function (fs, Graph, conv, rdfsconv) {
		fs.readFile(conf.source, 'utf8', function(err, data) {
			var graph = conv.rdfxml2graph(data);
		    var sirf = rdfsconv.convert(graph, conf);
		    	var fd = fs.openSync(conf.destination, "w");
			fs.writeSync(fd, "define("+JSON.stringify(sirf, true, 1)+");", 0, "utf8");

		});
	}
);