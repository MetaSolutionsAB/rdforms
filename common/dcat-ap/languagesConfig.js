define({
    source: "../../common/dcat-ap/languagesSKOS.rdf",
    destination: "../../common/dcat-ap/languagesChoices.json",
    requireOneOfLanguages: ["sv"],
    includeLanguages: ["en", "sv"],
    descriptionPredicates: ["http://www.w3.org/2004/02/skos/core#altLabel"]
});
