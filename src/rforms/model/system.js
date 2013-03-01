define({
    getChoice: function(item, value) {
	return {"value": "http://example.com/choice2",
	 	"label": {"en": "Second choice", "sv": "Andra valet"}};
    },
    openChoiceSelector: function(binding, callback) {
	alert("Choose your poison!");
	callback({"value": "http://example.com/choice2",
	 	  "label": {"en": "Second choice", "sv": "Andra valet"}});
    }
});