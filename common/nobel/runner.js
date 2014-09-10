//#!/usr/bin/env node

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require, baseUrl: '../../../'});

var ftc = [{"value":"http://data.nobelprize.org/resource/filetype/Prize_Award_Photo","label":{"":"Prize Award Photo"}},{"value":"http://data.nobelprize.org/resource/filetype/History","label":{"":"History"}},{"value":"http://data.nobelprize.org/resource/filetype/Other_Resources","label":{"":"Other Resources"}},{"value":"http://data.nobelprize.org/resource/filetype/Popular_Information","label":{"":"Popular Information"}},{"value":"http://data.nobelprize.org/resource/filetype/Banquet_Speech","label":{"":"Banquet Speech"}},{"value":"http://data.nobelprize.org/resource/filetype/Presentation","label":{"":"Presentation"}},{"value":"http://data.nobelprize.org/resource/filetype/Poetry","label":{"":"Poetry"}},{"value":"http://data.nobelprize.org/resource/filetype/Banquet_Video","label":{"":"Banquet Video"}},{"value":"http://data.nobelprize.org/resource/filetype/Perspectives","label":{"":"Perspectives"}},{"value":"http://data.nobelprize.org/resource/filetype/Essay","label":{"":"Essay"}},{"value":"http://data.nobelprize.org/resource/filetype/Educational","label":{"":"Educational"}},{"value":"http://data.nobelprize.org/resource/filetype/Video","label":{"":"Video"}},{"value":"http://data.nobelprize.org/resource/filetype/Short_Story","label":{"":"Short Story"}},{"value":"http://data.nobelprize.org/resource/filetype/Bio-bibliography","label":{"":"Bio-bibliography"}},{"value":"http://data.nobelprize.org/resource/filetype/Speed_Read","label":{"":"Speed Read"}},{"value":"http://data.nobelprize.org/resource/filetype/Prose","label":{"":"Prose"}},{"value":"http://data.nobelprize.org/resource/filetype/Photo_Gallery","label":{"":"Photo Gallery"}},{"value":"http://data.nobelprize.org/resource/filetype/Biographical-Critical_Essay","label":{"":"Biographical-Critical Essay"}},{"value":"http://data.nobelprize.org/resource/filetype/Bibliography","label":{"":"Bibliography"}},{"value":"http://data.nobelprize.org/resource/filetype/Nobel_Lecture","label":{"":"Nobel Lecture"}},{"value":"http://data.nobelprize.org/resource/filetype/Award_Ceremony_Video","label":{"":"Award Ceremony Video"}},{"value":"http://data.nobelprize.org/resource/filetype/Greetings","label":{"":"Greetings"}},{"value":"http://data.nobelprize.org/resource/filetype/Advanced_Information","label":{"":"Advanced Information"}},{"value":"http://data.nobelprize.org/resource/filetype/Press_Release","label":{"":"Press Release"}},{"value":"http://data.nobelprize.org/resource/filetype/Prize_Announcement","label":{"":"Prize Announcement"}},{"value":"http://data.nobelprize.org/resource/filetype/Swedish_Nobel_Stamps","label":{"":"Swedish Nobel Stamps"}},{"value":"http://data.nobelprize.org/resource/filetype/Article","label":{"":"Article"}},{"value":"http://data.nobelprize.org/resource/filetype/Curriculum_Vitae","label":{"":"Curriculum Vitae"}},{"value":"http://data.nobelprize.org/resource/filetype/Biographical","label":{"":"Biographical"}},{"value":"http://data.nobelprize.org/resource/filetype/Award_Ceremony_Speech","label":{"":"Award Ceremony Speech"}},{"value":"http://data.nobelprize.org/resource/filetype/Acceptance_Speech","label":{"":"Acceptance Speech"}},{"value":"http://data.nobelprize.org/resource/filetype/Questions_and_Answers","label":{"":"Questions and Answers"}},{"value":"http://data.nobelprize.org/resource/filetype/Illustrated_Information","label":{"":"Illustrated Information"}},{"value":"http://data.nobelprize.org/resource/filetype/Nobel_Symposia","label":{"":"Nobel Symposia"}},{"value":"http://data.nobelprize.org/resource/filetype/Documentary","label":{"":"Documentary"}},{"value":"http://data.nobelprize.org/resource/filetype/Nobel_Diploma","label":{"":"Nobel Diploma"}},{"value":"http://data.nobelprize.org/resource/filetype/Prize_Presentation","label":{"":"Prize Presentation"}},{"value":"http://data.nobelprize.org/resource/filetype/Other_Prize","label":{"":"Other Prize"}},{"value":"http://data.nobelprize.org/resource/filetype/Interview","label":{"":"Interview"}}];

var cc = [
    {value: "http://data.nobelprize.org/terms/Chemistry", label: {en: "Chemistry"}},
    {value: "http://data.nobelprize.org/terms/Physics", label: {en: "Physics"}},
    {value: "http://data.nobelprize.org/terms/Litterature", label: {en: "Litterature"}},
    {value: "http://data.nobelprize.org/terms/Peace", label: {en: "Peace"}},
    {value: "http://data.nobelprize.org/terms/Economic_Sciences", label: {en: "Economic sciences"}},
    {value: "http://data.nobelprize.org/terms/Physiology_or_Medicin", label: {en: "Physiology or Medicin"}}
];

var sc = [
    {value: "1", label: {en: "Full price"}},
    {value: "2", label: {en: "Half a price"}},
    {value: "4", label: {en: "Quarter of a price"}}
]

var conf = {
    source: "terms.rdf",
    destination: "terms.js",
    ns: "http://data.nobelprize.org/terms/",
    abbrev: "nobel",
    root: "nobel:Laureate",
    literalNodeTypeDefault: "ONLY_LITERAL",
    nonGroupCardinalityDefault: {pref: 1},
    major: ["Laureate", "NobelPrize"],
    ignore: ["Category"],
    specs: {
	"category" : {type: "choice", choices: cc, cardinality: {max: 1, min: 1, pref: 1}},
	"fileType" : {type: "choice", choices: ftc, cardinality: {max: 1, min: 1, pref: 1}},
	"motivation": {nodetype: "LANGUAGE_LITERAL", styles: ["multiline"]},
	"contribution": {nodetype: "LANGUAGE_LITERAL", styles: ["multiline"]},
	"share": {type: "choice", choices: sc, cardinality: {max: 1, min: 1, pref: 1}}
    },
    order: [
    ],
    categories: []
};

requirejs(['fs', 'rdfjson/Graph', 'rdfjson/formats/converters', 'rdforms/converters/RDFS/converter'],
	function (fs, Graph, conv, rdfsconv) {
		fs.readFile(conf.source, 'utf8', function(err, data) {
			var graph = conv.rdfxml2graph(data);
		    var sirf = rdfsconv.convert(graph, conf);
		    	var fd = fs.openSync(conf.destination, "w");
			fs.writeSync(fd, "define("+JSON.stringify(sirf, true, 1)+");", 0, "utf8");

		});
	}
);
