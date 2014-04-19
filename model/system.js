define({
    getChoice: function(item, value, seeAlso) {
        return {"value": "http://example.com/choice1",
            "label": {"en": "First choice", "sv": "Första valet"}};
    },
    openChoiceSelector: function(binding, callback) {
        alert("This alert is a placeholder for a search dialog that should be provided as part of the integration of RDForms into a wider system.\n" +
            "Simply require the AMD module 'rdforms/model/system' and override the methods 'getChoices' and 'openChoiceSelector'.");
        callback({"value": "http://example.com/choice1",
            "label": {"en": "First choice", "sv": "Första valet "}});
    }
});