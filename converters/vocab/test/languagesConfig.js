define({
    source: "test/languagesSKOS.rdf",
    destination: "test/languagesChoices.json",
    requireOneOfLanguages: ["sv"],
    descriptionPredicates: ["http://www.w3.org/2004/02/skos/core#altLabel"]
});