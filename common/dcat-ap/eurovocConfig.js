define({
    source: "../../common/dcat-ap/eurovoc_skos.rdf",
    destination: "../../common/dcat-ap/eurovocTopLevelChoices.json",
    filter: {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": "http://eurovoc.europa.eu/schema#Domain"
    },
    requireOneOfLanguages: ["sv"],
    includeLanguages: ["en", "sv"],
    descriptionPredicates: []
});
